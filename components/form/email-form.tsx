/* eslint-disable no-void */
import { useForm } from 'react-hook-form';
import useMutation from '@/libs/client/useMutation';
import { Dispatch, SetStateAction, useEffect } from 'react';
import Button from '../button';
import Input from '../input';

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
}

export default function EmailForm({ setIsEmailOk }: EmailFormProps) {
  const [validateEmail, { loading: emailLoading, data: emailData }] =
    useMutation<MutationResult>('/api/users/verify');

  const {
    register: emailRegister,
    handleSubmit: emailHandleSubmit,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<IEmailForm>();

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
      onSubmit={(...args) => void emailHandleSubmit(onEmailValid)(...args)}
      className="mt-8 flex flex-col space-y-4"
    >
      <Input
        onClick={onClick}
        register={emailRegister('email', {
          required: true,
          validate: {}
        })}
        name="email"
        label="Email address"
        type="email"
        required
      />
      {errors.formErrors && (
        <span className="my-2 block text-center font-medium text-red-600">
          {errors.formErrors.message}
        </span>
      )}
      <Button text={emailLoading ? 'Loading' : 'Verify Email'} />
    </form>
  );
}
