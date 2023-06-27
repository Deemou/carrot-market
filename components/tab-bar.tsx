import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import cls from '@libs/client/utils';
import { useRecoilValue } from 'recoil';
import isMobile from '@/atoms';

const loginUrl = '/login';
const signUpUrl = '/sign-up';

export default function TabBar() {
  const mobile = useRecoilValue(isMobile);
  const router = useRouter();

  function isAuthPages() {
    return router.pathname === loginUrl || router.pathname === signUpUrl;
  }

  return isAuthPages() ? null : (
    <nav
      className={cls(
        'fixed bottom-0 flex w-full max-w-3xl -translate-x-[1px] justify-between border-t bg-black px-10 py-5',
        mobile ? '' : 'border-x ring-1 ring-white'
      )}
    >
      <Link
        href="/"
        className={cls(
          'flex flex-col items-center space-y-2 ',
          router.pathname === '/'
            ? 'text-orange-500'
            : 'transition-colors hover:text-gray-500'
        )}
      >
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          ></path>
        </svg>
        <span>Home</span>
      </Link>
      <Link
        href="/community"
        className={cls(
          'flex flex-col items-center space-y-2 ',
          router.pathname === '/community'
            ? 'text-orange-500'
            : 'transition-colors hover:text-gray-500'
        )}
      >
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          ></path>
        </svg>
        <span>Community</span>
      </Link>
      <Link
        href="/streams"
        className={cls(
          'flex flex-col items-center space-y-2 ',
          router.pathname === '/streams'
            ? 'text-orange-500'
            : 'transition-colors hover:text-gray-500'
        )}
      >
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          ></path>
        </svg>
        <span>Live</span>
      </Link>
      <Link
        href="/profile"
        className={cls(
          'flex flex-col items-center space-y-2 ',
          router.pathname === '/profile'
            ? 'text-orange-500'
            : 'transition-colors hover:text-gray-500'
        )}
      >
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          ></path>
        </svg>
        <span>My Carrot</span>
      </Link>
    </nav>
  );
}
