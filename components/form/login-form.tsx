/* eslint-disable no-void */
import { useForm } from 'react-hook-form';
import useMutation from '@/libs/client/useMutation';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from '../button';
import Input from '../input';

interface ILoginForm {
  email: string;
  password: string;
  formErrors?: string;
}

interface MutationResult {
  ok: boolean;
  error?: string;
}

const loginUrl = '/api/users/login';

export default function LoginForm() {
  const router = useRouter();
  const [enter, { loading: loginLoading, data: loginData }] =
    useMutation<MutationResult>(loginUrl);
  const {
    register: loginRegister,
    handleSubmit: loginHandleSubmit,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<ILoginForm>();

  const onClick = () => {
    clearErrors('formErrors');
  };

  const onLoginValid = (validForm: ILoginForm) => {
    if (loginLoading) return;
    enter(validForm);
  };

  useEffect(() => {
    if (!loginData) return;
    if (loginData.ok) void router.replace('/');
    if (loginData.error) setError('formErrors', { message: loginData.error });
  }, [loginData, router, setError]);

  return (
    <form
      onSubmit={(...args) => void loginHandleSubmit(onLoginValid)(...args)}
      className="mt-8 flex flex-col space-y-4"
    >
      <Input
        onClick={onClick}
        register={loginRegister('email', {
          required: true
        })}
        name="email"
        label="Email address"
        type="email"
        required
      />
      <Input
        onClick={onClick}
        register={loginRegister('password', {
          required: true
        })}
        name="password"
        label="Password"
        type="password"
        required
      />
      {errors.formErrors && (
        <span className="my-2 block text-center font-medium text-red-600">
          {errors.formErrors.message}
        </span>
      )}
      <Button text={loginLoading ? 'Loading' : 'Continue'} />
    </form>
  );
}
