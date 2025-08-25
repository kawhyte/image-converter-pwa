/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development' // Disable PWA in dev mode
});

console.log('Current NODE_ENV:', process.env.NODE_ENV);

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    css: 'default',
  },
  env: {
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  },
};

module.exports = withPWA(nextConfig);