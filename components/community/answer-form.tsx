import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import useMutation from '@libs/client/useMutation';
import { KeyedMutator } from 'swr';
import {
  AnswerResponse,
  CommunityPostResponse,
  IAnswerForm
} from '@/types/community';
import Answernput from './answer-input';
import Button from '../common/button/button';

interface AnswerFormProps {
  requestUrl: string;
  buttonText: string;
  mutate: KeyedMutator<CommunityPostResponse>;
}

export default function AnswerForm({
  requestUrl,
  buttonText,
  mutate
}: AnswerFormProps) {
  const { register, handleSubmit, reset } = useForm<IAnswerForm>();

  const [sendAnswer, { data, loading }] = useMutation<AnswerResponse>(
    `${requestUrl}/answers`
  );

  const onValid = (form: IAnswerForm) => {
    if (loading) return;
    sendAnswer(form);
  };

  useEffect(() => {
    if (data && data.ok) {
      reset();
      mutate();
    }
  }, [data, reset, mutate]);

  return (
    <form onSubmit={handleSubmit(onValid)} className="flex flex-col space-y-4">
      <Answernput register={register} />
      <Button text={loading ? 'Loading...' : buttonText} />
    </form>
  );
}