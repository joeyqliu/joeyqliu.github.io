import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { education, resumeJobs } from "@/data/experience";
import styles from "./resume.module.css";

// Content lives in src/data/experience.ts — edit there, not here.
const contact = [
  { label: "joeyqliu@gmail.com", href: "mailto:joeyqliu@gmail.com" },
  { label: "github.com/joeyqliu", href: "https://github.com/joeyqliu" },
  { label: "linkedin.com/in/joeyqliu", href: "https://linkedin.com/in/joeyqliu" },
];

export default function Resume() {
  return (
    <div className={styles.page}>
      <div className={styles.noPrint}>
        <ThemeToggle />
      </div>

      <main className={styles.sheet}>
        <Link href="/work" className={`${styles.back} ${styles.noPrint}`}>
          ← back
        </Link>

        <header className={styles.header}>
          <h1 className={`${styles.display} ${styles.name}`}>Joey Qizhi Liu</h1>
          <div className={styles.contact}>
            <h2 className={styles.display}>Contact Info</h2>
            {contact.map(({ label, href }) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </div>
        </header>

        <hr className={styles.rule} />

        <section>
          <h2 className={`${styles.display} ${styles.sectionTitle}`}>Work Experience</h2>
          {resumeJobs().map(({ company, role, dates, location, resume }) => (
            <article key={company} className={styles.job}>
              <div className={styles.row}>
                <h3 className={`${styles.display} ${styles.role}`}>{role}</h3>
                <span className={`${styles.display} ${styles.role}`}>{dates}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.sub}>{company}</span>
                <span className={styles.sub}>{location}</span>
              </div>
              {resume.length > 0 && (
                <ul className={styles.bullets}>
                  {resume.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </section>

        <hr className={styles.rule} />

        <section>
          <h2 className={`${styles.display} ${styles.sectionTitle}`}>Education</h2>
          {education.map(({ school, degree, dates, location }) => (
            <article key={school} className={styles.job}>
              <div className={styles.row}>
                <h3 className={`${styles.display} ${styles.school}`}>{school}</h3>
                <span className={`${styles.display} ${styles.role}`}>{dates}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.sub}>{degree}</span>
                <span className={styles.sub}>{location}</span>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
