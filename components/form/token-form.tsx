import { useForm } from 'react-hook-form';
import useMutation from '@/libs/client/useMutation';
import { Dispatch, SetStateAction, useEffect } from 'react';
import Button from '@components/button';
import TokenInput from '@components/input/token-input';

interface ITokenForm {
  token: string;
  formErrors?: string;
}

interface MutationResult {
  ok: boolean;
  error?: string;
}

interface TokenFormProps {
  setIsTokenOk: Dispatch<SetStateAction<boolean>>;
}

export default function TokenForm({ setIsTokenOk }: TokenFormProps) {
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
    confirmToken(validForm);
  };

  useEffect(() => {
    if (!data) return;
    if (data.ok) setIsTokenOk(true);
    if (data.error) setError('formErrors', { message: data.error });
  }, [data, setError, setIsTokenOk]);

  return (
    <form
      onSubmit={(...args) => void handleSubmit(onTokenValid)(...args)}
      className="mt-8 flex flex-col space-y-4"
    >
      <TokenInput onClick={onClick} register={register} />
      {errors.formErrors && (
        <span className="my-2 block text-center text-red-600">
          {errors.formErrors.message}
        </span>
      )}
      <Button text={loading ? 'Loading' : 'Confirm Token'} />
      <h3 className="my-4 flex justify-center text-red-400">
        We&apos;ve sent a verification code to your email.
      </h3>
    </form>
  );
}
