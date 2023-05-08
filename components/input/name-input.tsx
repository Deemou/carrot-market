import { FieldErrors, UseFormRegister } from 'react-hook-form';
import Input from '@components/input';

interface IName {
  name: string;
}

interface NameInputProps {
  onClick: () => void;
  register: UseFormRegister<any>;
  errors: FieldErrors<IName>;
}

export default function NameInput({
  onClick,
  register,
  errors
}: NameInputProps) {
  return (
    <>
      <Input
        onClick={onClick}
        type="text"
        name="name"
        label="Name"
        required
        register={register('name', {
          required: true,
          minLength: {
            value: 5,
            message: 'Name must be at least 5 characters'
          },
          maxLength: {
            value: 18,
            message: 'Name must be up to 18 characters'
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
