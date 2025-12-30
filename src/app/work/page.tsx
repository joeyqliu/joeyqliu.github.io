"use client";

import { useRef, useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExperienceCard, { ExperienceCardRef } from "@/components/ExperienceCard";
import Timeline from "@/components/Timeline";

const experiences = [
  {
    id: "handshake",
    companyName: "Handshake",
    dateRange: "May 2023 - Present",
    about: "",
    imageSrc: "/Handshake.jpeg",
  },
  {
    id: "rivian",
    companyName: "Rivian",
    dateRange: "March 2021 - May 2023",
    about: "",
    imageSrc: "/RIVIAN.jpg",
  },
  {
    id: "iotium",
    companyName: "IoTium",
    dateRange: "October 2019 - February 2021",
    about: "",
    imageSrc: "/IOTIUM.jpg",
  },
  {
    id: "ucsc",
    companyName: "UCSC Genomics Institute",
    dateRange: "September 2018 - June 2019",
    about: "",
    imageSrc: "/BASKIN.jpg",
  },
];

const pastTimelineItems = [
  { id: "rivian", label: "Rivian" },
  { id: "iotium", label: "IoTium" },
  { id: "ucsc", label: "UCSC Genomics" },
];

export default function Work() {
  const cardRefs = useRef<Map<string, ExperienceCardRef>>(new Map());
  const [intersectionRatios, setIntersectionRatios] = useState<Map<string, number>>(new Map());

  // Find the card with the highest intersection ratio
  const activeCardId = useCallback(() => {
    let maxRatio = 0;
    let activeId: string | null = null;
    
    intersectionRatios.forEach((ratio, id) => {
      if (ratio > maxRatio && ratio > 0.3) {
        maxRatio = ratio;
        activeId = id;
      }
    });
    
    return activeId;
  }, [intersectionRatios])();

  const handleIntersectionChange = useCallback((id: string, ratio: number) => {
    setIntersectionRatios((prev) => {
      const next = new Map(prev);
      next.set(id, ratio);
      return next;
    });
  }, []);

  const handleScrollToCard = useCallback((id: string) => {
    cardRefs.current.get(id)?.scrollToCard();
  }, []);

  const setCardRef = useCallback((id: string, ref: ExperienceCardRef | null) => {
    if (ref) {
      cardRefs.current.set(id, ref);
    } else {
      cardRefs.current.delete(id);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="work" />

      <Timeline
        pastItems={pastTimelineItems}
        activeCardId={activeCardId}
        onScrollToCard={handleScrollToCard}
      />

      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Title section - positioned so first card starts at center */}
          <div className="h-[calc(50vh-120px)] flex items-end justify-center pb-8">
            <h1 className="text-6xl sm:text-8xl font-bold text-center tracking-wide">
              EXPERIENCE
            </h1>
          </div>

          {/* Cards container - pb calculated to center last card (50vh - half of 35vh card) */}
          <div className="flex flex-col gap-8 pb-[32vh]">
            {experiences.map((exp) => (
              <ExperienceCard
                key={exp.id}
                ref={(ref) => setCardRef(exp.id, ref)}
                id={exp.id}
                companyName={exp.companyName}
                dateRange={exp.dateRange}
                about={exp.about}
                imageSrc={exp.imageSrc}
                isActive={activeCardId === exp.id}
                onIntersectionChange={handleIntersectionChange}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
