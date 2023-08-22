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
      onClick={() => signIn(provider)}
      className="flex items-center justify-center space-x-2 rounded-md border border-white bg-black px-4 py-2"
    >
      {children}
      <h4 className="text-white">Sign in with {providerText}</h4>
    </button>
  );
}
