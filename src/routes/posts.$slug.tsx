import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPostBySlug, formatDate } from "@/lib/posts";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/posts/$slug")({
  component: PostPage,
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { post } = loaderData;
    const desc = post.summary ?? `${post.title} — notes on bioinformatics & genomics.`;
    return {
      meta: [
        { title: `${post.title} — Notes on bioinformatics & genomics` },
        { name: "description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:title", content: post.title },
        { property: "og:description", content: desc },
        { property: "article:published_time", content: post.date },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="font-serif text-2xl font-semibold text-ink">Post not found</h1>
      <Link to="/posts" className="mt-4 inline-block text-sm text-primary hover:underline">
        Back to archive
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="font-serif text-2xl font-semibold text-ink">Couldn't load this post</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function PostPage() {
  const { post } = Route.useLoaderData();
  const Body = post.Component;
  return (
    <article className="mx-auto max-w-3xl px-5 pb-20 pt-10 sm:pt-14">
      <Link
        to="/posts"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Archive
      </Link>

      <header className="mb-8 mt-6">
        <time
          dateTime={post.date}
          className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
        >
          {formatDate(post.date)}
        </time>
        <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
          {post.title}
        </h1>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((t: string) => (
              <Link
                key={t}
                to="/tags/$tag"
                params={{ tag: t }}
                className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {t}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="prose">
        <Body />
      </div>
    </article>
  );
}
