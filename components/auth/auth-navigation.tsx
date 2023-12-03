import Link from 'next/link';

interface IAuthNavigation {
  address: string;
  message: string;
}

export default function AuthNavigation({ address, message }: IAuthNavigation) {
  return (
    <div className="flex justify-center p-4">
      <Link href={address} className="cursor-pointer">
        <span>{message}</span>
      </Link>
    </div>
  );
}
