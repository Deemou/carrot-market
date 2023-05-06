import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useMutation from '@/libs/client/useMutation';
import { getImage } from '@/libs/client/image';
import { v4 as uuidv4 } from 'uuid';
import firebase from '@/libs/server/firebase';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';
import Input from '@components/input';
import PriceInput from '@components/input/price-input';
import TextArea from '@components/textarea';
import Button from '@components/button';
import Image from 'next/image';
import { Product } from '@prisma/client';

interface IProductForm {
  name: string;
  price: number;
  description: string;
  productImage: FileList;
}

interface ProductResponse {
  ok: boolean;
  product: Product;
}

interface ProducFormProps {
  buttonText: string;
  requestUrl: string;
}

const imageSizeKB = 1000;
const imageSize = imageSizeKB * 1024;

export default function ProductForm({
  buttonText,
  requestUrl
}: ProducFormProps) {
  const router = useRouter();
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<IProductForm>();
  const [imageFile, setImageFile] = useState<FileList>();
  const [productImagePreview, setProductImagePreview] = useState('');
  const productImageWatch = watch('productImage');

  const { data: ProductData } = useSWR<ProductResponse>(
    router.query.id ? requestUrl : null
  );

  useEffect(() => {
    if (!ProductData) return;
    if (!ProductData.ok) void router.replace('/');
  });

  useEffect(() => {
    if (ProductData?.product) setValue('name', ProductData.product.name);
    if (ProductData?.product) setValue('price', ProductData.product.price);
    if (ProductData?.product)
      setValue('description', ProductData.product.description);
    if (ProductData?.product) setProductImagePreview(ProductData.product.image);
  }, [setValue, ProductData?.product]);

  const [postProduct, { loading, data }] =
    useMutation<ProductResponse>(requestUrl);

  const onValid = async ({ name, price, description }: IProductForm) => {
    if (loading) return;
    if (!imageFile || imageFile.length < 1) {
      postProduct({ name, price, description });
      return;
    }

    const image = await getImage(productImagePreview);
    const storageService = getStorage(firebase);
    const imageRef = ref(storageService, `product/${uuidv4()}`);
    const uploadTask = uploadBytesResumable(imageRef, image);
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
          postProduct({ name, price, description, image: url });
        });
      }
    );
  };

  useEffect(() => {
    if (productImageWatch?.length && productImageWatch[0].size > imageSize) {
      alert(`Please upload an image less than ${imageSizeKB}KB.`);
      return;
    }

    setImageFile(productImageWatch);
    if (imageFile && imageFile.length) {
      setProductImagePreview(URL.createObjectURL(imageFile[0]));
    }
  }, [imageFile, productImageWatch]);

  useEffect(() => {
    if (data?.ok) {
      void router.replace(`/products/${data.product.id}`);
    }
  }, [data, router]);

  return (
    <form
      className="space-y-4 p-4 py-10"
      onSubmit={(...args) => void handleSubmit(onValid)(...args)}
    >
      <div>
        <label
          htmlFor="picture"
          className="relative mx-auto flex aspect-square max-w-[256px] cursor-pointer items-center justify-center rounded-md border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500"
        >
          {productImagePreview ? (
            <Image
              src={productImagePreview}
              alt="product"
              fill
              sizes="50vw"
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
      <PriceInput register={register} errors={errors} />
      <TextArea
        register={register('description', { required: true })}
        required
        name="description"
        label="Description"
      />
      <Button text={loading ? 'Loading...' : buttonText} />
    </form>
  );
}
