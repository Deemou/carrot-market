import { UseFormRegister } from 'react-hook-form';
import Input from '../input';

interface ITokenForm {
  token: string;
  formErrors?: string;
}

interface TokenInputProps {
  register: UseFormRegister<ITokenForm>;
  onClick?: () => void;
}

export default function TokenInput({ register, onClick }: TokenInputProps) {
  return (
    <Input
      onClick={onClick}
      register={register('token', {
        required: true
      })}
      label="Confirmation Token"
      name="token"
      type="number"
      required
    />
  );
}

TokenInput.defaultProps = {
  onClick: () => {}
};
