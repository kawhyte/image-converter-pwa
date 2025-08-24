import Head from 'next/head';
import Script from 'next/script';
import { App } from '../components/App'; // We will move the component logic here
import { Navbar } from '../components/layout/Navbar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <Head>
        <title>Image to WebP Converter</title>
        <meta name="description" content="Image to WebP Converter PWA" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <App />
      </main>

      {/* External libraries are loaded via Next.js Script component */}
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js" strategy="lazyOnload" />
    </div>
  );
}