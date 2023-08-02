import Image from 'next/image';
import { UseFormRegisterReturn } from 'react-hook-form';
import ImageIcon from '../icon/image-icon';

interface ImageInputProps {
  imagePreview: string;
  register: UseFormRegisterReturn;
}

export default function ImageInput({
  imagePreview,
  register
}: ImageInputProps) {
  return (
    <div>
      <label
        htmlFor="picture"
        className="relative mx-auto flex aspect-square w-1/2 max-w-[400px] cursor-pointer items-center justify-center rounded-md border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500"
      >
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt="product"
            fill
            sizes="50vw"
            priority
            className="object-center"
          />
        ) : (
          <ImageIcon />
        )}
        <input
          id="picture"
          type="file"
          accept="image/*"
          {...register}
          className="hidden"
        />
      </label>
    </div>
  );
}
