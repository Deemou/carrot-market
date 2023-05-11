import firebase from '@/libs/server/firebase';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';

export async function getImage(imageSrc: string) {
  const smallerLength = 256;
  const resizedImages = await resizeImage(imageSrc, smallerLength);
  return resizedImages;
}

export async function getAvatar(imageSrc: string) {
  const smallerLength = 48;
  const resizedImages = await resizeImage(imageSrc, smallerLength);
  return resizedImages;
}

async function resizeImage(imageSrc: string, smallerLength: number) {
  const dataUrl = await getWebpImage(imageSrc, smallerLength);
  const resizedImage = dataURLToBlob(dataUrl);
  return resizedImage;
}

async function getWebpImage(imageSrc: string, smallerLength: number) {
  const image: any = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  const { width, height } = getSize(image.width, image.height, smallerLength);
  canvas.width = width;
  canvas.height = height;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  canvas.getContext('2d')?.drawImage(image, 0, 0, width, height);

  // As Base64 string
  return canvas.toDataURL('image/webp');
}

async function createImage(url: string) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues
    image.src = url;
  });
}

function getSize(
  imageWidth: number,
  imageHeight: number,
  smallerLength: number
) {
  let width = smallerLength;
  let height = smallerLength;
  const ratio = imageHeight / imageWidth;

  if (ratio > 1) height *= ratio;
  else width /= ratio;

  return { width, height };
}

function dataURLToBlob(dataURL: string) {
  const BASE64_MARKER = ';base64,';
  if (dataURL.indexOf(BASE64_MARKER) === -1) {
    const parts = dataURL.split(',');
    const contentType = parts[0].split(':')[1];
    const raw = parts[1];

    return new Blob([raw], { type: contentType });
  }

  const parts = dataURL.split(BASE64_MARKER);
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

export async function saveImage(imageSrc: string, storagePath: string) {
  const image = await getImage(imageSrc);
  const downloadUrl = await uploadAndGetUrl(image, storagePath);
  return downloadUrl;
}

export async function saveAvatar(imageSrc: string, storagePath: string) {
  const avatar = await getAvatar(imageSrc);
  const downloadUrl = await uploadAndGetUrl(avatar, storagePath);
  return downloadUrl;
}

async function uploadAndGetUrl(image: Blob, storagePath: string) {
  const storageService = getStorage(firebase);
  const imageRef = ref(storageService, storagePath);
  const uploadTask = uploadBytesResumable(imageRef, image);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused.');
            break;
          case 'running':
            console.log('Upload is running.');
            break;
          default:
        }
      },
      (error) => {
        console.log(error);
        reject(error);
      },
      () => {
        void getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          resolve(url);
        });
      }
    );
  });
}
