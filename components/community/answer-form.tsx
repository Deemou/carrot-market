import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Answer } from '@prisma/client';
import useMutation from '@libs/client/useMutation';
import TextArea from '@/components/common/textarea';
import { KeyedMutator } from 'swr';
import { CommunityPostResponse } from '@/types/community';

interface IAnswerForm {
  answer: string;
}

interface AnswerResponse {
  ok: boolean;
  Answer: Answer;
}

interface AnswerFormProps {
  requestUrl: string;
  mutate: KeyedMutator<CommunityPostResponse>;
}

export default function AnswerForm({ requestUrl, mutate }: AnswerFormProps) {
  const { register, handleSubmit, reset } = useForm<IAnswerForm>();

  const [sendAnswer, { data: answerData, loading: answerLoading }] =
    useMutation<AnswerResponse>(`${requestUrl}/answers`);

  const onValid = (form: IAnswerForm) => {
    if (answerLoading) return;
    sendAnswer(form);
  };
  useEffect(() => {
    if (answerData && answerData.ok) {
      reset();
      mutate();
    }
  }, [answerData, reset, mutate]);

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <TextArea
        name="answer"
        required
        register={register('answer', { required: true, minLength: 5 })}
        placeholder="Answer this question!"
      />
      <button
        type="submit"
        className="mt-2 w-full rounded-md border border-transparent bg-orange-500 py-2 shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        {answerLoading ? 'Loading...' : 'Reply'}
      </button>
    </form>
  );
}
