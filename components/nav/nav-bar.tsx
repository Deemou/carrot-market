import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import NavChannel from '@components/nav/nav-channel';
import Button from '@/components/common/button/button';
import Avatar from '../common/avatar';
import { useRouter } from 'next/router';

export default function NavBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const onLoginClick = async () => {
    router.push('/login');
  };
  const onLogoutClick = async () => {
    await signOut();
  };

  return (
    <nav className="flex w-full max-w-6xl justify-between px-2">
      <div className="flex items-center space-x-3">
        <Link href="/">
          <h4 className="font-medium">Carrot Market</h4>
        </Link>
        <div className="flex space-x-3">
          <NavChannel link="/" name="홈" />
          <NavChannel link="/community" name="커뮤니티" />
          {session && <NavChannel link="/profile" name="프로필" />}
        </div>
      </div>
      {session ? (
        <div className="flex space-x-3">
          <Avatar url={session.user.avatar} />
          <Button onClick={onLogoutClick} type="button" text="Log out" />
        </div>
      ) : (
        <div>
          <Button onClick={onLoginClick} type="button" text="Log in" />
        </div>
      )}
    </nav>
  );
}
