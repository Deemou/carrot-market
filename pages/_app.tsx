import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import { RecoilRoot } from 'recoil';
import { SessionProvider } from 'next-auth/react';

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
            <Component {...pageProps} />
          </SessionProvider>
        </div>
      </RecoilRoot>
    </SWRConfig>
  );
}

export default MyApp;
