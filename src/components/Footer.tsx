"use client";

import Link from "next/link";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

interface FooterProps {
  currentPage?: string;
}

export default function Footer({ currentPage }: FooterProps) {
  // Use dynamic hover text color based on the current page.
  const hoverColorClass = currentPage === 'about' ? 'hover:text-[#808000]' : 'hover:text-white';

  return (
    <footer className="w-full py-6 sm:py-8 mt-auto">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div className="flex justify-center items-center gap-4 sm:gap-6 text-lg sm:text-xl">
            <Link 
              href="https://github.com/joeyqliu" 
              target="_blank" 
              className={`z-50 hover:scale-110 transition-transform ${hoverColorClass}`}
            >
              <FiGithub />
            </Link>
            <Link 
              href="https://linkedin.com/in/joeyqliu" 
              target="_blank" 
              className={`z-50 hover:scale-110 transition-transform ${hoverColorClass}`}
            >
              <FiLinkedin />
            </Link>
            <Link 
              href="mailto:joeyqliu@gmail.com" 
              className={`z-50 hover:scale-110 transition-transform ${hoverColorClass}`}
            >
              <FiMail />
            </Link>
          </div>
          <span className="font-[family-name:var(--font-geist-mono)] text-xs sm:text-sm">
            &lt; = &gt;
          </span>
        </div>
      </div>
    </footer>
  );
} 