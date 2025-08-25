import React from 'react';
import Navbar from '../components/layout/Navbar';

const AboutPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">About This App</h1>
        <p className="text-muted-foreground">
          This is a simple image converter PWA built with Next.js and Tailwind CSS.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
