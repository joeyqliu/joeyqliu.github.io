"use client";

import { useState } from "react";

interface TimelineItem {
  id: string;
  label: string;
}

interface TimelineProps {
  pastItems: TimelineItem[];
  activeCardId: string | null;
  onScrollToCard: (id: string) => void;
}

export default function Timeline({
  pastItems,
  activeCardId,
  onScrollToCard,
}: TimelineProps) {
  const [isPastHovered, setIsPastHovered] = useState(false);

  const isPresentActive = activeCardId === "handshake";
  const isPastActive = pastItems.some((item) => item.id === activeCardId);

  return (
    <div className="fixed right-6 sm:right-10 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-6">
      {/* Present */}
      <button
        onClick={() => onScrollToCard("handshake")}
        className={`text-sm font-mono tracking-wide transition-all duration-300 hover:text-[#2C2C2C] ${
          isPresentActive
            ? "text-[#2C2C2C] font-semibold"
            : "text-[#2C2C2C]/40"
        }`}
      >
        present
      </button>

      {/* Past with hover dropdown */}
      <div
        className="relative"
        onMouseEnter={() => setIsPastHovered(true)}
        onMouseLeave={() => setIsPastHovered(false)}
      >
        <button
          className={`text-sm font-mono tracking-wide transition-all duration-300 hover:text-[#2C2C2C] ${
            isPastActive
              ? "text-[#2C2C2C] font-semibold"
              : "text-[#2C2C2C]/40"
          }`}
        >
          past
        </button>

        {/* Dropdown - pt-2 creates hoverable bridge, pb-4 extends hover area */}
        <div
          className={`absolute right-0 top-full pt-2 pb-4 pr-4 -mr-4 flex flex-col items-end gap-2 transition-all duration-300 ${
            isPastHovered
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          {pastItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onScrollToCard(item.id)}
              className={`text-xs font-mono tracking-wide whitespace-nowrap transition-all duration-200 hover:text-[#2C2C2C] ${
                activeCardId === item.id
                  ? "text-[#2C2C2C] font-semibold"
                  : "text-[#2C2C2C]/40"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

