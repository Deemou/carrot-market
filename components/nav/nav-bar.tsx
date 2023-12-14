/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { MouseEvent, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import NavChannel from '@components/nav/nav-channel';
import Button from '@/components/common/button/button';
import { useRouter } from 'next/router';
import { HOME_URL, LOGIN_URL, PROFILE_URL } from '@/routes';
import { COMMUNITY } from '@/pageTypes';
import HomeLogo from '../common/home-logo';
import AvatarButton from '../profile/avatar-button';

export default function NavBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const onLoginClick = async () => {
    localStorage.setItem('prevPath', router.asPath);
    router.push(LOGIN_URL);
  };

  const onAvatarClick = () => {
    setIsMenuVisible(true);
  };
  const onProfileClick = () => {
    router.push(PROFILE_URL);
  };
  const onLogoutClick = async () => {
    await signOut();
  };
  const onAvatarBlur = () => {
    setIsMenuVisible(false);
  };
  const onMenuMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <nav className="flex w-full max-w-6xl justify-between px-2">
      <div className="flex items-center space-x-3">
        <HomeLogo />
        <div className="flex space-x-3">
          <NavChannel link={HOME_URL} name="홈" />
          <NavChannel link={`/${COMMUNITY}`} name="커뮤니티" />
        </div>
      </div>
      {session ? (
        <div className="flex flex-col">
          <AvatarButton
            url={session.user.avatar}
            onClick={onAvatarClick}
            onBlur={onAvatarBlur}
          />
          {isMenuVisible && (
            <div className="relative">
              <div
                onMouseDown={onMenuMouseDown}
                role="list"
                className="absolute top-2 right-0 w-24 divide-y divide-white rounded-lg border border-blue-50 bg-black"
              >
                <button
                  onClick={onProfileClick}
                  type="button"
                  className="w-full p-2 text-left outline-none"
                >
                  Profile
                </button>
                <button
                  onClick={onLogoutClick}
                  type="button"
                  className="w-full p-2 text-left outline-none"
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <Button onClick={onLoginClick} type="button" text="Log in" />
        </div>
      )}
    </nav>
  );
}
