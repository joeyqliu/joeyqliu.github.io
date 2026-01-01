import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";

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
    <div className="min-h-screen flex flex-col">
      <Header currentPage="blog" />

      <main className="flex-grow px-4 sm:px-6 py-8 sm:py-12">
        <article className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-gray-600 hover:text-amber-700 mb-8 font-[family-name:var(--font-geist-mono)]"
          >
            ← Back to blog
          </Link>

          {/* Post header */}
          <header className="mb-8 pb-8 border-b border-[#d4c4b0]">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <time className="font-[family-name:var(--font-geist-mono)]">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-[#e8ddd0] font-[family-name:var(--font-geist-mono)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Post content */}
          <div className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline prose-code:bg-[#e8ddd0] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-[family-name:var(--font-geist-mono)] prose-pre:bg-[#2C2C2C] prose-pre:text-gray-100 prose-ul:list-disc prose-ol:list-decimal prose-li:text-gray-700">
            <MDXRemote source={post.content} />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

