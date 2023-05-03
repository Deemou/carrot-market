/* eslint-disable no-void */
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Product } from '@prisma/client';
import useMutation from '@libs/client/useMutation';
import { v4 as uuidv4 } from 'uuid';
import firebase from '@libs/server/firebase';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';
import Layout from '@/components/layout';
import Button from '@components/button';
import Input from '@components/input';
import TextArea from '@components/textarea';

interface UploadProductForm {
  name: string;
  price: number;
  description: string;
  productImage: FileList;
}

interface UploadProductMutation {
  ok: boolean;
  product: Product;
}

const imageSizeKB = 500;
const imageSize = imageSizeKB * 1024;

const Upload: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<UploadProductForm>();
  const [imageFile, setImageFile] = useState<FileList>();
  const [productImagePreview, setProductImagePreview] = useState('');
  const productImageWatch = watch('productImage');

  const [uploadProduct, { loading, data }] =
    useMutation<UploadProductMutation>('/api/products');
  const onValid = ({ name, price, description }: UploadProductForm) => {
    if (loading) return;
    if (!imageFile || imageFile.length < 1) return;

    const storageService = getStorage(firebase);
    const imageRef = ref(storageService, `product/${uuidv4()}`);
    const uploadTask = uploadBytesResumable(imageRef, imageFile[0]);
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
      },
      () => {
        void getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          uploadProduct({ name, price, description, image: url });
        });
      }
    );
  };

  useEffect(() => {
    if (
      productImageWatch &&
      productImageWatch?.length > 0 &&
      productImageWatch[0].size > imageSize
    ) {
      alert(`Please upload an image less than ${imageSizeKB}KB.`);
      return;
    }

    setImageFile(productImageWatch);
    if (imageFile && imageFile.length > 0) {
      setProductImagePreview(URL.createObjectURL(imageFile[0]));
    }
  }, [imageFile, productImageWatch]);

  useEffect(() => {
    if (data?.ok) {
      void router.replace(`/products/${data.product.id}`);
    }
  }, [data, router]);

  return (
    <Layout seoTitle="Upload Product">
      <form
        className="space-y-4 p-4 py-10"
        onSubmit={(...args) => void handleSubmit(onValid)(...args)}
      >
        <div>
          <label
            htmlFor="picture"
            className="relative flex h-56 w-full cursor-pointer items-center justify-center rounded-md border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500"
          >
            {productImagePreview ? (
              <Image
                src={productImagePreview}
                fill
                alt="product"
                priority
                className="object-center"
              />
            ) : (
              <svg
                className="h-12 w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <input
              {...register('productImage')}
              id="picture"
              type="file"
              accept="image/*"
              className="hidden"
            />
          </label>
        </div>
        <Input
          register={register('name')}
          required
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register('price', {
            required: true,
            min: {
              value: 0,
              message: 'Price must be at least 0.'
            }
          })}
          required
          label="Price"
          name="price"
          type="number"
          kind="price"
        />
        {errors.price && (
          <span className="my-2 block text-center font-medium text-red-600">
            {errors.price.message}
          </span>
        )}
        <TextArea
          register={register('description', { required: true })}
          required
          name="description"
          label="Description"
        />
        <Button text={loading ? 'Loading...' : 'Upload'} />
      </form>
    </Layout>
  );
};

export default Upload;
