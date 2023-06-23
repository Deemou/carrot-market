import { useForm } from 'react-hook-form';
import useMutation from '@/libs/client/useMutation';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import Button from '@/components/button/button';
import Input from '@components/input';
import { signIn } from 'next-auth/react';

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

  const onLoginValid = useCallback(
    async (validForm: ILoginForm) => {
      try {
        const { email, password } = validForm;
        const result = await signIn('credentials', {
          redirect: false, // 로그인 실패 시 새로고침 여부
          email,
          password
        });

        // authorize()에서 호출한 throw new Error("")가 result.error에 저장됨
        if (result?.error) setError('formErrors', { message: result.error });

        await router.replace('/');
      } catch (error) {
        console.error(error);
      }
    },
    [router, setError]
  );

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
