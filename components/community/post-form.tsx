import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Post } from '@prisma/client';
import useMutation from '@libs/client/useMutation';
import useCoords from '@libs/client/useCoords';
import Button from '@/components/common/button/button';
import TextArea from '@/components/common/textarea';

interface IPostForm {
  question: string;
}

interface PostResponse {
  ok: boolean;
  post: Post;
}

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
      router.push(`/community/${data.post.id}`);
    }
  }, [data, router]);

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className="mx-auto w-full max-w-xl space-y-4 py-10"
    >
      <TextArea
        name="question"
        label="Question"
        required
        register={register('question', { required: true, minLength: 5 })}
        placeholder="Ask a question!"
      />
      <Button text={loading ? 'Loading...' : buttonText} />
    </form>
  );
}
