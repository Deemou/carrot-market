import { UseFormRegister } from 'react-hook-form';
import Input from '@components/input';

interface IEmailForm {
  email: string;
  formErrors?: string;
}

interface EmailInputProps {
  onClick?: () => void;
  disabled?: boolean;
  register: UseFormRegister<IEmailForm>;
}

export default function EmailInput({
  register,
  disabled,
  onClick
}: EmailInputProps) {
  return (
    <Input
      onClick={onClick}
      type="email"
      name="email"
      label="Email address"
      required
      disabled={disabled}
      register={register('email', {
        required: true
      })}
    />
  );
}

EmailInput.defaultProps = {
  onClick: () => {},
  disabled: false
};
