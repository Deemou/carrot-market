/* eslint-disable react/button-has-type */
import useMutation from '@/libs/client/useMutation';
import useUser from '@/libs/client/useUser';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface LogoutResponse {
  ok: boolean;
}

const loginUrl = '/login';
const signUpUrl = '/sign-up';
const logoutUrl = '/api/users/logout';

export default function Header() {
  const router = useRouter();
  const { user } = useUser();
  const [logout, { loading, data: logoutData }] =
    useMutation<LogoutResponse>(logoutUrl);

  function isAuthPages() {
    return router.pathname === loginUrl || router.pathname === signUpUrl;
  }

  const onClick = () => {
    if (loading) return;
    logout({});
  };
  useEffect(() => {
    if (logoutData?.ok) {
      // eslint-disable-next-line no-restricted-globals
      location.reload();
    }
  }, [logoutData]);
  return (
    <div className="mb-6 flex items-center justify-end space-x-3 p-2 px-4 font-medium text-white">
      {!isAuthPages() ? (
        <>
          <span>{user ? `Hello, ${user?.name}!` : null}</span>
          <button
            onClick={onClick}
            className="rounded-lg border border-white bg-white px-2 py-1 text-black hover:bg-black hover:text-white"
          >
            Log out
          </button>
        </>
      ) : null}
    </div>
  );
}
