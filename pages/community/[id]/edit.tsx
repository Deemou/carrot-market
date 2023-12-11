import { NextPage } from 'next';
import useSWR from 'swr';
import useMutation from '@/libs/client/useMutation';
import { Post } from '@prisma/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '@/components/common/layout';
import Button from '@/components/common/button/button';
import { useForm } from 'react-hook-form';
import PostInput from '@/components/community/post-input';

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
  const buttonText = 'Update';
  const pageType = 'community';
  const { register, setValue, handleSubmit } = useForm<EditPostForm>();

  const requestUrl = `/api/${pageType}/${router.query.id}/edit`;

  const { data: postData } = useSWR<PostResponse>(
    router.query.id ? requestUrl : null
  );
  const [editPost, { loading, data }] = useMutation<Response>(requestUrl);

  useEffect(() => {
    if (postData?.post) setValue('question', postData.post.question);
  }, [setValue, postData?.post]);

  const onValid = (form: EditPostForm) => {
    if (loading) return;
    editPost(form);
  };

  useEffect(() => {
    if (!postData) return;
    if (!postData.ok) router.replace(`/${pageType}`);
  });

  useEffect(() => {
    if (data?.ok) {
      router.replace(`/${pageType}/${router.query.id}`);
    }
  }, [data, router]);

  return (
    <Layout seoTitle="Edit Post">
      {postData?.ok && (
        <form
          onSubmit={handleSubmit(onValid)}
          className="mx-auto flex w-full max-w-xl flex-col space-y-4 py-10"
        >
          <PostInput register={register} />
          <Button text={loading ? 'Loading...' : buttonText} />
        </form>
      )}
    </Layout>
  );
};

export default Edit;
