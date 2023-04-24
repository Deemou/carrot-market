/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { NextPage } from 'next';
import useSWR from 'swr';
import useMutation from '@/libs/client/useMutation';
import { Post } from '@prisma/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '@/components/layout';
import Button from '@components/button';
import Input from '@components/input';
import { useForm } from 'react-hook-form';

interface EditPostForm {
  question: string;
}

interface PostResponse {
  ok: boolean;
  post: Post;
}

interface Response {
  ok: boolean;
}

const Edit: NextPage = () => {
  const router = useRouter();
  const { register, setValue, handleSubmit } = useForm<EditPostForm>();

  const requestUrl = `/api/posts/${router.query.id}/edit`;

  const { data: postData } = useSWR<PostResponse>(
    router.query.id ? requestUrl : null
  );
  const [editPost, { loading: editLoading, data: editData }] =
    useMutation<Response>(requestUrl);

  useEffect(() => {
    if (postData?.post) setValue('question', postData.post.question);
  }, [setValue, postData?.post]);

  const onValid = (form: EditPostForm) => {
    if (editLoading) return;
    editPost(form);
  };

  useEffect(() => {
    if (!postData) return;
    if (!postData.ok) void router.replace('/community');
  });

  useEffect(() => {
    if (editData?.ok) {
      void router.replace(`/community/${router.query.id}`);
    }
  }, [editData, router]);

  return (
    <Layout seoTitle="Edit Post">
      {postData?.ok && (
        <form
          onSubmit={(...args) => void handleSubmit(onValid)(...args)}
          className="space-y-4 py-10 px-4"
        >
          <Input
            register={register('question')}
            required
            label="Question"
            name="question"
            type="text"
          />
          <Button text={editLoading ? 'Loading...' : 'Update'} />
        </form>
      )}
    </Layout>
  );
};

export default Edit;
