/* eslint-disable react/button-has-type */
import useMutation from '@/libs/client/useMutation';
import useUser from '@/libs/client/useUser';
import { useEffect } from 'react';

interface LogoutResponse {
  ok: boolean;
}

const logoutUrl = '/api/users/logout';

export default function Header() {
  const { user } = useUser();
  const [logout, { loading, data: logoutData }] =
    useMutation<LogoutResponse>(logoutUrl);

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
    <div className="fixed top-0 flex h-20 w-full max-w-xl items-center justify-end space-x-3 bg-black p-2 px-4 font-medium text-white">
      <span>{user && `Hello, ${user?.name}!`}</span>
      <button
        onClick={onClick}
        className="rounded-lg border border-white bg-white px-2 py-1 text-black hover:bg-black hover:text-white"
      >
        Log out
      </button>
    </div>
  );
}
