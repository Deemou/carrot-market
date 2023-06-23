import type { NextPage } from 'next';
import { useState } from 'react';
import Link from 'next/link';
import TokenForm from '@/components/form/token-form';
import AccountForm from '@/components/form/account-form';
import EmailForm from '@/components/form/email-form';
import Button from '@/components/button/button';

const SignUp: NextPage = () => {
  const [email, setEmail] = useState('');
  const [isEmailOk, setIsEmailOk] = useState(false);
  const [isTokenOk, setIsTokenOk] = useState(false);

  return (
    <div className="mx-auto mt-16 w-full max-w-xl px-4">
      <h1 className="text-center">Sign up for Carrot Market</h1>
      <div className="mt-12">
        {!isEmailOk && (
          <EmailForm setEmail={setEmail} setIsEmailOk={setIsEmailOk}>
            <Button text="Verify Email" />
          </EmailForm>
        )}
        {isEmailOk && !isTokenOk && (
          <TokenForm email={email} setIsTokenOk={setIsTokenOk} />
        )}
        {isTokenOk && <AccountForm email={email} />}
        <div className="flex justify-center p-4">
          <Link href="/login" className="cursor-pointer">
            <span className="">You already have an account? Login!</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
