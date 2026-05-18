import Link from "next/link";
import { CaretRightIcon, DotIcon } from "@phosphor-icons/react/ssr";
import ThemeToggle from "@/components/ThemeToggle";

const experiences = [
  {
    company: "handshake",
    role: "software engineer - cloud infrastructure",
    dates: "may 2023 — present",
    defaultOpen: true,
    body: [
      "led the upgrade and right-sizing of handshake's entire memorystore redis fleet (~65 instances across 5 environments) from redis 4.0/6.x to 7.2 — $280K/year in recurring cost savings, total memory footprint down 61% (982 GB → 381 GB), three years of downstream gem and sidekiq tech debt unblocked, zero production incidents.",
      "led the migration of handshake's ci build infrastructure — our most developer-critical platform — off aws ec2 and onto gcp / gke as named project lead from kickoff through cutover. pivoted from static ec2 builders to ephemeral agents running in kubernetes pods, the critical unlock that lets ci scale with engineering headcount. android and linux builders all now run on a kubernetes-native platform with full infrastructure-as-code, modern secrets management, and a stronger security posture. ~$240K/year in cost savings.",
      "diagnosed a year-long silent failure in our nfs-based git cache for ci builds — the refresh cronjob and consumer pods had been mounting mismatched pvcs for months, leaving every build pulling fresh from origin. shipped the minimum-viable fix (aligned pvcs, faster refresh cadence, proper kubernetes fsgroup ownership in place of a hack init container) that captured ~70-80% of the available networking savings for ~1% of the engineering effort. killed my own previously-scoped daemonset rearchitecture in favor of the simpler design, and concurrently retired two orphaned storage volumes (~11 TiB total) found during the audit — ~$39K/year in recurring cost.",
      "as part of the same ci cost initiative, shipped a one-pr opt-in mechanism that turned on bring-your-own-bucket artifact uploads for every pipeline org-wide — a platform-level switch flipped once and adopted across the entire build fleet, completing the ~$180K/year networking savings program.",
    ],
  },
  {
    company: "rivian",
    role: "software engineer - platform infrastructure",
    dates: "mar 2021 — may 2023",
    defaultOpen: false,
    body: [
      "owned and hardened the in-house terraform module library — 50+ modules used by 500+ engineers across the company — and maintained the broader infrastructure-as-code stack that the same audience depended on day to day.",
      "led the migration from script-based helm deployments to a versioned terraform module adopted across 20+ kubernetes clusters, reimplemented a system-critical dns component and rolled it through 8+ eks clusters with zero customer impact, and scripted the move from cluster-autoscaler to karpenter across our eks fleet.",
      "built drift-detection tooling across 8+ aws accounts to surface unmanaged and orphaned infrastructure, automated documentation and tech-writing pipelines (200+ documents published without manual intervention), and contributed upstream fixes to open policy agent and eks-blueprints.",
      "served as the embedded platform liaison to multiple ~15-person product teams during their design and build phases, maintained 10+ multi-region clusters, and rotated on-call for all critical platform services. my first high-leverage job — and the one that taught me what platform engineering is actually for.",
    ],
  },
  {
    company: "iotium",
    role: "software engineer",
    dates: "oct 2019 — feb 2021",
    defaultOpen: false,
    body: [
      "worked on iotium's ot access platform: wrote the python + ansible framework that deployed microservices across dev/staging/prod, automated aws infrastructure with terraform, designed custom aws rbac for internal teams, and ran jenkins for continuous releases.",
      "some wins: release-to-prod time down to 30 minutes, ~10-minute downtime cap via a database rollback feature, bulk device onboarding via yaml in the cli, and 20%+ less ops workload from internal tooling. also took on-call rotation and acted as the cross-time-zone bridge between support, solutions, and our india engineering team.",
    ],
  },
  {
    company: "ucsc genomics institute",
    role: "junior system admin",
    dates: "jan 2018 — jul 2019",
    defaultOpen: false,
    body: [
      "officially: linux admin work across 30+ file systems — OS installs, network configs, openstack components, and a python script (my first) to automate a tedious file-transfer process with unix syscalls.",
      "unofficially: a lot of standing around in the server room mostly untangling ethernet cables.",
    ],
  },
  {
    company: "ucsc residential networking",
    role: "network technician",
    dates: "sep 2016 — dec 2018",
    defaultOpen: false,
    body: [
      "two years of patching up student laptops across windows, mac, and linux, evicting malware, and convincing 150+ dorm routers to acknowledge the campus network.",
      "closed 1000+ servicenow tickets along the way — turns out 'have you tried turning it off and on again' really does work most of the time.",
    ],
  },
];

export default function Work() {
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

        <section className="max-w-[760px] w-full flex flex-col gap-10 pt-4 sm:pt-8">
          <h1
            className="text-3xl sm:text-[40px] text-[#111111] dark:text-[#f2f2f2] font-[family-name:var(--font-geist)] tracking-tight"
            style={{ fontWeight: 500, lineHeight: 1.05 }}
          >
            work
          </h1>

          {/* Each entry is a collapsible <details> — edit `experiences` array above; toggle `defaultOpen` to change initial state */}
          <div className="flex flex-col">
            {experiences.map(({ company, role, dates, defaultOpen, body }) => (
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
