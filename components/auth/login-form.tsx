import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Button from '@/components/common/button/button';
import Input from '@/components/common/input/input';
import { signIn } from 'next-auth/react';
import { ILoginForm } from '@/types/form';
import EmailInput from './email-input';
import ErrorMessage from '../common/error-message';
import redirectToPrevPath from '@/libs/client/redirectToPrevPath';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
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
      if (isLoading) return;
      try {
        setIsLoading(true);
        const { email, password } = validForm;
        const result = await signIn('credentials', {
          redirect: false, // 로그인 실패 시 새로고침 여부
          email,
          password
        });

        // authorize()에서 호출한 throw new Error("")가 result.error에 저장됨
        if (result?.error) setError('formErrors', { message: result.error });

        redirectToPrevPath(router);
      } catch (error) {
        console.error(error);
      }
    },
    [isLoading, router, setError]
  );

  return (
    <form onSubmit={handleSubmit(onLoginValid)} className="space-y-4">
      <EmailInput register={register} />
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
        <ErrorMessage message={errors.formErrors.message} />
      )}
      <Button text={isLoading ? 'Loading' : 'Continue'} long />
    </form>
  );
}
