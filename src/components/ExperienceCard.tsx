"use client";

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";

interface PersonToThank {
  name: string;
  url: string;
}

interface ExperienceCardProps {
  id: string;
  companyName: string;
  dateRange: string;
  about: string;
  imageSrc?: string;
  imageContain?: boolean;
  peopleToThank?: PersonToThank[];
  isActive: boolean;
  onIntersectionChange?: (id: string, ratio: number) => void;
}

export interface ExperienceCardRef {
  scrollToCard: () => void;
}

const ExperienceCard = forwardRef<ExperienceCardRef, ExperienceCardProps>(
  function ExperienceCard(
    {
      id,
      companyName,
      dateRange,
      about,
      imageSrc,
      imageContain,
      peopleToThank,
      isActive,
      onIntersectionChange,
    },
    ref
  ) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Expose scrollToCard method to parent
    useImperativeHandle(ref, () => ({
      scrollToCard: () => {
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      },
    }));

    // Intersection observer for entrance animation and reporting ratio to parent
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          // Entrance animation trigger
          if (entry.isIntersecting) {
            setIsVisible(true);
          }

          // Report intersection ratio to parent for "winner takes all" logic
          onIntersectionChange?.(id, entry.intersectionRatio);
        },
        {
          threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
          rootMargin: "-15% 0px -15% 0px",
        }
      );

      if (cardRef.current) {
        observer.observe(cardRef.current);
      }

      return () => observer.disconnect();
    }, [id, onIntersectionChange]);

    // Click outside to flip back
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          isFlipped &&
          cardRef.current &&
          !cardRef.current.contains(event.target as Node)
        ) {
          setIsFlipped(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isFlipped]);

    const handleClick = () => {
      // Scroll to center and flip
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setIsFlipped(!isFlipped);
    };

    return (
      <div
        id={id}
        ref={cardRef}
        className={`flip-card h-[35vh] cursor-pointer card-entrance ${
          isVisible ? "visible" : ""
        } ${isActive ? "card-active" : ""}`}
        onClick={handleClick}
      >
        <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
          {/* Front Face */}
          <div className="flip-card-front shadow-xl flex items-center justify-center">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={companyName}
                className={`w-full h-full object-center ${imageContain ? "object-contain" : "object-cover"}`}
              />
            ) : (
              <span className="text-3xl sm:text-4xl font-bold text-[#2C2C2C]/60">
                {companyName}
              </span>
            )}
          </div>

          {/* Back Face */}
          <div className="flip-card-back shadow-xl p-6 sm:p-8 flex flex-col">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#2C2C2C] mb-2">
              {companyName}
            </h3>
            <p className="text-sm sm:text-base font-mono text-[#2C2C2C]/70 mb-4">
              {dateRange || "Dates TBD"}
            </p>
            <div className="flex-grow overflow-auto">
              <h4 className="text-xs font-semibold text-[#2C2C2C]/80 mb-2 uppercase tracking-wide">
                About
              </h4>
              <p className="text-sm sm:text-base text-[#2C2C2C]/80 leading-relaxed whitespace-pre-line">
                {about || "Details coming soon..."}
              </p>
            </div>
            
            {peopleToThank && peopleToThank.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#2C2C2C]/10">
                <h4 className="text-xs font-semibold text-[#2C2C2C]/80 mb-2 uppercase tracking-wide">
                  People to thank
                </h4>
                <div className="flex flex-wrap gap-2">
                  {peopleToThank.map((person, index) => (
                    <a
                      key={index}
                      href={person.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm text-[#2C2C2C]/70 hover:text-[#2C2C2C] underline underline-offset-2 transition-colors"
                    >
                      {person.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default ExperienceCard;

