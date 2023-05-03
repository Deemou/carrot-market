import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import { RecoilRoot } from 'recoil';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        fetcher: (url: string) => fetch(url).then((response) => response.json())
      }}
    >
      <RecoilRoot>
        <div className="min-h-screen w-full bg-black py-4">
          <Component {...pageProps} />
        </div>
      </RecoilRoot>
    </SWRConfig>
  );
}

export default MyApp;
