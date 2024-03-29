import { useForm } from 'react-hook-form';
import useMutation from '@/libs/client/useMutation';
import { Dispatch, SetStateAction, useEffect } from 'react';
import EmailInput from '@/components/auth/email-input';
import { useSession } from 'next-auth/react';
import { IEmailForm } from '@/types/form';
import ErrorMessage from '../common/error-message';

interface MutationResult {
  ok: boolean;
  error?: string;
}

interface EmailFormProps {
  setEmail: Dispatch<SetStateAction<string>>;
  setIsEmailOk: Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
  children: React.ReactNode;
}

export default function EmailForm({
  setEmail,
  setIsEmailOk,
  disabled,
  children
}: EmailFormProps) {
  const { data: session } = useSession();

  const [validateEmail, { loading, data }] =
    useMutation<MutationResult>('/api/users/verify');

  const {
    register,
    setValue,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<IEmailForm>();

  useEffect(() => {
    if (!session) return;
    if (session.user?.email) setValue('email', session.user.email);
  }, [setValue, session]);

  const onClick = () => {
    clearErrors('formErrors');
  };

  const onEmailValid = (validForm: IEmailForm) => {
    if (loading) return;
    setEmail(validForm.email);
    validateEmail(validForm);
  };

  useEffect(() => {
    if (!data) return;
    if (data.ok) setIsEmailOk(true);
    if (data.error) setError('formErrors', { message: data.error });
  }, [data, setError, setIsEmailOk]);

  return (
    <form
      onSubmit={handleSubmit(onEmailValid)}
      className="flex flex-col space-y-4"
    >
      <EmailInput onClick={onClick} disabled={disabled} register={register} />
      {errors.formErrors && (
        <ErrorMessage message={errors.formErrors.message} />
      )}
      {children}
    </form>
  );
}

EmailForm.defaultProps = {
  disabled: false
};
