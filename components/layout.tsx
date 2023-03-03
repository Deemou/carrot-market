import React from 'react';
import Head from 'next/head';
import TabBar from './tabBar';
import Header from './header';

interface LayoutProps {
  children: React.ReactNode;
  seoTitle: string;
}

export default function Layout({ children, seoTitle }: LayoutProps) {
  return (
    <div>
      <Head>
        <title>{seoTitle} | Carrot Market</title>
      </Head>
      <Header />
      <div className="pt-14 pb-24">{children}</div>
      <TabBar />
    </div>
  );
}
