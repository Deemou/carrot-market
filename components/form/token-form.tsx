/* eslint-disable no-void */
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
  const [confirmToken, { loading: tokenLoading, data: tokenData }] =
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
    if (tokenLoading) return;
    confirmToken(validForm);
  };

  useEffect(() => {
    if (!tokenData) return;
    if (tokenData.ok) setIsTokenOk(true);
    if (tokenData.error) setError('formErrors', { message: tokenData.error });
  }, [tokenData, setError, setIsTokenOk]);

  return (
    <form
      onSubmit={(...args) => void handleSubmit(onTokenValid)(...args)}
      className="mt-8 flex flex-col space-y-4"
    >
      <TokenInput onClick={onClick} register={register} />
      {errors.formErrors && (
        <span className="my-2 block text-center font-medium text-red-600">
          {errors.formErrors.message}
        </span>
      )}
      <Button text={tokenLoading ? 'Loading' : 'Confirm Token'} />
      <span className="my-4 flex justify-center text-lg font-medium text-red-400">
        We&apos;ve sent a verification code to your email.
      </span>
    </form>
  );
}
