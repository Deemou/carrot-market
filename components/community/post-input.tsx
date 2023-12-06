import { UseFormRegister } from 'react-hook-form';
import TextArea from '@/components/common/textarea';
import { IPostForm } from '@/types/community';

interface PostInputProps {
  register: UseFormRegister<IPostForm>;
}

export default function PostInput({ register }: PostInputProps) {
  return (
    <TextArea
      name="question"
      label="Question"
      required
      register={register('question', { required: true, minLength: 5 })}
      placeholder="Ask a question!"
    />
  );
}
