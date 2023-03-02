/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-void */
import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@components/button';
import Input from '@components/input';
import useMutation from '@libs/client/useMutation';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface EmailForm {
  email: string;
}

interface TokenForm {
  token: string;
}

interface AccountForm {
  name: string;
  password: string;
  formErrors?: string;
}

interface MutationResult {
  ok: boolean;
  error?: string;
}

const SignUp: NextPage = () => {
  const router = useRouter();
  const [validateEmail, { loading: emailLoading, data: emailData }] =
    useMutation<MutationResult>('/api/users/verify');
  const [confirmToken, { loading: tokenLoading, data: tokenData }] =
    useMutation<MutationResult>('/api/users/confirm');
  const [createAccount, { loading: accountLoading, data: accountData }] =
    useMutation<MutationResult>('/api/users/sign-up');
  const { register: emailRegister, handleSubmit: emailHandleSubmit } =
    useForm<EmailForm>();
  const { register: tokenRegister, handleSubmit: tokenHandleSubmit } =
    useForm<TokenForm>();
  const {
    register: accountRegister,
    handleSubmit: accountHandleSubmit,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<AccountForm>();

  const onClick = () => {
    clearErrors('formErrors');
  };
  const onEmailValid = (validForm: EmailForm) => {
    if (emailLoading) return;
    validateEmail(validForm);
  };
  const onTokenValid = (validForm: TokenForm) => {
    if (tokenLoading) return;
    confirmToken(validForm);
  };
  const onAccountValid = (validForm: AccountForm) => {
    if (accountLoading) return;
    createAccount(validForm);
  };

  useEffect(() => {
    if (emailData && !emailData.ok && emailData.error) {
      setError('formErrors', { message: emailData.error });
    }
  }, [emailData, setError]);
  useEffect(() => {
    if (tokenData && !tokenData.ok && tokenData.error) {
      setError('formErrors', { message: tokenData.error });
    }
  }, [tokenData, setError]);
  useEffect(() => {
    if (accountData && accountData.ok) {
      void router.replace('/');
    }
    if (accountData && !accountData.ok && accountData.error) {
      setError('formErrors', { message: accountData.error });
    }
  }, [accountData, setError]);
  return (
    <div className="mt-16 px-4">
      <h3 className="text-center text-3xl font-bold text-white">
        Sign up for Carrot Market
      </h3>
      <div className="mt-12">
        {emailData?.ok ? (
          tokenData?.ok ? (
            <form
              onClick={onClick}
              onSubmit={(...args) =>
                void accountHandleSubmit(onAccountValid)(...args)
              }
              className="mt-8 flex flex-col space-y-4"
            >
              <Input
                register={accountRegister('name', {
                  required: true,
                  minLength: {
                    value: 5,
                    message: 'Name must be at least 5 characters'
                  },
                  maxLength: {
                    value: 18,
                    message: 'Name must be up to 18 characters'
                  }
                })}
                name="name"
                label="Name"
                type="text"
                required
              />
              {errors.name && (
                <span className="bloc my-2 text-center font-medium text-red-600">
                  {errors.name.message}
                </span>
              )}
              <Input
                register={accountRegister('password', {
                  required: true,
                  minLength: {
                    value: 9,
                    message: 'Password must be at least 9 characters'
                  }
                })}
                name="password"
                label="Password"
                type="password"
                required
              />
              {errors.password && (
                <span className="my-2 block text-center font-medium text-red-600">
                  {errors.password.message}
                </span>
              )}
              <Button text={emailLoading ? 'Loading' : 'Create Account'} />
            </form>
          ) : (
            <div>
              <form
                onClick={onClick}
                onSubmit={(...args) =>
                  void tokenHandleSubmit(onTokenValid)(...args)
                }
                className="mt-8 flex flex-col space-y-4"
              >
                <Input
                  register={tokenRegister('token', {
                    required: true
                  })}
                  name="token"
                  label="Confirmation Token"
                  type="number"
                  required
                />
                {errors.formErrors && (
                  <span className="my-2 block text-center font-medium text-red-600">
                    {errors.formErrors.message}
                  </span>
                )}
                <Button text={tokenLoading ? 'Loading' : 'Confirm Token'} />
              </form>
              <span className="my-4 flex justify-center text-lg font-medium text-red-400">
                We've sent a verification code to your email.
              </span>
            </div>
          )
        ) : (
          <form
            onClick={onClick}
            onSubmit={(...args) =>
              void emailHandleSubmit(onEmailValid)(...args)
            }
            className="mt-8 flex flex-col space-y-4"
          >
            <Input
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
        )}
        <div className="flex justify-center p-4">
          <Link href="/login" className="cursor-pointer  font-medium ">
            <span className="text-white">
              You already have an account? Login!
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
