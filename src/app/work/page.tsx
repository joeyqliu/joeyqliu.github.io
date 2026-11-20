import Link from "next/link";
import { CaretRightIcon, DotIcon } from "@phosphor-icons/react/ssr";
import ThemeToggle from "@/components/ThemeToggle";
import { workJobs } from "@/data/experience";

export default function Work() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] relative transition-colors">
      <ThemeToggle />

      <div className="min-h-screen flex flex-col px-6 sm:px-14 pt-16 sm:pt-[42px] pb-12 sm:pb-12 gap-6">
        <div className="flex gap-6">
        <Link
          href="/"
          className="text-[13px] text-[#555555] dark:text-[#999999] hover:text-[#111111] dark:hover:text-[#f2f2f2] font-[family-name:var(--font-ibm-plex-mono)] w-fit transition-colors"
        >
          ← back
        </Link>
        <Link
          href="/resume"
          className="text-[13px] text-[#555555] dark:text-[#999999] hover:text-[#111111] dark:hover:text-[#f2f2f2] font-[family-name:var(--font-ibm-plex-mono)] w-fit transition-colors"
        >
          resume →
        </Link>
        </div>

        <section className="max-w-[760px] w-full flex flex-col gap-10 pt-4 sm:pt-8">
          <h1
            className="text-3xl sm:text-[40px] text-[#111111] dark:text-[#f2f2f2] font-[family-name:var(--font-geist)] tracking-tight"
            style={{ fontWeight: 500, lineHeight: 1.05 }}
          >
            work
          </h1>

          {/* Each entry is a collapsible <details> — edit src/data/experience.ts; toggle `defaultOpen` to change initial state */}
          <div className="flex flex-col">
            {workJobs().map(({ company, role, dates, defaultOpen, work: body }) => (
              <details
                key={company}
                open={defaultOpen}
                className="group py-8 first:pt-0 border-b border-[#111111]/10 dark:border-[#f2f2f2]/10 last:border-b-0"
              >
                <summary className="list-none [&::-webkit-details-marker]:hidden flex flex-col gap-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <div className="flex items-center gap-2">
                      <CaretRightIcon
                        weight="duotone"
                        aria-hidden="true"
                        className="w-4 h-4 text-[#555555] dark:text-[#999999] transition-transform duration-200 group-open:rotate-90 shrink-0"
                      />
                      <h2
                        className="text-2xl sm:text-[28px] text-[#111111] dark:text-[#f2f2f2] font-[family-name:var(--font-geist)]"
                        style={{ fontWeight: 500, lineHeight: 1.1 }}
                      >
                        {company}
                      </h2>
                    </div>
                    <p className="text-[13px] text-[#555555] dark:text-[#999999] font-[family-name:var(--font-ibm-plex-mono)]">
                      {dates}
                    </p>
                  </div>
                  <p className="text-[13px] text-[#555555] dark:text-[#999999] font-[family-name:var(--font-ibm-plex-mono)] ml-6">
                    {role}
                  </p>
                </summary>

                <div className="flex flex-col gap-4 mt-4 ml-6">
                  {body.map((paragraph, i) => (
                    <div key={i} className="flex gap-2">
                      <DotIcon
                        weight="duotone"
                        aria-hidden="true"
                        className="w-5 h-5 mt-0.5 shrink-0 text-[#555555]/70 dark:text-[#999999]/70"
                      />
                      <p
                        className="flex-1 text-base sm:text-lg text-[#111111] dark:text-[#f2f2f2] font-[family-name:var(--font-geist)]"
                        style={{ lineHeight: 1.5 }}
                      >
                        {paragraph}
                      </p>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
