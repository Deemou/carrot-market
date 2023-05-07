import { UseFormRegister } from 'react-hook-form';
import Input from '@components/input';

interface IEmailForm {
  email: string;
  formErrors?: string;
}

interface EmailInputProps {
  onClick?: () => void;
  register: UseFormRegister<IEmailForm>;
}

export default function EmailInput({ register, onClick }: EmailInputProps) {
  return (
    <Input
      onClick={onClick}
      type="email"
      name="email"
      label="Email address"
      required
      register={register('email', {
        required: true
      })}
    />
  );
}

EmailInput.defaultProps = {
  onClick: () => {}
};
