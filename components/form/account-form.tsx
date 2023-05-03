/* eslint-disable no-void */
import { useForm } from 'react-hook-form';
import useMutation from '@/libs/client/useMutation';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import NameInput from '@components/input/name-input';
import Button from '../button';
import Input from '../input';

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
      <Input
        onClick={onClick}
        register={register('password', {
          required: true,
          minLength: {
            value: 9,
            message: 'Password must be at least 9 characters'
          }
        })}
        name="password"
        label="Password"
        type="password"
        required
      />
      {errors.password && (
        <span className="my-2 block text-center font-medium text-red-600">
          {errors.password.message}
        </span>
      )}
      <Button text={accountLoading ? 'Loading' : 'Create Account'} />
    </form>
  );
}
