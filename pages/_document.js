import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png"></link>
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="72x72" href="/icons/icon-72x72.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/icons/icon-96x96.png" />
        <meta name="theme-color" content="#f8f3ef" /> {/* Playful theme background */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}