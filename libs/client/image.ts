/* eslint-disable @typescript-eslint/no-unsafe-argument */
export async function getImage(imageSrc: string) {
  const width = 256;
  const height = 256;
  const resizedImages = await resizeImage(imageSrc, width, height);
  return resizedImages;
}

export async function getAvatarImage(imageSrc: string) {
  const width = 48;
  const height = 48;
  const resizedImages = await resizeImage(imageSrc, width, height);
  return resizedImages;
}

async function resizeImage(imageSrc: string, width: number, height: number) {
  const dataUrl = await getWebpImage(imageSrc, width, height);
  const resizedImage = dataURLToBlob(dataUrl);
  return resizedImage;
}

async function getWebpImage(imageSrc: string, width: number, height: number) {
  const image: any = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
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
