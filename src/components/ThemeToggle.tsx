"use client";

import { useSyncExternalStore } from "react";
import { SunIcon, MoonStarsIcon } from "@phosphor-icons/react";

type Theme = "light" | "dark";

// Subscribe to <html class="dark"> changes via MutationObserver so the toggle
// re-renders whenever the theme flips — no setState-in-effect plumbing needed.
function subscribe(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getClientSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  const handleToggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", next);
    } catch {
      // localStorage may be unavailable in private modes — toggle still works for the session
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="absolute top-10 right-6 sm:top-[51px] sm:right-14 flex items-center gap-1.5 select-none text-[#555555] dark:text-[#999999] hover:text-[#111111] dark:hover:text-[#f2f2f2] transition-colors"
    >
      <SunIcon
        weight="duotone"
        className={`w-[18px] h-[18px] transition-opacity ${
          theme === "light" ? "opacity-100" : "opacity-40"
        }`}
      />
      <span className="text-xs leading-none">/</span>
      <MoonStarsIcon
        weight="duotone"
        className={`w-[18px] h-[18px] transition-opacity ${
          theme === "dark" ? "opacity-100" : "opacity-40"
        }`}
      />
    </button>
  );
}
