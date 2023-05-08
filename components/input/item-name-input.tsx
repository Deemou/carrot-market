import { FieldErrors, UseFormRegister } from 'react-hook-form';
import Input from '@components/input';

interface IName {
  name: string;
}

interface ItemNameInputProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<IName>;
}

export default function ItemNameInput({
  register,
  errors
}: ItemNameInputProps) {
  return (
    <>
      <Input
        type="text"
        name="name"
        label="Name"
        required
        register={register('name', {
          required: true,
          minLength: {
            value: 10,
            message: 'Name must be at least 10 characters'
          },
          maxLength: {
            value: 100,
            message: 'Name must be up to 100 characters'
          }
        })}
      />
      {errors.name && (
        <span className="my-2 block text-center text-red-600">
          {errors.name.message}
        </span>
      )}
    </>
  );
}
