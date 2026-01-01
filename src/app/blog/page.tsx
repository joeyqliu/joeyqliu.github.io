import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPosts } from "@/lib/blog";
import BlogList from "@/components/BlogList";

export default function Blog() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="blog" />

      <main className="flex-grow px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          {posts.length === 0 ? (
            <p className="text-gray-600 text-center py-12">
              No posts yet. Check back soon!
            </p>
          ) : (
            <BlogList posts={posts} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
