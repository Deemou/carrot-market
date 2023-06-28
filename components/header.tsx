import cls from '@/libs/client/utils';
import { useRecoilValue } from 'recoil';
import isMobile from '@/atoms';
import { signOut, useSession } from 'next-auth/react';
import Button from './button/button';

export default function Header() {
  const mobile = useRecoilValue(isMobile);
  const { data: session } = useSession();
  const onClick = async () => {
    await signOut();
  };

  return (
    <div
      className={cls(
        'fixed top-0 z-10 flex h-20 w-full max-w-3xl -translate-x-[1px] items-center justify-end space-x-3 border-b bg-black p-2 px-4',
        mobile ? '' : 'border-x ring-1 ring-white'
      )}
    >
      <h4>{session?.user && `Hello, ${session.user.name}!`}</h4>
      <Button
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={onClick}
        type="button"
        text="Log out"
        long={false}
      ></Button>
    </div>
  );
}
