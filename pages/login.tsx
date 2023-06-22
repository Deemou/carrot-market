import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import LoginForm from '@/components/form/login-form';
import { signIn } from 'next-auth/react';

const Enter: NextPage = () => {
  return (
    <div className="mx-auto mt-16 w-full max-w-xl px-4">
      <h1 className="text-center">Log in to Carrot Market</h1>
      <div className="mt-12">
        <LoginForm />
        <div className="mt-8">
          <div className="relative">
            <div className="absolute w-full border-t border-gray-300" />
            <div className="relative -top-3 text-center ">
              <span className="bg-black px-2 ">Or enter with</span>
            </div>
          </div>
          <div className="mt-2 flex flex-col space-y-4">
            <button
              type="button"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={() => signIn('github')}
              className="flex items-center justify-center space-x-2 rounded-md border border-gray-300 bg-white px-4 py-2 font-medium shadow-sm hover:bg-gray-50"
            >
              <svg
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                width="24"
                height="24"
                className="text-black"
              >
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-black"> Sign in with Github</h3>
            </button>
            <button
              type="button"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={() => signIn('kakao')}
              className="flex items-center justify-center space-x-2 rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-black shadow-sm hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 256 256"
              >
                <path
                  fill="#FFE812"
                  d="M256 236c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20V20C0 8.954 8.954 0 20 0h216c11.046 0 20 8.954 20 20v216z"
                />
                <path d="M128 36C70.562 36 24 72.713 24 118c0 29.279 19.466 54.97 48.748 69.477-1.593 5.494-10.237 35.344-10.581 37.689 0 0-.207 1.762.934 2.434s2.483.15 2.483.15c3.272-.457 37.943-24.811 43.944-29.04 5.995.849 12.168 1.29 18.472 1.29 57.438 0 104-36.712 104-82 0-45.287-46.562-82-104-82z" />
                <path
                  fill="#FFE812"
                  d="M70.5 146.625c-3.309 0-6-2.57-6-5.73V105.25h-9.362c-3.247 0-5.888-2.636-5.888-5.875s2.642-5.875 5.888-5.875h30.724c3.247 0 5.888 2.636 5.888 5.875s-2.642 5.875-5.888 5.875H76.5v35.645c0 3.16-2.691 5.73-6 5.73zM123.112 146.547c-2.502 0-4.416-1.016-4.993-2.65l-2.971-7.778-18.296-.001-2.973 7.783c-.575 1.631-2.488 2.646-4.99 2.646a9.155 9.155 0 0 1-3.814-.828c-1.654-.763-3.244-2.861-1.422-8.52l14.352-37.776c1.011-2.873 4.082-5.833 7.99-5.922 3.919.088 6.99 3.049 8.003 5.928l14.346 37.759c1.826 5.672.236 7.771-1.418 8.532a9.176 9.176 0 0 1-3.814.827c-.001 0 0 0 0 0zm-11.119-21.056L106 108.466l-5.993 17.025h11.986zM138 145.75c-3.171 0-5.75-2.468-5.75-5.5V99.5c0-3.309 2.748-6 6.125-6s6.125 2.691 6.125 6v35.25h12.75c3.171 0 5.75 2.468 5.75 5.5s-2.579 5.5-5.75 5.5H138zM171.334 146.547c-3.309 0-6-2.691-6-6V99.5c0-3.309 2.691-6 6-6s6 2.691 6 6v12.896l16.74-16.74c.861-.861 2.044-1.335 3.328-1.335 1.498 0 3.002.646 4.129 1.772 1.051 1.05 1.678 2.401 1.764 3.804.087 1.415-.384 2.712-1.324 3.653l-13.673 13.671 14.769 19.566a5.951 5.951 0 0 1 1.152 4.445 5.956 5.956 0 0 1-2.328 3.957 5.94 5.94 0 0 1-3.609 1.211 5.953 5.953 0 0 1-4.793-2.385l-14.071-18.644-2.082 2.082v13.091a6.01 6.01 0 0 1-6.002 6.003z"
                />
              </svg>
              <h3 className="text-black">Sign in with KaKao</h3>
            </button>
            <button
              type="button"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={() => signIn('naver')}
              className="flex items-center justify-center space-x-2 rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-black shadow-sm hover:bg-gray-50"
            >
              <svg
                width="24"
                height="24"
                viewBox="-32 0 512 512"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                fill="#00e766"
                stroke="#00e766"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                  <path
                    fill="#00e766"
                    d="M16 32C11.8333 32 8.125 33.5833 4.875 36.75C1.625 39.9167 0 43.6667 0 48V464C0 468.333 1.625 472.083 4.875 475.25C8.125 478.417 11.8333 480 16 480H432C436.167 480 439.875 478.417 443.125 475.25C446.375 472.083 448 468.333 448 464V48C448 43.6667 446.375 39.9167 443.125 36.75C439.875 33.5833 436.167 32 432 32H16ZM100.25 144H186.5L261.5 256V144H347.75V368H261.5L186.5 256V368H100.25V144Z"
                  />
                </g>
              </svg>
              <h3 className="text-black">Sign in with Naver</h3>
            </button>
          </div>
        </div>
        <div className="flex justify-center p-4">
          <Link href="/sign-up" className="cursor-pointer">
            <span className="">
              You don&apos;t have an account yet? Sign up!
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Enter;
