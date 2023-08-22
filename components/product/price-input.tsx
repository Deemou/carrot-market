import { FieldErrors, UseFormRegister } from 'react-hook-form';
import Input from '@/components/common/input/input';

interface IPrice {
  price: number;
}

interface PriceInputProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<IPrice>;
}

export default function PriceInput({ register, errors }: PriceInputProps) {
  return (
    <>
      <Input
        type="number"
        kind="price"
        name="price"
        label="Price"
        required
        register={register('price', {
          required: true,
          valueAsNumber: true,
          min: {
            value: 0,
            message: 'Price must be at least 0.'
          }
        })}
      />
      {errors.price && (
        <span className="my-2 block text-center text-red-600">
          {errors.price.message}
        </span>
      )}
    </>
  );
}
