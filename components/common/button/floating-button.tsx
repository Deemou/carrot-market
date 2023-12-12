import redirectToLoginIfConfirmed from '@/libs/client/redirectToLoginIfConfirmed';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { MouseEvent } from 'react';

interface IFloatingButton {
  href: string;
  children: React.ReactNode;
}

export default function FloatingButton({ href, children }: IFloatingButton) {
  const { data: session } = useSession();
  const router = useRouter();

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!session) {
      redirectToLoginIfConfirmed(router);
      return;
    }
    router.push(href);
  };
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex aspect-square h-14 cursor-pointer items-center justify-center rounded-xl border border-white hover:bg-gray-200 hover:text-black"
    >
      {children}
    </Link>
  );
}
