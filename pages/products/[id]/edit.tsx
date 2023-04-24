/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { NextPage } from 'next';
import useSWR from 'swr';
import useMutation from '@/libs/client/useMutation';
import { Product } from '@prisma/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import Image from 'next/image';

interface EditProductForm {
  name: string;
  price: number;
  description: string;
  productImage: FileList;
}

interface ProductResponse {
  ok: boolean;
  product: Product;
}

interface Response {
  ok: boolean;
}

const imageSizeKB = 500;
const imageSize = imageSizeKB * 1024;

const Edit: NextPage = () => {
  const router = useRouter();
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<EditProductForm>();
  const [imageFile, setImageFile] = useState<FileList>();
  const [productImagePreview, setProductImagePreview] = useState('');
  const productImageWatch = watch('productImage');

  const requestUrl = `/api/products/${router.query.id}/edit`;

  const { data: ProductData } = useSWR<ProductResponse>(
    router.query.id ? requestUrl : null
  );
  const [editProduct, { loading: editLoading, data: editData }] =
    useMutation<Response>(requestUrl);

  useEffect(() => {
    if (ProductData?.product) setValue('name', ProductData.product.name);
    if (ProductData?.product) setValue('price', ProductData.product.price);
    if (ProductData?.product)
      setValue('description', ProductData.product.description);
    if (ProductData?.product) setProductImagePreview(ProductData.product.image);
  }, [setValue, ProductData?.product]);

  const onValid = ({ name, price, description }: EditProductForm) => {
    if (editLoading) return;
    if (!imageFile || imageFile.length < 1) {
      editProduct({ name, price, description });
      return;
    }

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
          editProduct({ name, price, description, image: url });
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
    if (!ProductData) return;
    if (!ProductData.ok) void router.replace('/');
  });

  useEffect(() => {
    if (editData?.ok) {
      void router.replace(`/products/${router.query.id}`);
    }
  }, [editData, router]);

  return (
    <Layout seoTitle="Edit Product">
      {ProductData?.ok && (
        <form
          onSubmit={(...args) => void handleSubmit(onValid)(...args)}
          className="space-y-4 py-10 px-4"
        >
          <div>
            <label className="relative flex h-56 w-full cursor-pointer items-center justify-center rounded-md border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500">
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
          <Button text={editLoading ? 'Loading...' : 'Update'} />
        </form>
      )}
    </Layout>
  );
};

export default Edit;
