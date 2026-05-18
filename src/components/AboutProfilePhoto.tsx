"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { PauseIcon, PlayIcon } from "@phosphor-icons/react";

const photos = ["/joey.jpeg", "/canyon_joey.jpeg", "/pixel_joey.jpeg"];
const INTERVAL_MS = 5000;

// Read the reduced-motion preference at module load on the client (safe — this
// file is "use client", so the lazy initializer below only runs in the browser).
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function AboutProfilePhoto() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(prefersReducedMotion);

  useEffect(() => {
    if (isPaused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [isPaused]);

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] rounded-full overflow-hidden shrink-0">
        {photos.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt="Joey Liu"
            fill
            sizes="(min-width: 640px) 240px, 200px"
            className={`object-cover transition-opacity duration-700 ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            priority={i === 0}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => setIsPaused((p) => !p)}
        aria-label={isPaused ? "Resume photo cycling" : "Pause photo cycling"}
        className="text-[#555555] dark:text-[#999999] hover:text-[#111111] dark:hover:text-[#f2f2f2] transition-colors p-1"
      >
        {isPaused ? (
          <PlayIcon weight="duotone" className="w-3.5 h-3.5" />
        ) : (
          <PauseIcon weight="duotone" className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}
