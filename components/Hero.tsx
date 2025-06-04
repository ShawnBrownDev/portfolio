"use client";

import { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';
import Globe from './Globe';

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center relative overflow-hidden pt-16">
      <div className="container mx-auto px-4 md:px-6 py-10 flex flex-col md:flex-row items-center">
        <div className="flex-1 md:pr-8 space-y-6 mb-10 md:mb-0">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            Hi, I'm
            <br />
            <span className="text-white">John Doe</span>
          </h1>

          <p className="text-xl text-gray-300 max-w-xl">
            Crafting scalable software with modern tech
          </p>

          <div className="flex flex-wrap gap-3">
            <span className="inline-block bg-gray-800 px-3 py-1 text-sm rounded-full text-gray-200">
              Full Stack Developer
            </span>
            <span className="inline-block bg-gray-800 px-3 py-1 text-sm rounded-full text-gray-200">
              System Architect
            </span>
            <span className="inline-block bg-gray-800 px-3 py-1 text-sm rounded-full text-gray-200">
              OSS Contributor
            </span>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="#projects"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              View Projects
            </Link>
            <a
              href="/resume.pdf"
              target="_blank"
              className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-transparent px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              download
            >
              Download Resume
            </a>
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="w-full h-96 md:h-[500px] relative">
            <Globe />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
        <span className="text-sm text-gray-400 mb-2">Scroll Down</span>
        <ArrowDown className="h-5 w-5 text-gray-400" />
      </div>
    </section>
  );
};

export default Hero;