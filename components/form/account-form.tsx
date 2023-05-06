import { useForm } from 'react-hook-form';
import useMutation from '@/libs/client/useMutation';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import NameInput from '@components/input/name-input';
import PasswordInput from '@components/input/password-input';
import Button from '@components/button';

interface IAccountForm {
  name: string;
  password: string;
  formErrors?: string;
}

interface MutationResult {
  ok: boolean;
  error?: string;
}

export default function AccountForm() {
  const router = useRouter();
  const [createAccount, { loading: accountLoading, data: accountData }] =
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
    if (accountLoading) return;
    createAccount(validForm);
  };

  useEffect(() => {
    if (!accountData) return;
    if (accountData.ok) void router.replace('/');
    if (accountData.error)
      setError('formErrors', { message: accountData.error });
  }, [accountData, router, setError]);

  return (
    <form
      onSubmit={(...args) => void handleSubmit(onAccountValid)(...args)}
      className="mt-8 flex flex-col space-y-4"
    >
      <NameInput onClick={onClick} register={register} errors={errors} />
      <PasswordInput onClick={onClick} register={register} errors={errors} />
      <Button text={accountLoading ? 'Loading' : 'Create Account'} />
    </form>
  );
}
