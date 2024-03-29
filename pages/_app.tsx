import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import { RecoilRoot } from 'recoil';
import { SessionProvider } from 'next-auth/react';
import useWindowWidth from '@/libs/client/useWindowWidth';

function WindowWidthComponent() {
  useWindowWidth();
  return <div></div>;
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        fetcher: (url: string) => fetch(url).then((response) => response.json())
      }}
    >
      <RecoilRoot>
        <div className="min-h-screen w-full bg-black py-4">
          <SessionProvider session={session}>
            <WindowWidthComponent />
            <Component {...pageProps} />
          </SessionProvider>
        </div>
      </RecoilRoot>
    </SWRConfig>
  );
}

export default MyApp;
