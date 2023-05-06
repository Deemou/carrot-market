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
        register={register('email', {
          required: true
        })}
        name="email"
        label="Email address"
        type="email"
        required
      />
      <Input
        onClick={onClick}
        register={register('password', {
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
      <Button text={loading ? 'Loading' : 'Continue'} />
    </form>
  );
}
