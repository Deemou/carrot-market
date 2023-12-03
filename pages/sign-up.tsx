import type { NextPage } from 'next';
import { useState } from 'react';
import TokenForm from '@/components/auth/token-form';
import AccountForm from '@/components/auth/account-form';
import EmailForm from '@/components/auth/email-form';
import Button from '@/components/common/button/button';
import AuthNavigation from '@/components/auth/auth-navigation';

const SignUp: NextPage = () => {
  const [email, setEmail] = useState('');
  const [isEmailOk, setIsEmailOk] = useState(false);
  const [isTokenOk, setIsTokenOk] = useState(false);

  return (
    <div className="mx-auto mt-16 w-full max-w-xl px-4">
      <h1 className="text-center">Sign up for Carrot Market</h1>

      {!isEmailOk && (
        <EmailForm setEmail={setEmail} setIsEmailOk={setIsEmailOk}>
          <Button text="Verify Email" />
        </EmailForm>
      )}
      {isEmailOk && !isTokenOk && (
        <TokenForm email={email} setIsTokenOk={setIsTokenOk} />
      )}
      {isTokenOk && <AccountForm email={email} />}

      <AuthNavigation
        address="/login"
        message="You already have an account? Login!"
      />
    </div>
  );
};
export default SignUp;
