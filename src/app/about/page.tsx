"use client";

import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl sm:text-2xl font-bold z-50">
            JOEY LIU
          </Link>
          <span 
            className="text-base sm:text-lg font-[family-name:var(--font-geist-mono)] hover:text-white transition-colors duration-150 cursor-pointer p-2 z-50"
          >
            about
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 -mt-20 sm:-mt-40">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-center mb-4 sm:mb-6">
            Coming soon...
          </h1>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 sm:py-8 mt-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <div className="flex justify-center items-center gap-4 sm:gap-6 font-[family-name:var(--font-geist-mono)] text-xs sm:text-sm">
              <Link href="https://github.com/joeyqliu" target="_blank" className="z-50">GitHub</Link>
              <Link href="https://linkedin.com/in/joeyqliu" target="_blank" className="z-50">LinkedIn</Link>
              <Link href="mailto:joeyqliu@gmail.com" className="z-50">Email</Link>
            </div>
            <span className="font-[family-name:var(--font-geist-mono)] text-xs sm:text-sm">
              &lt; = &gt;
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
} 