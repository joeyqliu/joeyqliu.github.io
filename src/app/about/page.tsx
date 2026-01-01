"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function About() {
  const calculateExperienceYears = () => {
    const currentYear = new Date().getFullYear();
    return currentYear - 2019;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="about" />

      <main className="flex-grow py-8 sm:py-12">
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6">
          {/* Header and photo row */}
          <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-10 mb-8">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-4xl font-bold mb-6">
                thanks for stopping by
              </h1>
              <p className="text-base sm:text-lg text-gray-700">
                i&apos;m joey, a software engineer with a focus on cloud infrastructure.
                <br />
                <br />
                outside of work, you can find me playing basketball, reading, or building grove [link coming soon]. 
              </p>
            </div>
            <div className="w-full sm:w-64 shrink-0">
              <Image
                src="/canyon_joey.jpeg"
                alt="Profile Picture"
                className="w-full aspect-square object-cover rounded-lg"
                width={1000}
                height={1000}
              />
            </div>
          </div>

          {/* Facts grid - no borders */}
          <div className="mt-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-2">location</h2>
                <p className="text-gray-700">bay area, california</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">experience</h2>
                <p className="text-gray-700">{calculateExperienceYears()} years</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">fun fact</h2>
                <p className="text-gray-700">auditioned for russel from up, didn&apos;t get the part</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">reading</h2>
                <p className="text-gray-700">
                  the weight of glory<br />
                  by c.s lewis
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">volunteering</h2>
                <p className="text-gray-700">
                  mentor @ silicon valley college church
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">interests</h2>
                <p className="text-gray-700">
                  basketball, coffee, reading,<br />
                  mentoring the next generation
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer currentPage="about" />
    </div>
  );
}
