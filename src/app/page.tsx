"use client";

import Image from "next/image";
// import Link from "next/link";
import { useState} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Array of available images
  const images = [
    './joey.jpeg',
    './pixel_joey.jpeg',
    './canyon_joey.jpeg'
  ];
  
  const [currentImage, setCurrentImage] = useState(images[0]);

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
      <Header />

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
              <div className="w-[180px] h-[180px] sm:w-[250px] sm:h-[250px] relative overflow-hidden rounded-full">
                <Image
                  src={currentImage}
                  alt="Joey Liu"
                  fill
                  className={`object-cover transition-all duration-500 ease-in-out ${
                    !isHovered ? 'opacity-0 scale-95 invisible' : 
                    isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100 shadow-lg'
                  }`}
                  priority
                />
              </div>
            </div>
            👋 Hello, I&apos;m Joey
          </span>.
        </h2>
        <p className="text-base sm:text-lg text-center max-w-xl text-gray-700 px-4">
          I&apos;m a software engineer based in the bay area.
        </p>
      </main>

      <p className="text-xs sm:text-sm text-center text-gray-500 mb-4">
        hover over the emoji to say hi!
      </p>

      <Footer />
    </div>
  );
}
