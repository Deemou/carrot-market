import React from 'react';
import Head from 'next/head';
import cls from '@/libs/client/utils';
import { useRecoilValue } from 'recoil';
import { isMobile } from '@/atoms';
import TabBar from './tab-bar';
import Header from './header';

interface LayoutProps {
  children: React.ReactNode;
  seoTitle: string;
}

export default function Layout({ children, seoTitle }: LayoutProps) {
  const mobile = useRecoilValue(isMobile);
  const message = `${seoTitle} | Carrot Market`;
  return (
    <div
      className={cls(
        'mx-auto min-h-[90vh] w-full max-w-xl',
        mobile ? '' : 'border ring-1 ring-white'
      )}
    >
      <Head>
        <title>{message}</title>
      </Head>
      <Header />
      <div className="px-4 pt-20 pb-24">{children}</div>
      <TabBar />
    </div>
  );
}
