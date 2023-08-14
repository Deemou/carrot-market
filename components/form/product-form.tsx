import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useMutation from '@/libs/client/useMutation';
import { saveImage, saveThumbImage } from '@/libs/client/image';
import { v4 as uuidv4 } from 'uuid';
import PriceInput from '@components/input/price-input';
import Button from '@/components/button/button';
import { Product } from '@prisma/client';
import ImageInput from '@components/input/image-input';
import DescriptionInput from '@components/input/description-input';
import ItemNameInput from '@components/input/item-name-input';

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

interface MutationResult {
  ok: boolean;
  id: number;
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
    if (!ProductData.ok) router.replace('/');
  });

  useEffect(() => {
    if (!ProductData?.product) return;
    setValue('name', ProductData.product.name);
    setValue('price', ProductData.product.price);
    setValue('description', ProductData.product.description);
    setProductImagePreview(ProductData.product.image);
  }, [setValue, ProductData?.product]);

  const [postProduct, { loading, data }] =
    useMutation<MutationResult>(requestUrl);

  const onValid = async ({ name, price, description }: IProductForm) => {
    if (loading) return;
    if (!imageFile || imageFile.length < 1) {
      if (!productImagePreview) return;
      postProduct({
        name,
        price,
        description
      });
      return;
    }

    const storagePath = `product/${uuidv4()}`;
    const thumbStoragePath = `product/thumb/${uuidv4()}`;
    const image = await saveImage(productImagePreview, storagePath);
    const thumbImage = await saveThumbImage(
      productImagePreview,
      thumbStoragePath
    );

    postProduct({
      name,
      price,
      description,
      image,
      thumbImage
    });
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
      router.replace(`/products/${data.id}`);
    }
  }, [data, router]);

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-4 p-4 py-10">
      <ImageInput
        imagePreview={productImagePreview}
        register={register('productImage')}
      />
      <ItemNameInput register={register} errors={errors} />
      <PriceInput register={register} errors={errors} />
      <DescriptionInput register={register} />
      <Button text={loading ? 'Loading...' : buttonText} />
    </form>
  );
}
