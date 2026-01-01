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
    <ul className="space-y-1">
      {posts.map((post) => {
        const isVisible = !activeTag || post.tags.includes(activeTag);

        return (
          <li
            key={post.slug}
            className={`flex items-baseline justify-between gap-4 transition-all duration-300 ease-in-out ${
              isVisible
                ? "opacity-100 max-h-12 py-2"
                : "opacity-0 max-h-0 py-0 overflow-hidden"
            }`}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="text-lg font-semibold hover:text-amber-700 transition-colors truncate"
            >
              {post.title}
            </Link>

            <div className="flex items-baseline gap-3 shrink-0">
              <time className="text-sm text-gray-500 font-[family-name:var(--font-geist-mono)]">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              {post.tags.length > 0 && (
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTagClick(tag);
                      }}
                      className={`text-xs font-[family-name:var(--font-geist-mono)] transition-colors cursor-pointer ${
                        activeTag === tag
                          ? "text-amber-700 font-semibold"
                          : "text-gray-500 hover:text-amber-700"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function BlogList({ posts }: { posts: BlogPostMeta[] }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogListInner posts={posts} />
    </Suspense>
  );
}

