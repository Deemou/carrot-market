import { useForm } from 'react-hook-form';
import useMutation from '@/libs/client/useMutation';
import { Dispatch, SetStateAction, useEffect } from 'react';
import Button from '@/components/common/button/button';
import TokenInput from '@/components/auth/token-input';
import { useSession } from 'next-auth/react';
import ErrorMessage from '../common/error-message';

interface ITokenForm {
  token: string;
  formErrors?: string;
}

interface MutationResult {
  ok: boolean;
  error?: string;
}

interface TokenFormProps {
  email: string;
  setIsTokenOk: Dispatch<SetStateAction<boolean>>;
}

export default function TokenForm({ email, setIsTokenOk }: TokenFormProps) {
  const { data: session, update } = useSession();

  const [confirmToken, { loading, data }] =
    useMutation<MutationResult>('/api/users/confirm');
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<ITokenForm>();

  const onClick = () => {
    clearErrors('formErrors');
  };

  const onTokenValid = (validForm: ITokenForm) => {
    if (loading) return;
    confirmToken({ email, ...validForm });
  };

  useEffect(() => {
    const handleUpdate = async () => {
      await update({
        ...session,
        user: {
          ...session?.user,
          email
        }
      });
    };

    if (!data) return;
    if (data.ok) {
      setIsTokenOk(true);
      handleUpdate();
    }
    if (data.error) setError('formErrors', { message: data.error });
  }, [data, email, session, setError, setIsTokenOk, update]);

  return (
    <form
      onSubmit={handleSubmit(onTokenValid)}
      className="mt-8 flex flex-col space-y-4"
    >
      <TokenInput onClick={onClick} register={register} />
      {errors.formErrors && (
        <ErrorMessage message={errors.formErrors.message} />
      )}
      <Button text={loading ? 'Loading' : 'Confirm Token'} />
      <h3 className="my-4 flex justify-center text-red-400">
        We&apos;ve sent a verification code to your email.
      </h3>
    </form>
  );
}
