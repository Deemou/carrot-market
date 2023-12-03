import Head from 'next/head';
import Header from '@/components/common/header';

interface LayoutProps {
  seoTitle: string;
  children: React.ReactNode;
}

export default function Layout({ seoTitle, children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{seoTitle}</title>
      </Head>
      <Header />
      <main className="mx-auto flex w-full flex-col items-center pb-24 pt-20">
        <div className="w-full max-w-6xl px-4">{children}</div>
      </main>
    </>
  );
}
