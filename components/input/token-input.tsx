import { UseFormRegister } from 'react-hook-form';
import Input from '../input';

interface ITokenForm {
  token: string;
  formErrors?: string;
}

interface TokenInputProps {
  onClick?: () => void;
  register: UseFormRegister<ITokenForm>;
}

export default function TokenInput({ onClick, register }: TokenInputProps) {
  return (
    <Input
      onClick={onClick}
      type="number"
      name="token"
      label="Confirmation Token"
      required
      register={register('token', {
        required: true
      })}
    />
  );
}

TokenInput.defaultProps = {
  onClick: () => {}
};
