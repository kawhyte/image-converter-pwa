import React from 'react';


   import Navbar from '../components/layout/Navbar';

   import {Zap, Sparkles, Gem, Snail, Rocket} from 'lucide-react';
import ImageCompareSlider from '@/components/ImageCompareSlider';
import ConversionAnimation from '@/components/ConversionAnimation';


const AboutPage: React.FC = () => {

  return (
    <div className="bg-zinc-950 text-white min-h-screen font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <div className="text-center py-20 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-zinc-800">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-50 mb-4">
          From Bloated to Blazing Fast.
        </h1>
        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-zinc-400">
          We're obsessed with milliseconds, so you don't have to be. Our mission is to make the web faster for everyone, and it all starts with your images.
        </p>
        {/* INTERACTIVE ELEMENT: A before/after image slider would be perfect here */}
        <div className="max-w-2xl mx-auto mt-12 p-4 border-2 border-dashed border-zinc-700 rounded-xl">
          

             <ImageCompareSlider beforeImage={'/sample/before.jpeg'} afterImage={'/sample/after.webp'}/>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-16 sm:py-24 px-4 sm:px-6 lg:px-8 space-y-20">

        {/* The Problem Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold text-gray-50 mb-4">The Burden of the Bloat.</h2>
            <p className="text-zinc-400 leading-relaxed">
              Ever clicked away from a website because it took too long to load? We have. Too many times. Heavy, unoptimized images are the #1 culprit behind slow load times, frustrating your users and hurting your search rankings. We knew there had to be a better, easier way.
            </p>
          </div>
          <div className="order-1 md:order-2 flex justify-center items-center space-x-8">
             <div className="text-center p-6 bg-zinc-900 rounded-lg">
                <Snail className="w-12 h-12 mx-auto text-zinc-500 mb-2"/>
                <p className="font-semibold text-zinc-300">Slow Speeds</p>
             </div>
             <div className="text-center p-6 bg-zinc-900 rounded-lg">
                <Rocket className="w-12 h-12 mx-auto text-blue-500 mb-2"/>
                <p className="font-semibold text-zinc-300">Fast Speeds</p>
             </div>
          </div>
        </section>

        {/* Our Solution Section */}
        <section className="text-center">
            <h2 className="text-3xl font-bold text-gray-50 mb-4">Making Modern Image Formats Effortless.</h2>
            <p className="max-w-3xl mx-auto text-zinc-400 leading-relaxed">
             WebP is an incredible format that offers tiny file sizes with amazing quality. The problem? Converting images is a chore. That's why we built this tool—the powerful, one-click converter we always wished we had. No complicated software, no command lines—just drag, drop, and download.
            </p>
             {/* ANIMATION: A stylized animation of the UI would be great here */}
            <div className="max-w-3xl mx-auto mt-10 p-8 bg-zinc-900 rounded-xl">
                
            
            <ConversionAnimation/>
            
            
            
            </div>




        </section>
        
        {/* Our Philosophy Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-50 text-center mb-12">Our Core Principles.</h2>
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-zinc-900 rounded-xl">
              <Zap className="w-10 h-10 mx-auto text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Speed</h3>
              <p className="text-zinc-400">Performance is a feature. We're committed to making your workflow and your website as fast as possible.</p>
            </div>
            <div className="p-6 bg-zinc-900 rounded-xl">
              <Sparkles className="w-10 h-10 mx-auto text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Simplicity</h3>
              <p className="text-zinc-400">Powerful tools don't need to be complicated. Our interface is designed to be intuitive from the first click.</p>
            </div>
            <div className="p-6 bg-zinc-900 rounded-xl">
              <Gem className="w-10 h-10 mx-auto text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality</h3>
              <p className="text-zinc-400">We believe in smart optimization. Your images should be smaller without sacrificing the quality you worked so hard for.</p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="text-center  rounded-xl py-12 sm:py-16 px-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to Speed Up Your Site?</h2>
            <p className="text-blue-100 max-w-2xl mx-auto mb-8">
                No sign-up required. Drag and drop your images to see the magic for yourself.
            </p>
            <a 
              href="/" 
              className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-200 transition-transform transform hover:scale-105"
            >
                Convert Your Images for Free
            </a>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;
