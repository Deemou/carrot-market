import Link from 'next/link';
import React from 'react';

interface IFloatingButton {
  href: string;
  children: React.ReactNode;
}

export default function FloatingButton({ href, children }: IFloatingButton) {
  return (
    <Link
      href={href}
      className="flex aspect-square h-14 cursor-pointer items-center justify-center rounded-xl border border-white hover:bg-gray-200 hover:text-black"
    >
      {children}
    </Link>
  );
}
