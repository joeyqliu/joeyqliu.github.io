import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import BlogList from "@/components/BlogList";
import ThemeToggle from "@/components/ThemeToggle";

export default function Blog() {
  const posts = getAllPosts();

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
            writing
          </h1>

          {posts.length === 0 ? (
            <p className="text-base text-[#555555] dark:text-[#999999] font-[family-name:var(--font-geist)]">
              nothing here yet — check back soon.
            </p>
          ) : (
            <BlogList posts={posts} />
          )}
        </section>
      </div>
    </div>
  );
}
