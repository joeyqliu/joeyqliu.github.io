import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { type Icon } from "@phosphor-icons/react";
import {
  MapPinIcon,
  HammerIcon,
  BookOpenIcon,
  SparkleIcon,
  LightbulbIcon,
} from "@phosphor-icons/react/ssr";
import AboutProfilePhoto from "@/components/AboutProfilePhoto";
import ThemeToggle from "@/components/ThemeToggle";

const inlineLinkClass =
  "underline underline-offset-4 decoration-[#555555]/40 dark:decoration-[#999999]/40 hover:text-[#111111] dark:hover:text-[#f2f2f2] hover:decoration-[#111111]/60 dark:hover:decoration-[#f2f2f2]/60 transition-colors";

const aboutFacts: { label: string; Icon: Icon; value: ReactNode }[] = [
  { label: "based in", Icon: MapPinIcon, value: "south bay, ca" },
  {
    label: "currently",
    Icon: HammerIcon,
    value: (
      <>
        building cloud infra @{" "}
        <Link
          href="https://joinhandshake.com"
          target="_blank"
          rel="noopener noreferrer"
          className={inlineLinkClass}
        >
          handshake
        </Link>{" "}
        and building{" "}
        <Link
          href="https://joinflyer.com"
          target="_blank"
          rel="noopener noreferrer"
          className={inlineLinkClass}
        >
          flyer
        </Link>
      </>
    ),
  },
  {
    label: "reading",
    Icon: BookOpenIcon,
    value:
      "how to know a person by david brooks and fear and trembling by søren kierkegaard",
  },
  {
    label: "interests",
    Icon: SparkleIcon,
    value: "pick up basketball, pourovers, composting",
  },
  {
    label: "fun fact",
    Icon: LightbulbIcon,
    value: (
      <>
        i auditioned for russell from{" "}
        <Link
          href="https://en.wikipedia.org/wiki/Up_(2009_film)"
          target="_blank"
          rel="noopener noreferrer"
          className={inlineLinkClass}
        >
          up
        </Link>
        , didn&apos;t get the part
      </>
    ),
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] relative transition-colors">
      <ThemeToggle />

      <div className="min-h-screen flex flex-col px-6 sm:px-14 pt-16 sm:pt-[42px] pb-12 sm:pb-12 gap-6">
        <Link
          href="/"
          className="text-[13px] text-[#555555] dark:text-[#999999] hover:text-[#111111] dark:hover:text-[#f2f2f2] font-[family-name:var(--font-ibm-plex-mono)] w-fit transition-colors"
        >
          ← back
        </Link>

        <section className="max-w-[920px] w-full flex flex-col gap-8 pt-4 sm:pt-8">
          <AboutProfilePhoto />

          <h1
            className="text-3xl sm:text-[40px] text-[#111111] dark:text-[#f2f2f2] font-[family-name:var(--font-geist)] tracking-tight"
            style={{ fontWeight: 500, lineHeight: 1.05 }}
          >
            about
          </h1>

          {/* Sub-header / blurb rows — add more entries to aboutFacts above */}
          <dl className="grid grid-cols-[140px_1fr] sm:grid-cols-[170px_1fr] gap-x-6 gap-y-4 font-[family-name:var(--font-geist)]">
            {aboutFacts.map(({ label, Icon, value }) => (
              <Fragment key={label}>
                <dt
                  className="flex items-center gap-2.5 text-sm sm:text-base text-[#111111] dark:text-[#f2f2f2]"
                  style={{ fontWeight: 600 }}
                >
                  <Icon
                    weight="duotone"
                    aria-hidden="true"
                    className="w-[18px] h-[18px] shrink-0 text-[#555555] dark:text-[#999999]"
                  />
                  <span>{label}</span>
                </dt>
                <dd
                  className="text-sm sm:text-base text-[#555555] dark:text-[#999999] self-center"
                  style={{ fontWeight: 400, lineHeight: 1.45 }}
                >
                  {value}
                </dd>
              </Fragment>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
