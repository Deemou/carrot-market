import { UseFormRegister } from 'react-hook-form';
import TextArea from '@components/textarea';

interface DescriptionInputProps {
  register: UseFormRegister<any>;
  required?: boolean;
}

export default function DescriptionInput({
  register,
  required
}: DescriptionInputProps) {
  return (
    <TextArea
      register={register('description', { required: true })}
      name="description"
      label="Description"
      required={required}
    />
  );
}
