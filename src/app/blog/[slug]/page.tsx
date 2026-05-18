import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import ThemeToggle from "@/components/ThemeToggle";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | Joey Liu`,
    description: post.description,
  };
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] relative transition-colors">
      <ThemeToggle />

      <div className="min-h-screen flex flex-col px-6 sm:px-14 pt-16 sm:pt-[42px] pb-12 sm:pb-12 gap-6">
        <Link
          href="/blog"
          className="text-[13px] text-[#555555] dark:text-[#999999] hover:text-[#111111] dark:hover:text-[#f2f2f2] font-[family-name:var(--font-ibm-plex-mono)] w-fit transition-colors"
        >
          ← back to writing
        </Link>

        <article className="max-w-[760px] w-full flex flex-col gap-8 pt-4 sm:pt-8">
          <header className="flex flex-col gap-4">
            <h1
              className="text-3xl sm:text-[44px] text-[#111111] dark:text-[#f2f2f2] font-[family-name:var(--font-geist)] tracking-tight"
              style={{ fontWeight: 500, lineHeight: 1.1 }}
            >
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[#555555] dark:text-[#999999] font-[family-name:var(--font-ibm-plex-mono)]">
              <time>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </header>

          <div
            className="prose prose-lg max-w-none font-[family-name:var(--font-geist)]
              prose-headings:font-[family-name:var(--font-geist)] prose-headings:tracking-tight prose-headings:text-[#111111] dark:prose-headings:text-[#f2f2f2]
              prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
              prose-p:text-[#111111] dark:prose-p:text-[#f2f2f2]
              prose-strong:text-[#111111] dark:prose-strong:text-[#f2f2f2]
              prose-a:text-[#111111] dark:prose-a:text-[#f2f2f2] prose-a:underline prose-a:underline-offset-4 prose-a:decoration-[#555555]/40 dark:prose-a:decoration-[#999999]/40 hover:prose-a:decoration-[#111111] dark:hover:prose-a:decoration-[#f2f2f2]
              prose-code:bg-[#111111]/5 dark:prose-code:bg-[#f2f2f2]/10 prose-code:text-[#111111] dark:prose-code:text-[#f2f2f2] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-[family-name:var(--font-ibm-plex-mono)] prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-[#0a0a0a] dark:prose-pre:bg-[#1a1a1a] prose-pre:text-[#f2f2f2] prose-pre:border prose-pre:border-[#111111]/10 dark:prose-pre:border-[#f2f2f2]/10
              prose-ul:list-disc prose-ol:list-decimal
              prose-li:text-[#111111] dark:prose-li:text-[#f2f2f2]
              prose-blockquote:border-l-[#555555]/40 dark:prose-blockquote:border-l-[#999999]/40 prose-blockquote:text-[#555555] dark:prose-blockquote:text-[#999999] prose-blockquote:font-normal prose-blockquote:not-italic
              prose-hr:border-[#111111]/10 dark:prose-hr:border-[#f2f2f2]/10"
          >
            <MDXRemote source={post.content} />
          </div>
        </article>
      </div>
    </div>
  );
}

