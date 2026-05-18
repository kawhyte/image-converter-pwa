import React from 'react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import { Zap, Sparkles, Gem, Snail, Rocket } from 'lucide-react';
import ImageCompareSlider from '@/components/ImageCompareSlider';
import ConversionAnimation from '@/components/ConversionAnimation';
import { Button } from '@/components/ui/button';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-background text-foreground min-h-screen font-sans">
      <Navbar />

      {/* Animated background — same as main page */}
      <div className="background-gradient-container">
        <div className="blur-filter">
          <div className="ellipse ellipse-1" />
          <div className="ellipse ellipse-2" />
          <div className="ellipse ellipse-3" />
          <div className="ellipse ellipse-4" />
        </div>
      </div>

      {/* Hero */}
      <div className="text-center py-20 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-border">
        <h1 className="font-grotesk text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
          From Bloated to Blazing Fast.
        </h1>
        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-muted-foreground">
          We&apos;re obsessed with milliseconds, so you don&apos;t have to be. Our mission is to make
          the web faster for everyone, and it all starts with your images.
        </p>
        <div className="max-w-2xl mx-auto mt-12 border border-border rounded-2xl overflow-hidden">
          <ImageCompareSlider beforeImage="/sample/before.jpeg" afterImage="/sample/after.webp" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-16 sm:py-24 px-4 sm:px-6 lg:px-8 space-y-20">

        {/* The Problem */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="font-grotesk text-3xl font-bold tracking-tight text-foreground mb-4">
              The Burden of the Bloat.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Ever clicked away from a website because it took too long to load? We have. Too many
              times. Heavy, unoptimized images are the #1 culprit behind slow load times,
              frustrating your users and hurting your search rankings. We knew there had to be a
              better, easier way.
            </p>
          </div>
          <div className="order-1 md:order-2 flex justify-center items-center gap-6 sm:gap-8">
            <div className="text-center p-6 bg-slate-900 border border-border rounded-xl">
              <Snail className="w-12 h-12 mx-auto text-muted-foreground/60 mb-2" />
              <p className="font-semibold text-foreground/80 text-sm">Slow Speeds</p>
            </div>
            <div className="text-center p-6 bg-slate-900 border border-border rounded-xl">
              <Rocket className="w-12 h-12 mx-auto text-primary mb-2" />
              <p className="font-semibold text-foreground/80 text-sm">Fast Speeds</p>
            </div>
          </div>
        </section>

        {/* Our Solution */}
        <section className="text-center">
          <h2 className="font-grotesk text-3xl font-bold tracking-tight text-foreground mb-4">
            Making Modern Image Formats Effortless.
          </h2>
          <p className="max-w-3xl mx-auto text-muted-foreground leading-relaxed">
            WebP is an incredible format that offers tiny file sizes with amazing quality. The
            problem? Converting images is a chore. That&apos;s why we built this tool — the
            powerful, one-click converter we always wished we had. No complicated software, no
            command lines — just drag, drop, and download.
          </p>
          <div className="max-w-3xl mx-auto mt-10 bg-slate-900 border border-border rounded-2xl overflow-hidden">
            <ConversionAnimation />
          </div>
        </section>

        {/* Core Principles */}
        <section>
          <h2 className="font-grotesk text-3xl font-bold tracking-tight text-foreground text-center mb-12">
            Our Core Principles.
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-slate-900 border border-border rounded-2xl">
              <Zap className="w-10 h-10 mx-auto text-primary mb-4" />
              <h3 className="font-grotesk text-xl font-semibold mb-2 text-foreground">Speed</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Performance is a feature. We&apos;re committed to making your workflow and your
                website as fast as possible.
              </p>
            </div>
            <div className="p-6 bg-slate-900 border border-border rounded-2xl">
              <Sparkles className="w-10 h-10 mx-auto text-primary mb-4" />
              <h3 className="font-grotesk text-xl font-semibold mb-2 text-foreground">Simplicity</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Powerful tools don&apos;t need to be complicated. Our interface is designed to be
                intuitive from the first click.
              </p>
            </div>
            <div className="p-6 bg-slate-900 border border-border rounded-2xl">
              <Gem className="w-10 h-10 mx-auto text-primary mb-4" />
              <h3 className="font-grotesk text-xl font-semibold mb-2 text-foreground">Quality</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We believe in smart optimization. Your images should be smaller without sacrificing
                the quality you worked so hard for.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center border border-border rounded-3xl py-14 sm:py-20 px-6 bg-slate-900/50">
          <h2 className="font-grotesk text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Ready to Speed Up Your Site?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-lg">
            No sign-up required. Drag and drop your images to see the magic for yourself.
          </p>
          <Button size="lg" asChild {...({} as any)}>
            <Link href="/">Convert Your Images for Free</Link>
          </Button>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;
