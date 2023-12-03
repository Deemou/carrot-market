import { useForm } from 'react-hook-form';
import useMutation from '@/libs/client/useMutation';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import NameInput from '@/components/common/input/name-input';
import PasswordInput from '@/components/auth/password-input';
import Button from '@/components/common/button/button';

interface IAccountForm {
  name: string;
  password: string;
  formErrors?: string;
}

interface MutationResult {
  ok: boolean;
  error?: string;
}

interface AccountFormProps {
  email: string;
}

export default function AccountForm({ email }: AccountFormProps) {
  const router = useRouter();
  const [createAccount, { loading, data }] =
    useMutation<MutationResult>('/api/users/sign-up');
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<IAccountForm>();

  const onClick = () => {
    clearErrors('formErrors');
  };

  const onAccountValid = (validForm: IAccountForm) => {
    if (loading) return;
    createAccount({ email, ...validForm });
  };

  useEffect(() => {
    if (!data) return;
    if (data.ok) router.replace('/');
    if (data.error) setError('formErrors', { message: data.error });
  }, [data, router, setError]);

  return (
    <form onSubmit={handleSubmit(onAccountValid)} className="mt-8 space-y-4">
      <NameInput onClick={onClick} register={register} errors={errors} />
      <PasswordInput onClick={onClick} register={register} errors={errors} />
      <Button text={loading ? 'Loading' : 'Create Account'} />
    </form>
  );
}
