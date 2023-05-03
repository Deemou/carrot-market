import { UseFormRegister } from 'react-hook-form';
import Input from '../input';

interface IEmailForm {
  email: string;
  formErrors?: string;
}

interface EmailInputProps {
  register: UseFormRegister<IEmailForm>;
  onClick?: () => void;
}

export default function EmailInput({ register, onClick }: EmailInputProps) {
  return (
    <Input
      onClick={onClick}
      register={register('email', {
        required: true
      })}
      label="Email address"
      name="email"
      type="email"
      required
    />
  );
}

EmailInput.defaultProps = {
  onClick: () => {}
};
