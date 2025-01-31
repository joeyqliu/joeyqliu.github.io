"use client";

import Link from "next/link";

interface HeaderProps {
  currentPage?: string;
}

export default function Header({ currentPage }: HeaderProps) {
  return (
    <header className="w-full px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-xl sm:text-2xl font-bold z-50">
          JOEY LIU
        </Link>
        <div className="flex gap-4">
          <div className="relative">
            <Link 
              href="/work" 
              className={`text-base sm:text-lg font-[family-name:var(--font-geist-mono)] hover:text-white transition-colors duration-150 cursor-pointer p-2 z-50 ${
                currentPage === 'work' ? 'pointer-events-none' : ''
              }`}
            >
              work
            </Link>
            {currentPage === 'work' && (
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs" style={{ WebkitTextStroke: '1px black', color: 'transparent' }}>▲</span>
            )}
          </div>
          <div className="relative">
            <Link 
              href="/about" 
              className={`text-base sm:text-lg font-[family-name:var(--font-geist-mono)] hover:text-white transition-colors duration-150 cursor-pointer p-2 z-50 ${
                currentPage === 'about' ? 'pointer-events-none' : ''
              }`}
            >
              about
            </Link>
            {currentPage === 'about' && (
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs" style={{ WebkitTextStroke: '1px black', color: 'transparent' }}>▲</span>
            )}
          </div>
          <div className="relative">
            <Link 
              href="/blog" 
              className={`text-base sm:text-lg font-[family-name:var(--font-geist-mono)] hover:text-white transition-colors duration-150 cursor-pointer p-2 z-50 ${
                currentPage === 'blog' ? 'pointer-events-none' : ''
              }`}
            >
              blog
            </Link>
            {currentPage === 'blog' && (
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs" style={{ WebkitTextStroke: '1px black', color: 'transparent' }}>▲</span>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 