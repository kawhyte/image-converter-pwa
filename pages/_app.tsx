import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../styles/globals.css';
import '../styles/background.css';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === '/') {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    // Cleanup function to remove the class when the component unmounts or the route changes
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [router.pathname]);

  return <Component {...pageProps} />;
};

export default MyApp;