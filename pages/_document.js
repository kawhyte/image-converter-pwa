import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png"></link>
        <meta name="theme-color" content="#f8f3ef" /> {/* Playful theme background */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}