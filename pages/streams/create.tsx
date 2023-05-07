import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import useMutation from '@libs/client/useMutation';
import { Stream } from '@prisma/client';
import Layout from '@/components/layout';
import Button from '@components/button';
import Input from '@components/input';
import DescriptionInput from '@/components/input/description-input';
import PriceInput from '@/components/input/price-input';

interface CreateForm {
  name: string;
  price: string;
  description: string;
}

interface CreateResponse {
  ok: boolean;
  stream: Stream;
}

const Create: NextPage = () => {
  const router = useRouter();
  const [createStream, { loading, data }] =
    useMutation<CreateResponse>(`/api/streams`);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateForm>();
  const onValid = (form: CreateForm) => {
    if (loading) return;
    createStream(form);
  };
  useEffect(() => {
    if (data && data.ok) {
      void router.push(`/streams/${data.stream.id}`);
    }
  }, [data, router]);
  return (
    <Layout seoTitle="Create Stream">
      <form
        onSubmit={(...args) => void handleSubmit(onValid)(...args)}
        className=" space-y-4 px-4 py-10"
      >
        <Input
          type="text"
          name="name"
          label="Name"
          required
          register={register('name', { required: true })}
        />
        <PriceInput register={register} errors={errors} />
        <DescriptionInput register={register} />
        <Button text={loading ? 'Loading...' : 'Go live'} />
      </form>
    </Layout>
  );
};

export default Create;
