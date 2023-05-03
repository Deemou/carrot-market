import { FieldErrors, UseFormRegister } from 'react-hook-form';
import Input from '@components/input';

interface IPassword {
  password: string;
}

interface PasswordInputProps {
  onClick: () => void;
  register: UseFormRegister<any>;
  errors: FieldErrors<IPassword>;
}

export default function PasswordInput({
  onClick,
  register,
  errors
}: PasswordInputProps) {
  return (
    <>
      <Input
        onClick={onClick}
        register={register('password', {
          required: true,
          minLength: {
            value: 9,
            message: 'Password must be at least 9 characters'
          }
        })}
        label="Password"
        name="password"
        type="password"
        required
      />
      {errors.password && (
        <span className="my-2 block text-center font-medium text-red-600">
          {errors.password.message}
        </span>
      )}
    </>
  );
}
