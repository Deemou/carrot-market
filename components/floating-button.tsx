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
      className="fixed z-50 flex aspect-square h-14 translate-y-1 cursor-pointer items-center justify-center rounded-xl border border-white bg-black hover:bg-gray-200 hover:text-black"
    >
      {children}
    </Link>
  );
}
