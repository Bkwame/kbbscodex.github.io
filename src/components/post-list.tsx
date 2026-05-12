import { Link } from "@tanstack/react-router";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/posts";

export function PostList({ posts, groupByYear = false }: { posts: PostMeta[]; groupByYear?: boolean }) {
  if (posts.length === 0) {
    return <p className="text-sm text-muted-foreground">No posts yet.</p>;
  }

  if (!groupByYear) {
    return (
      <ul className="divide-y divide-border/60">
        {posts.map((p) => (
          <PostRow key={p.slug} post={p} />
        ))}
      </ul>
    );
  }

  const byYear = new Map<string, PostMeta[]>();
  for (const p of posts) {
    const year = p.date.slice(0, 4);
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year)!.push(p);
  }

  return (
    <div className="space-y-10">
      {Array.from(byYear.entries()).map(([year, items]) => (
        <section key={year}>
          <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {year}
          </h2>
          <ul className="divide-y divide-border/60 border-y border-border/60">
            {items.map((p) => (
              <PostRow key={p.slug} post={p} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function PostRow({ post }: { post: PostMeta }) {
  return (
    <li className="group">
      <Link
        to="/posts/$slug"
        params={{ slug: post.slug }}
        className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-5"
      >
        <time
          dateTime={post.date}
          className="shrink-0 font-mono text-xs uppercase tracking-wider text-muted-foreground sm:w-24"
        >
          {formatDate(post.date)}
        </time>
        <div className="flex-1">
          <h3 className="font-serif text-[1.05rem] font-medium text-ink transition-colors group-hover:text-primary">
            {post.title}
          </h3>
          {post.summary && (
            <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{post.summary}</p>
          )}
        </div>
      </Link>
    </li>
  );
}
