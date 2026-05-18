import Link from "next/link";
import {
  HandWavingIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
  EnvelopeIcon,
} from "@phosphor-icons/react/ssr";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] relative transition-colors">
      <ThemeToggle />

      <div className="min-h-screen flex flex-col px-6 sm:px-14 pt-16 sm:pt-[42px] pb-12 sm:pb-12 gap-6">
        <section className="max-w-[760px] flex flex-col gap-7">
          <p className="text-[13px] text-[#555555] dark:text-[#999999] font-[family-name:var(--font-ibm-plex-mono)]">
            software engineer / cloud infrastructure
          </p>
          <h1
            className="text-4xl sm:text-[58px] text-[#111111] dark:text-[#f2f2f2] font-[family-name:var(--font-geist)] tracking-tight"
            style={{ fontWeight: 500, lineHeight: 1.02 }}
          >
            <HandWavingIcon
              weight="duotone"
              aria-hidden="true"
              className="wave-emoji inline-block align-middle mr-3 sm:mr-4 -translate-y-[0.05em]"
              style={{ width: "0.9em", height: "0.9em" }}
            />
            hey, i&apos;m joey.
          </h1>
          <p
            className="text-lg sm:text-[22px] text-[#111111] dark:text-[#f2f2f2] font-[family-name:var(--font-geist)]"
            style={{ lineHeight: 1.34 }}
          >
            by day, i&apos;m a software engineer working on the infra layer at handshake.
            by night you&apos;ll probably find me playing basketball,
            building grove, and mentoring the next generation at uc santa
            cruz and san jose state university.{" "}
            <Link
              href="/about"
              className="underline underline-offset-4 decoration-[#111111]/30 dark:decoration-[#f2f2f2]/30 hover:decoration-[#111111] dark:hover:decoration-[#f2f2f2] transition-colors"
            >
              more about me here.
            </Link>
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <p className="text-[13px] text-[#111111] dark:text-[#f2f2f2] font-[family-name:var(--font-ibm-plex-mono)]">
                contact
              </p>
              <div className="flex items-center gap-[18px]">
                <Link
                  href="https://github.com/joeyqliu"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="text-[#1A1A1A]/80 dark:text-[#f2f2f2]/80 hover:text-[#1A1A1A] dark:hover:text-[#f2f2f2] transition-colors"
                >
                  <GithubLogoIcon weight="duotone" className="w-[18px] h-[18px]" />
                </Link>
                <Link
                  href="https://linkedin.com/in/joeyqliu"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-[#666666]/90 dark:text-[#999999]/90 hover:text-[#1A1A1A] dark:hover:text-[#f2f2f2] transition-colors"
                >
                  <LinkedinLogoIcon weight="duotone" className="w-[18px] h-[18px]" />
                </Link>
                <Link
                  href="mailto:joeyqliu@gmail.com"
                  aria-label="Email"
                  className="text-[#666666]/90 dark:text-[#999999]/90 hover:text-[#1A1A1A] dark:hover:text-[#f2f2f2] transition-colors"
                >
                  <EnvelopeIcon weight="duotone" className="w-[18px] h-[18px]" />
                </Link>
              </div>
            </div>

            <Link
              href="/about"
              className="text-[13px] text-[#111111] dark:text-[#f2f2f2] hover:text-[#555555] dark:hover:text-[#999999] font-[family-name:var(--font-ibm-plex-mono)] w-fit transition-colors"
            >
              about
            </Link>
            <Link
              href="/work"
              className="text-[13px] text-[#111111] dark:text-[#f2f2f2] hover:text-[#555555] dark:hover:text-[#999999] font-[family-name:var(--font-ibm-plex-mono)] w-fit transition-colors"
            >
              work
            </Link>
            <Link
              href="/blog"
              className="text-[13px] text-[#111111] dark:text-[#f2f2f2] hover:text-[#555555] dark:hover:text-[#999999] font-[family-name:var(--font-ibm-plex-mono)] w-fit transition-colors"
            >
              writing
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
