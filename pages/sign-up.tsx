/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-void */
import type { NextPage } from 'next';
import { useState } from 'react';
import Link from 'next/link';
import TokenForm from '@/components/form/token-form';
import AccountForm from '@/components/form/account-form';
import EmailForm from '@/components/form/email-form';

const SignUp: NextPage = () => {
  const [isEmailOk, setIsEmailOk] = useState(false);
  const [isTokenOk, setIsTokenOk] = useState(false);

  return (
    <div className="mx-auto mt-16 w-full max-w-xl px-4">
      <h3 className="text-center text-3xl font-bold ">
        Sign up for Carrot Market
      </h3>
      <div className="mt-12">
        {!isEmailOk && <EmailForm setIsEmailOk={setIsEmailOk} />}
        {isEmailOk && !isTokenOk && <TokenForm setIsTokenOk={setIsTokenOk} />}
        {isTokenOk && <AccountForm />}
        <div className="flex justify-center p-4">
          <Link href="/login" className="cursor-pointer  font-medium ">
            <span className="">You already have an account? Login!</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
