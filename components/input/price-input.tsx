import { FieldErrors, UseFormRegister } from 'react-hook-form';
import Input from '@components/input';

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
    </>
  );
}
