import { RegisterOptions, UseFormRegisterReturn } from 'react-hook-form';
import Input from '@components/input';
import { IEmailForm, ILoginForm } from '@/types/form';

type LoginFormOrEmailForm = ILoginForm | IEmailForm;

interface EmailInputProps<T extends LoginFormOrEmailForm> {
  onClick?: () => void;
  disabled?: boolean;
  register: (
    key: keyof Pick<T, 'email'>,
    options?: RegisterOptions
  ) => UseFormRegisterReturn;
}

export default function EmailInput<T extends LoginFormOrEmailForm>({
  register,
  disabled,
  onClick
}: EmailInputProps<T>) {
  return (
    <Input
      onClick={onClick}
      type="email"
      name="email"
      label="Email address"
      required
      disabled={disabled}
      register={register('email', { required: true })}
    />
  );
}

EmailInput.defaultProps = {
  onClick: () => {},
  disabled: false
};
