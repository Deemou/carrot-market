import type { NextPage } from 'next';
import Link from 'next/link';
import LoginForm from '@/components/auth/login-form';
import OAuthLoginButtonList from '@/components/auth/oauth-login-button-list';

const Enter: NextPage = () => {
  return (
    <div className="mx-auto mt-16 w-full max-w-xl px-4">
      <h1 className="text-center">Log in to Carrot Market</h1>
      <div className="flex flex-col gap-8">
        <LoginForm />

        <div className="flex items-center justify-between">
          <div className="w-1/3 border-t border-gray-300" />
          <span className="bg-black px-2 ">Or enter with</span>
          <div className="w-1/3 border-t border-gray-300" />
        </div>
        <OAuthLoginButtonList />

        <div className="flex justify-center p-4">
          <Link href="/sign-up" className="cursor-pointer">
            <span className="">
              You don&apos;t have an account yet? Sign up!
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Enter;
