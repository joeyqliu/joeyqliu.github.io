# Resume page + shared experience data — design (short)

**Why:** One centralized place to manage experience, and a simple `/resume` page that's easy to keep up to date over time.

**What**
- `src/data/experience.ts` is the single source of truth: jobs + education.
  - Each job: `company`, `role`, `dates`, `location`, `work` (long `/work` paragraphs), `resume` (short bullets), `onResume` (show on `/resume`), `onWork` (show on `/work`, default true), `defaultOpen` (expanded on `/work`).
  - Hiding a job = flip a flag; nothing is deleted.
- `/work` renders exactly as today, but from the data file.
- `/resume` (new) mirrors the PDF layout: big Bebas Neue name, contact top-right, work experience, education. Body in Poppins (free Google fonts).
  - Contact: email + GitHub + LinkedIn. **No phone, no city** (privacy).
  - Short bullets rewritten from current `/work` content; titles/dates follow `/work` (Rivian → May 2023, iotium → Feb 2021).
  - Shows Handshake + Rivian + education. iotium and the two UCSC jobs are `/work` only (`onResume: false`).
- Print → PDF: one Letter page, black on white, theme toggle and back link hidden. On screen it follows the site's light/dark theme.
- `/resume` linked from the top of `/work`; homepage nav unchanged.

**Approaches considered**
1. *Chosen:* shared TypeScript data file — matches `/work`'s existing inline-array pattern, no new deps.
2. Markdown file in `content/` parsed with gray-matter — more plumbing, structured fields (dates/location) awkward.
3. `/resume` only, `/work` links to it — loses the narrative `/work` page.

**Builder's calls:** exact resume bullet wording (user reviews), spacing/sizes, print margins.
