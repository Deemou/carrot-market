/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import React from 'react';

interface IFloatingButton {
  children: React.ReactNode;
  href: string;
}

export default function FloatingButton({ children, href }: IFloatingButton) {
  return (
    <Link
      href={href}
      className="fixed bottom-24 right-5 flex aspect-square w-14 cursor-pointer  items-center justify-center rounded-full border-0 border-transparent bg-orange-400 text-white shadow-xl transition-colors hover:bg-orange-500"
    >
      {children}
    </Link>
  );
}
