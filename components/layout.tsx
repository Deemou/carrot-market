/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import cls from '@libs/client/utils';
import TabBar from './tabBar';
import Header from './header';

interface LayoutProps {
  title?: string;
  canGoBack?: boolean;
  hasTabBar?: boolean;
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      {/* <div className="fixed top-0 flex h-12 w-full max-w-xl items-center justify-center  border-b bg-white px-10 text-lg  font-medium text-gray-800"></div> */}
      <Header />
      <div className={'pt-14 pb-24'}>{children}</div>
      <TabBar />
    </div>
  );
}

Layout.defaultProps = {
  title: '',
  canGoBack: false,
  hasTabBar: false
};
