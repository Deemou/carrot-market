import React from 'react';
import Head from 'next/head';
import TabBar from './tabBar';
import Header from './header';

interface LayoutProps {
  children: React.ReactNode;
  seoTitle: string;
}

export default function Layout({ children, seoTitle }: LayoutProps) {
  const message = `${seoTitle} | Carrot Market`;
  return (
    <div>
      <Head>
        <title>{message}</title>
      </Head>
      <Header />
      <div className="pt-16 pb-24">{children}</div>
      <TabBar />
    </div>
  );
}
