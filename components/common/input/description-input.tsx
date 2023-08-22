import { UseFormRegister } from 'react-hook-form';
import TextArea from '@/components/common/textarea';

interface DescriptionInputProps {
  register: UseFormRegister<any>;
}

export default function DescriptionInput({ register }: DescriptionInputProps) {
  return (
    <TextArea
      name="description"
      label="Description"
      required
      register={register('description', { required: true })}
    />
  );
}
