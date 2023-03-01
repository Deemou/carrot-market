import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import Header from '@/components/header';
import TabBar from '@/components/tabBar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        fetcher: (url: string) => fetch(url).then((response) => response.json())
      }}
    >
      <div className="min-h-screen w-full bg-black py-4">
        <div className="mx-auto w-full max-w-xl">
          <Header />
          <Component {...pageProps} />
          <TabBar />
        </div>
      </div>
    </SWRConfig>
  );
}

export default MyApp;
