import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import useMutation from '@libs/client/useMutation';
import useCoords from '@libs/client/useCoords';
import Button from '@/components/common/button/button';
import { IPostForm, PostResponse } from '@/types/community';
import PostInput from './post-input';
import { COMMUNITY } from '@/pageTypes';

interface PostFormProps {
  buttonText: string;
  requestUrl: string;
}

export default function PostForm({ buttonText, requestUrl }: PostFormProps) {
  const { latitude, longitude } = useCoords();
  const router = useRouter();
  const { register, handleSubmit } = useForm<IPostForm>();
  const [post, { loading, data }] = useMutation<PostResponse>(requestUrl);

  const onValid = (formData: IPostForm) => {
    if (loading) return;
    post({ ...formData, latitude, longitude });
  };

  useEffect(() => {
    if (data && data.ok) {
      router.push(`/${COMMUNITY}/${data.post.id}`);
    }
  }, [data, router]);

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className="mx-auto flex w-full max-w-xl flex-col space-y-4 py-10"
    >
      <PostInput register={register} />
      <Button text={loading ? 'Loading...' : buttonText} />
    </form>
  );
}
