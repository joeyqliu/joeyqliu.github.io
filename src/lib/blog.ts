import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  published: boolean;
  content: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
}

function parseFrontmatter(fileContent: string, slug: string): BlogPost {
  const { data, content } = matter(fileContent);
  return {
    slug,
    title: data.title || "Untitled",
    date: data.date || new Date().toISOString().split("T")[0],
    description: data.description || "",
    tags: data.tags || [],
    published: data.published !== false, // default to true if not specified
    content,
  };
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith(".mdx"));

  const posts = files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const filePath = path.join(BLOG_DIR, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      return parseFrontmatter(fileContent, slug);
    })
    .filter((post) => post.published) // Only return published posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date descending

  // Return only metadata (not content) for list page
  return posts.map(({ slug, title, date, description, tags }) => ({
    slug,
    title,
    date,
    description,
    tags,
  }));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(fileContent, slug);
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith(".mdx"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const filePath = path.join(BLOG_DIR, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const post = parseFrontmatter(fileContent, slug);
      return post.published ? slug : null;
    })
    .filter((slug): slug is string => slug !== null);
}

