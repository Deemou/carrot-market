import useMutation from '@/libs/client/useMutation';
import useUser from '@/libs/client/useUser';
import { useEffect } from 'react';
import cls from '@/libs/client/utils';
import { useRecoilValue } from 'recoil';
import { isMobile } from '@/atoms';
import Button from './button';

interface LogoutResponse {
  ok: boolean;
}

const logoutUrl = '/api/users/logout';

export default function Header() {
  const mobile = useRecoilValue(isMobile);
  const { user } = useUser();
  const [logout, { loading, data: logoutData }] =
    useMutation<LogoutResponse>(logoutUrl);

  const onClick = () => {
    if (loading) return;
    logout({});
  };
  useEffect(() => {
    if (logoutData?.ok) {
      location.reload();
    }
  }, [logoutData]);
  return (
    <div
      className={cls(
        'fixed top-0 z-10 flex h-20 w-full max-w-3xl -translate-x-[1px] items-center justify-end space-x-3 border-b bg-black p-2 px-4 font-medium',
        mobile ? '' : 'border-x ring-1 ring-white'
      )}
    >
      <span>{user && `Hello, ${user.name}!`}</span>
      <Button
        onClick={onClick}
        type="button"
        text="Log out"
        long={false}
      ></Button>
    </div>
  );
}
