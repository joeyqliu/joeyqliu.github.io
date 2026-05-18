"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { BlogPostMeta } from "@/lib/blog";

function BlogListInner({ posts }: { posts: BlogPostMeta[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTag = searchParams.get("tag");

  const handleTagClick = (tag: string) => {
    if (activeTag === tag) {
      router.push("/blog");
    } else {
      router.push(`/blog?tag=${tag}`);
    }
  };

  return (
    <ul className="flex flex-col divide-y divide-[#111111]/10 dark:divide-[#f2f2f2]/10">
      {posts.map((post) => {
        const isVisible = !activeTag || post.tags.includes(activeTag);

        return (
          <li
            key={post.slug}
            className={`transition-all duration-300 ease-in-out ${
              isVisible
                ? "opacity-100 max-h-40 py-4"
                : "opacity-0 max-h-0 py-0 overflow-hidden"
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <Link
                href={`/blog/${post.slug}`}
                className="text-base sm:text-lg text-[#111111] dark:text-[#f2f2f2] font-[family-name:var(--font-geist)] hover:text-[#555555] dark:hover:text-[#999999] visited:text-[#777777] dark:visited:text-[#888888] transition-colors"
                style={{ fontWeight: 500, lineHeight: 1.2 }}
              >
                {post.title}
              </Link>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <time className="text-[13px] text-[#555555] dark:text-[#999999] font-[family-name:var(--font-ibm-plex-mono)]">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {post.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className={`text-[13px] font-[family-name:var(--font-ibm-plex-mono)] transition-colors ${
                          activeTag === tag
                            ? "text-[#111111] dark:text-[#f2f2f2]"
                            : "text-[#555555] dark:text-[#999999] hover:text-[#111111] dark:hover:text-[#f2f2f2]"
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {post.description && (
              <p
                className="mt-1.5 text-sm text-[#555555] dark:text-[#999999] font-[family-name:var(--font-geist)]"
                style={{ lineHeight: 1.5 }}
              >
                {post.description}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function BlogList({ posts }: { posts: BlogPostMeta[] }) {
  return (
    <Suspense fallback={<div />}>
      <BlogListInner posts={posts} />
    </Suspense>
  );
}
