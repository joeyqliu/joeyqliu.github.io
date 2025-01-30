"use client";

import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            JOEY LIU
          </Link>
          <span className="text-lg font-[family-name:var(--font-geist-mono)]">
            about
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-6">
        <h1 className="text-5xl font-bold text-center mb-6">
          Coming soon...
        </h1>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 mt-auto">
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex justify-center items-center gap-6 font-[family-name:var(--font-geist-mono)] text-sm">
              <a href="https://github.com/joeyqliu">GitHub</a>
              <a href="https://linkedin.com/in/joeyqliu">LinkedIn</a>
              <a href="mailto:joeyqliu@gmail.com">Email</a>
            </div>
            <span className="font-[family-name:var(--font-geist-mono)] text-sm">
              &lt;=&gt;
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
} 