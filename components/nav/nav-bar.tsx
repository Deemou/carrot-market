import React from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import NavChannel from '@components/nav/nav-channel';
import Button from '@components/button/button';
import Avatar from '../avatar';

export default function NavBar() {
  const { data: session } = useSession();
  const onClick = async () => {
    await signOut();
  };

  return (
    <nav className="flex w-full max-w-6xl justify-between bg-black px-2">
      <div className="flex items-center space-x-3">
        <Link href="/">
          <h4 className="font-medium">Carrot Market</h4>
        </Link>
        <div className="flex space-x-3">
          <NavChannel link="/" name="홈" />
          <NavChannel link="/community" name="커뮤니티" />
          <NavChannel link="/profile" name="프로필" />
        </div>
      </div>
      <div className="flex space-x-3">
        <Avatar url={session?.user.avatar} />
        <Button
          onClick={onClick}
          type="button"
          text="Log out"
          long={false}
        ></Button>
      </div>
    </nav>
  );
}
