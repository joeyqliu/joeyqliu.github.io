"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  // Get the basePath from window location
  const [basePath, setBasePath] = useState('');
  
  useEffect(() => {
    // Check if we're on GitHub Pages by looking at the pathname
    const isGitHubPages = window.location.pathname.startsWith('/joeyqliu');
    setBasePath(isGitHubPages ? '/joeyqliu' : '');
  }, []);

  // Array of available images with dynamic basePath
  const images = [
    `${basePath}/joey.jpeg`,
    `${basePath}/pixel_joey.jpeg`
  ];
  
  const [currentImage, setCurrentImage] = useState(images[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Function to select random image
  const selectRandomImage = () => {
    if (!isTransitioning) {
      setIsHovered(true);
      setIsTransitioning(true);
      setTimeout(() => {
        const randomImage = images[Math.floor(Math.random() * images.length)];
        setCurrentImage(randomImage);
        setIsTransitioning(false);
      }, 300); // Wait for full fade out before changing image
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with name and about */}
      <header className="w-full px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl sm:text-2xl font-bold z-50">
            JOEY LIU
          </Link>
          <Link 
            href="/about" 
            className="text-base sm:text-lg font-[family-name:var(--font-geist-mono)] hover:text-white transition-colors duration-150 cursor-pointer p-2 z-50"
          >
            about
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 -mt-20 sm:-mt-40">
        <h2 className="text-3xl sm:text-5xl font-bold text-center max-w-2xl mb-4 sm:mb-6">
          <span 
            className="relative inline-block group"
            onMouseEnter={selectRandomImage}
            onTouchStart={selectRandomImage}
            onMouseLeave={handleMouseLeave}
            onTouchEnd={handleMouseLeave}
          >
            <div className="absolute -top-48 sm:-top-64 left-1/2 -translate-x-1/2 z-10">
              <Image
                src={currentImage}
                alt="Joey Liu"
                width={200}
                height={200}
                className={`w-[180px] h-[180px] sm:w-[250px] sm:h-[250px] rounded-full shadow-lg transition-all duration-500 ease-in-out ${
                  !isHovered ? 'opacity-0 scale-95 invisible' : 
                  isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
                priority
              />
            </div>
            👋 Hello, I&apos;m Joey
          </span>.
        </h2>
        <p className="text-base sm:text-lg text-center max-w-xl text-gray-700 px-4">
          I&apos;m a software engineer based in the bay area.
        </p>
      </main>

      {/* Contact Section */}
      <footer className="w-full py-6 sm:py-8 mt-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <div className="flex justify-center items-center gap-4 sm:gap-6 font-[family-name:var(--font-geist-mono)] text-xs sm:text-sm">
              <Link href="https://github.com/joeyqliu" target="_blank" className="z-50">GitHub</Link>
              <Link href="https://linkedin.com/in/joeyqliu" target="_blank" className="z-50">LinkedIn</Link>
              <Link href="mailto:joeyqliu@gmail.com" className="z-50">Email</Link>
            </div>
            <span className="font-[family-name:var(--font-geist-mono)] text-xs sm:text-sm">
              &lt;=&gt;
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
