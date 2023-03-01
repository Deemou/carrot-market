/* eslint-disable no-void */
import type { NextPage } from 'next';
import Button from '@components/button';
import TextArea from '@components/textarea';
import { useForm } from 'react-hook-form';
import useMutation from '@libs/client/useMutation';
import { useEffect } from 'react';
import { Post } from '@prisma/client';
import { useRouter } from 'next/router';
import useCoords from '@libs/client/useCoords';

interface WriteForm {
  question: string;
}

interface WriteResponse {
  ok: boolean;
  post: Post;
}

const Write: NextPage = () => {
  const { latitude, longitude } = useCoords();
  const router = useRouter();
  const { register, handleSubmit } = useForm<WriteForm>();
  const [post, { loading, data }] = useMutation<WriteResponse>('/api/posts');
  const onValid = (formData: WriteForm) => {
    if (loading) return;
    post({ ...formData, latitude, longitude });
  };
  useEffect(() => {
    if (data && data.ok) {
      void router.push(`/community/${data.post.id}`);
    }
  }, [data, router]);
  return (
    <form
      onSubmit={(...args) => void handleSubmit(onValid)(...args)}
      className="space-y-4 p-4"
    >
      <TextArea
        register={register('question', { required: true, minLength: 5 })}
        required
        placeholder="Ask a question!"
      />
      <Button text={loading ? 'Loading...' : 'Submit'} />
    </form>
  );
};

export default Write;
