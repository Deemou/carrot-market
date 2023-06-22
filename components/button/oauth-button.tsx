import { signIn } from 'next-auth/react';

interface OAuthButtonProps {
  provider: string;
  providerText: string;
  children: React.ReactNode;
}

export default function OAuthButton({
  provider,
  providerText,
  children
}: OAuthButtonProps) {
  return (
    <button
      type="button"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={() => signIn(provider)}
      className="flex items-center justify-center space-x-2 rounded-md border border-gray-300 bg-white px-4 py-2 font-medium shadow-sm hover:bg-gray-50"
    >
      {children}
      <h3 className="text-black">Sign in with {providerText}</h3>
    </button>
  );
}
