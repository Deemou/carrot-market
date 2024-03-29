import { UseFormRegister } from 'react-hook-form';
import Input from '../common/input/input';

interface ITokenForm {
  token: string;
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
