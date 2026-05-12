/**
 * Content loader: enumerates all MDX posts at build time using import.meta.glob.
 * Each post exports a default React component (the MDX body) and a `frontmatter`
 * object via remark-mdx-frontmatter.
 */
import type { ComponentType } from "react";

export interface PostFrontmatter {
  title: string;
  date: string; // ISO yyyy-mm-dd
  tags?: string[];
  summary?: string;
}

export interface PostModule {
  default: ComponentType;
  frontmatter: PostFrontmatter;
}

export interface PostMeta extends PostFrontmatter {
  slug: string;
}

export interface Post extends PostMeta {
  Component: ComponentType;
}

const modules = import.meta.glob<PostModule>("/src/content/posts/*.mdx", { eager: true });

function slugFromPath(path: string): string {
  const file = path.split("/").pop() ?? "";
  return file.replace(/\.mdx$/, "");
}

const allPosts: Post[] = Object.entries(modules)
  .map(([path, mod]) => ({
    slug: slugFromPath(path),
    Component: mod.default,
    ...mod.frontmatter,
  }))
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getAllPosts(): Post[] {
  return allPosts;
}

export function getAllPostMeta(): PostMeta[] {
  return allPosts.map(({ Component: _Component, ...meta }) => meta);
}

export function getPostBySlug(slug: string): Post | undefined {
  return allPosts.find((p) => p.slug === slug);
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of allPosts) {
    for (const tag of post.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getPostsByTag(tag: string): Post[] {
  return allPosts.filter((p) => p.tags?.includes(tag));
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
