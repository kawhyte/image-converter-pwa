import type { AppProps } from 'next/app';
import '../styles/globals.css';
import '../styles/background.css';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default MyApp;

