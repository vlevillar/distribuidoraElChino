import { AppProps } from 'next/app';
import '../app/globals.css';
import Providers from '../app/providers';
import RootLayout from '../app/layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </Providers>
  );
}

export default MyApp;
