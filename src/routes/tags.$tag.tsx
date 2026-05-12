import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPostsByTag } from "@/lib/posts";
import { PostList } from "@/components/post-list";

export const Route = createFileRoute("/tags/$tag")({
  component: TagPage,
  loader: ({ params }) => {
    const posts = getPostsByTag(params.tag);
    if (posts.length === 0) throw notFound();
    return { posts: posts.map(({ Component: _c, ...m }) => m), tag: params.tag };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    return {
      meta: [
        { title: `#${loaderData.tag} — kbb's codex` },
        { name: "description", content: `Posts tagged ${loaderData.tag}.` },
        { property: "og:title", content: `#${loaderData.tag}` },
        { property: "og:description", content: `Posts tagged ${loaderData.tag}.` },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="font-serif text-2xl font-semibold text-ink">No posts for this tag yet</h1>
      <Link to="/tags" className="mt-4 inline-block text-sm text-primary hover:underline">
        Back to all tags
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="font-serif text-2xl font-semibold text-ink">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function TagPage() {
  const { posts, tag } = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-3xl px-5 pb-16 pt-12 sm:pt-16">
      <header className="mb-10">
        <Link
          to="/tags"
          className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
        >
          ← All tags
        </Link>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-ink">
          <span className="text-muted-foreground">#</span>
          {tag}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </p>
      </header>
      <PostList posts={posts} />
    </div>
  );
}
