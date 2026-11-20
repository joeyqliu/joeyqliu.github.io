// Single source of truth for experience. Drives both /work and /resume.
//
// Per job:
//   work      long paragraphs shown on /work
//   resume    short bullets shown on /resume
//   onResume  show on /resume (default: false)
//   onWork    show on /work   (default: true)
//   defaultOpen  expanded by default on /work
// To hide a job somewhere, flip a flag — nothing needs to be deleted.

export type Job = {
  company: string;
  role: string;
  dates: string;
  location: string;
  work: string[];
  resume: string[];
  onResume?: boolean;
  onWork?: boolean;
  defaultOpen?: boolean;
};

export type Education = {
  school: string;
  degree: string;
  dates: string;
  location: string;
};

export const jobs: Job[] = [
  {
    company: "handshake",
    location: "san francisco, ca",
    onResume: true,
    role: "software engineer - cloud infrastructure",
    dates: "may 2023 — present",
    defaultOpen: true,
    work: [
      "led the upgrade and right-sizing of handshake's entire memorystore redis fleet (~65 instances across 5 environments) from redis 4.0/6.x to 7.2 — $280K/year in recurring cost savings, total memory footprint down 61% (982 GB → 381 GB), three years of downstream gem and sidekiq tech debt unblocked, zero production incidents.",
      "led the migration of handshake's ci build infrastructure — our most developer-critical platform — off aws ec2 and onto gcp / gke as named project lead from kickoff through cutover. pivoted from static ec2 builders to ephemeral agents running in kubernetes pods, the critical unlock that lets ci scale with engineering headcount. android and linux builders all now run on a kubernetes-native platform with full infrastructure-as-code, modern secrets management, and a stronger security posture. ~$240K/year in cost savings.",
      "diagnosed a year-long silent failure in our nfs-based git cache for ci builds — the refresh cronjob and consumer pods had been mounting mismatched pvcs for months, leaving every build pulling fresh from origin. shipped the minimum-viable fix (aligned pvcs, faster refresh cadence, proper kubernetes fsgroup ownership in place of a hack init container) that captured ~70-80% of the available networking savings for ~1% of the engineering effort. killed my own previously-scoped daemonset rearchitecture in favor of the simpler design, and concurrently retired two orphaned storage volumes (~11 TiB total) found during the audit — ~$39K/year in recurring cost.",
      "as part of the same ci cost initiative, shipped a one-pr opt-in mechanism that turned on bring-your-own-bucket artifact uploads for every pipeline org-wide — a platform-level switch flipped once and adopted across the entire build fleet, completing the ~$180K/year networking savings program.",
    ],
    resume: [
      "Own Handshake's CI platform, the system that builds and tests every code change. Led a multi-quarter move of all CI builds from AWS EC2 to Kubernetes on GCP, where each build runs on its own temporary machine. Cut compute costs by 35%, from $55K to $36K a month, and have run and improved the platform since.",
      "Found two problems in our CI network and storage setup that had been adding to our cloud bill for over a year. Fixed them with a small, targeted change instead of the large rebuild we had planned, which got most of the savings for a fraction of the work. The fix saves $254K a year in network and storage costs.",
      "Cut average build time for Handshake's main application by 13%, from 26 to 22.6 minutes, and cut time for the slowest builds by 15%, by tuning our Kubernetes cluster for builds, running more build steps in parallel, and caching container images. Based on more than 2,000 production builds, this saves engineers about 85 hours of waiting each month.",
      "Led the upgrade of about 60 Redis databases across 5 environments from unsupported versions to Redis 7.2, finishing in under 6 weeks with no downtime. Resized oversized instances along the way to save $260K a year, and updated our shared Terraform module so new instances start with the right settings, including backups.",
      "Coordinated a security update across 9 services owned by different teams and finished it in 2.5 weeks. Made more than half of the changes myself and worked with each team on its rollout. Then changed our shared Helm chart so new services get the safer settings automatically.",
      "Set up the infrastructure for several new teams and product launches, including Handshake's internal AI model gateway. The gateway is one service that lets teams use models from Google, Anthropic, and other providers. I also moved research ML models into production.",
      "Turned that work into shared tools that other teams now reuse. One is a Terraform module that lets GitHub deploy to GCP without stored keys. Another is a standard way to load ML models from cloud storage. I also built a serverless pipeline that replaced our old workflow system.",
    ],
  },
  {
    company: "rivian",
    location: "palo alto, ca",
    onResume: true,
    role: "software engineer - platform infrastructure",
    dates: "mar 2021 — may 2023",
    defaultOpen: false,
    work: [
      "owned and hardened the in-house terraform module library — 50+ modules used by 500+ engineers across the company — and maintained the broader infrastructure-as-code stack that the same audience depended on day to day.",
      "led the migration from script-based helm deployments to a versioned terraform module adopted across 20+ kubernetes clusters, reimplemented a system-critical dns component and rolled it through 8+ eks clusters with zero customer impact, and scripted the move from cluster-autoscaler to karpenter across our eks fleet.",
      "built drift-detection tooling across 8+ aws accounts to surface unmanaged and orphaned infrastructure, automated documentation and tech-writing pipelines (200+ documents published without manual intervention), and contributed upstream fixes to open policy agent and eks-blueprints.",
      "served as the embedded platform liaison to multiple ~15-person product teams during their design and build phases, maintained 10+ multi-region clusters, and rotated on-call for all critical platform services. my first high-leverage job — and the one that taught me what platform engineering is actually for.",
    ],
    resume: [
      "Owned the in-house Terraform module library (50+ modules) and infrastructure-as-code stack used by 500+ engineers.",
      "Migrated script-based Helm deployments to a versioned Terraform module adopted across 20+ Kubernetes clusters.",
      "Reimplemented a system-critical DNS component and rolled it through 8+ EKS clusters with zero customer impact; automated the move from cluster-autoscaler to Karpenter.",
      "Built drift-detection tooling across 8+ AWS accounts and automated publication of 200+ technical documents.",
      "Contributed upstream fixes to Open Policy Agent and EKS-Blueprints; served as platform liaison to multiple ~15-person product teams.",
    ],
  },
  {
    company: "iotium",
    location: "santa clara, ca",
    onResume: false,
    role: "software engineer",
    dates: "oct 2019 — feb 2021",
    defaultOpen: false,
    work: [
      "worked on iotium's ot access platform: wrote the python + ansible framework that deployed microservices across dev/staging/prod, automated aws infrastructure with terraform, designed custom aws rbac for internal teams, and ran jenkins for continuous releases.",
      "some wins: release-to-prod time down to 30 minutes, ~10-minute downtime cap via a database rollback feature, bulk device onboarding via yaml in the cli, and 20%+ less ops workload from internal tooling. also took on-call rotation and acted as the cross-time-zone bridge between support, solutions, and our india engineering team.",
    ],
    resume: [],
  },
  {
    company: "ucsc genomics institute",
    location: "santa cruz, ca",
    onResume: false,
    role: "junior system admin",
    dates: "jan 2018 — jul 2019",
    defaultOpen: false,
    work: [
      "officially: linux admin work across 30+ file systems — OS installs, network configs, openstack components, and a python script (my first) to automate a tedious file-transfer process with unix syscalls.",
      "unofficially: a lot of standing around in the server room mostly untangling ethernet cables.",
    ],
    resume: [],
  },
  {
    company: "ucsc residential networking",
    location: "santa cruz, ca",
    onResume: false,
    role: "network technician",
    dates: "sep 2016 — dec 2018",
    defaultOpen: false,
    work: [
      "two years of patching up student laptops across windows, mac, and linux, evicting malware, and convincing 150+ dorm routers to acknowledge the campus network.",
      "closed 1000+ servicenow tickets along the way — turns out 'have you tried turning it off and on again' really does work most of the time.",
    ],
    resume: [],
  },
];

export const education: Education[] = [
  {
    school: "University of California, Santa Cruz",
    degree: "Bachelor of Science in Computer Science",
    dates: "oct 2015 — jun 2019",
    location: "santa cruz, ca",
  },
];

export const workJobs = (list: Job[] = jobs): Job[] =>
  list.filter((j) => j.onWork !== false);

export const resumeJobs = (list: Job[] = jobs): Job[] =>
  list.filter((j) => j.onResume === true);
