import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import useUser from '@/libs/client/useUser';
import { RecoilRoot } from 'recoil';

function LoginCheck() {
  const { user } = useUser();
  return null;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        fetcher: (url: string) => fetch(url).then((response) => response.json())
      }}
    >
      <RecoilRoot>
        <div className="min-h-full w-full bg-black py-4">
          <LoginCheck />
          <Component {...pageProps} />
        </div>
      </RecoilRoot>
    </SWRConfig>
  );
}

export default MyApp;
