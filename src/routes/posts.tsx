import { createFileRoute } from "@tanstack/react-router";
import { getAllPostMeta } from "@/lib/posts";
import { PostList } from "@/components/post-list";

export const Route = createFileRoute("/posts")({
  component: PostsArchive,
  head: () => ({
    meta: [
      { title: "Archive — kbb's codex" },
      { name: "description", content: "All posts, grouped by year." },
      { property: "og:title", content: "Archive — kbb's codex" },
      { property: "og:description", content: "All posts, grouped by year." },
    ],
  }),
});

function PostsArchive() {
  const posts = getAllPostMeta();
  return (
    <div className="mx-auto max-w-3xl px-5 pb-16 pt-12 sm:pt-16">
      <header className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Archive
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-ink">
          All posts
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {posts.length} {posts.length === 1 ? "post" : "posts"} so far.
        </p>
      </header>
      <PostList posts={posts} groupByYear />
    </div>
  );
}
