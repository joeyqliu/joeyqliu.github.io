"use client";

// import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Blog() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="blog" />
      
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 -mt-20 sm:-mt-40">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-center mb-4 sm:mb-6">
            Coming soon...
          </h1>
        </div>
      </main>

      <Footer />
    </div>
  );
} 