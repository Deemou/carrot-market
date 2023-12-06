import { UseFormRegister } from 'react-hook-form';
import TextArea from '@/components/common/textarea';
import { IAnswerForm } from '@/types/community';

interface AnswerInputProps {
  register: UseFormRegister<IAnswerForm>;
}

export default function AnswerInput({ register }: AnswerInputProps) {
  return (
    <TextArea
      name="answer"
      required
      register={register('answer', { required: true })}
      placeholder="Answer this question!"
    />
  );
}
