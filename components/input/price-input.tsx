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
          valueAsNumber: true,
          min: {
            value: 0,
            message: 'Price must be at least 0.'
          }
        })}
        label="Price"
        name="price"
        type="number"
        kind="price"
        required
      />
      {errors.price && (
        <span className="my-2 block text-center font-medium text-red-600">
          {errors.price.message}
        </span>
      )}
    </>
  );
}
