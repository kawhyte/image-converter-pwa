import Head from 'next/head';
import App from '../components/App';
import Navbar from '../components/layout/Navbar';

const Home: React.FC = () => {
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

    </div>
  );
};

export default Home;

