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
      className="fixed bottom-24 right-5 flex aspect-square h-14 cursor-pointer items-center justify-center rounded-xl border border-white bg-black hover:bg-gray-200 hover:text-black"
    >
      {children}
    </Link>
  );
}
