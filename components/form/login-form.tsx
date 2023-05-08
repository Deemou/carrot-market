import { useForm } from 'react-hook-form';
import useMutation from '@/libs/client/useMutation';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from '@components/button';
import Input from '@components/input';

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
  const [enter, { loading, data }] = useMutation<MutationResult>(loginUrl);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<ILoginForm>();

  const onClick = () => {
    clearErrors('formErrors');
  };

  const onLoginValid = (validForm: ILoginForm) => {
    if (loading) return;
    enter(validForm);
  };

  useEffect(() => {
    if (!data) return;
    if (data.ok) void router.replace('/');
    if (data.error) setError('formErrors', { message: data.error });
  }, [data, router, setError]);

  return (
    <form
      onSubmit={(...args) => void handleSubmit(onLoginValid)(...args)}
      className="mt-8 flex flex-col space-y-4"
    >
      <Input
        onClick={onClick}
        type="email"
        name="email"
        label="Email address"
        required
        register={register('email', {
          required: true
        })}
      />
      <Input
        onClick={onClick}
        type="password"
        name="password"
        label="Password"
        required
        register={register('password', {
          required: true
        })}
      />
      {errors.formErrors && (
        <span className="my-2 block text-center text-red-600">
          {errors.formErrors.message}
        </span>
      )}
      <Button text={loading ? 'Loading' : 'Continue'} />
    </form>
  );
}
