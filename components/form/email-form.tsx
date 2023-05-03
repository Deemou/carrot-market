/* eslint-disable no-void */
import { useForm } from 'react-hook-form';
import useMutation from '@/libs/client/useMutation';
import { Dispatch, SetStateAction, useEffect } from 'react';
import useUser from '@/libs/client/useUser';
import EmailInput from '../input/email-input';

interface IEmailForm {
  email: string;
  formErrors?: string;
}

interface MutationResult {
  ok: boolean;
  error?: string;
}

interface EmailFormProps {
  setIsEmailOk: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
}

export default function EmailForm({ setIsEmailOk, children }: EmailFormProps) {
  const { user } = useUser();

  const [validateEmail, { loading: emailLoading, data: emailData }] =
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
    if (user?.email) setValue('email', user.email);
  }, [user, setValue]);

  const onClick = () => {
    clearErrors('formErrors');
  };

  const onEmailValid = (validForm: IEmailForm) => {
    if (emailLoading) return;
    validateEmail(validForm);
  };

  useEffect(() => {
    if (!emailData) return;
    if (emailData.ok) setIsEmailOk(true);
    if (emailData.error) setError('formErrors', { message: emailData.error });
  }, [emailData, setError, setIsEmailOk]);

  return (
    <form
      onSubmit={(...args) => void handleSubmit(onEmailValid)(...args)}
      className="mt-8 flex flex-col space-y-4"
    >
      <EmailInput onClick={onClick} register={register} />
      {errors.formErrors && (
        <span className="my-2 block text-center font-medium text-red-600">
          {errors.formErrors.message}
        </span>
      )}
      {children}
    </form>
  );
}
