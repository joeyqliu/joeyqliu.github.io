"use client";

// import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
export default function About() {
  // Function to calculate years since 2019
  const calculateExperienceYears = () => {
    const currentYear = new Date().getFullYear();
    return currentYear - 2019;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="about" />
      
      <main className="flex-grow">
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-0">
          {/* Text blurb & profile picture section with fixed widths on sm and above */}
          <div className="flex flex-col sm:flex-row items-start mb-10">
            {/* Text blurb with burnt orange border */}
            <div className="w-full sm:w-2/3">
              <div className="border-2 border-[#808000] p-4 rounded-lg">
                <h1 className="sm:text-2xl font-bold text-left mb-4 sm:mb-6 text-[#806400]">
                  thanks for stopping by
                </h1>
                <p className="text-base sm:text-lg text-left text-700 mb-6">
                  my name is joey. i&apos;m a software engineer with a focus on cloud infrastructure. i&apos;m currently at handshake, helping the next generation find their first, second, and third jobs.
                  <br />
                  <br />
                  i&apos;m passionate about building community and creating products that bring people together.
                  <br />
                </p>
              </div>
            </div>
            {/* Profile picture now aligned to the right with allocated width */}
            <div className="w-full sm:w-1/3 mt-4 sm:mt-0 sm:ml-6 flex items-center justify-end">
              <Image
                src="/canyon_joey.jpeg" // Do not change this
                alt="Profile Picture"
                className="w-[98%] aspect-square border-2 border-[#808000] object-cover rounded-lg"
                width={1000}
                height={1000}
              />
            </div>
          </div>
          
          {/* Grid section enveloped in an olive green border with extra spacing */}
          <div className="mt-24 border-2 border-[#808000] p-4 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="py-4 border-r border-black">
                <h2 className="text-xl font-semibold mb-2 text-[#806400]">location</h2>
                <p className="text-black-600">
                  santa clara, california
                </p>
              </div>
              <div className="py-4 border-r border-black">
                <h2 className="text-xl font-semibold mb-2 text-[#806400]">experience</h2>
                <p className="text-black-600">{calculateExperienceYears()} years</p>
              </div>
              <div className="py-4">
                <h2 className="text-xl font-semibold mb-2 text-[#806400]">fun fact</h2>
                <p className="text-black-600">auditioned for russel from up, didn&apos;t get the part</p>
              </div>
              <hr className="border-t border-black col-span-3 my-4" />
              <div className="py-4 border-r border-black">
                <h2 className="text-xl font-semibold mb-2 text-[#806400]">reading</h2>
                <p className="text-black-600">
                  the weight of glory<br />
                  by c.s lewis
                </p>
              </div>
              <div className="py-4 border-r border-black">
                <h2 className="text-xl font-semibold mb-2 text-[#806400]">volunteering</h2>
                <p className="text-black-600">
                  svc @ south bay since 2024 <br /> 
                  klesis @ ucsc since 2019
                </p>
              </div>
              <div className="py-4">
                <h2 className="text-xl font-semibold mb-2 text-[#806400]">interests</h2>
                <p className="text-black-600">
                  basketball 🏀, coffee ☕, reading 📖 <br />
                  mentoring the next generation 🧑‍🏫
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