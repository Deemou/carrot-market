import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Post } from '@prisma/client';
import useMutation from '@libs/client/useMutation';
import useCoords from '@libs/client/useCoords';
import Layout from '@/components/layout';
import Button from '@components/button';
import TextArea from '@components/textarea';

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
    <Layout seoTitle="Write Community Post">
      <form
        onSubmit={(...args) => void handleSubmit(onValid)(...args)}
        className="space-y-4 p-4 py-10"
      >
        <TextArea
          name="question"
          label="Question"
          required
          register={register('question', { required: true, minLength: 5 })}
          placeholder="Ask a question!"
        />
        <Button text={loading ? 'Loading...' : 'Upload'} />
      </form>
    </Layout>
  );
};

export default Write;
