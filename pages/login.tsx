import type { NextPage } from 'next';
import LoginForm from '@/components/auth/login-form';
import OAuthLoginButtonList from '@/components/auth/oauth-login-button-list';
import AuthNavigation from '@/components/auth/auth-navigation';

const Enter: NextPage = () => {
  return (
    <div className="mx-auto mt-16 w-full max-w-xl space-y-8 px-4">
      <h1 className="text-center">Log in to Carrot Market</h1>

      <div className="space-y-8">
        <LoginForm />

        <div className="flex items-center justify-between">
          <div className="w-1/3 border-t border-gray-300" />
          <span className="bg-black px-2 ">Or enter with</span>
          <div className="w-1/3 border-t border-gray-300" />
        </div>
        <OAuthLoginButtonList />

        <AuthNavigation
          address="/sign-up"
          message="You don't have an account yet? Sign up!"
        />
      </div>
    </div>
  );
};
export default Enter;
