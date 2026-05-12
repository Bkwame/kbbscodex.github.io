import { createFileRoute, Link } from "@tanstack/react-router";
import { getAllTags } from "@/lib/posts";

export const Route = createFileRoute("/tags")({
  component: TagsPage,
  head: () => ({
    meta: [
      { title: "Tags — Notes on bioinformatics & genomics" },
      { name: "description", content: "Browse posts by topic." },
      { property: "og:title", content: "Tags — Notes on bioinformatics & genomics" },
      { property: "og:description", content: "Browse posts by topic." },
    ],
  }),
});

function TagsPage() {
  const tags = getAllTags();
  return (
    <div className="mx-auto max-w-3xl px-5 pb-16 pt-12 sm:pt-16">
      <header className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Tags</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-ink">
          Browse by topic
        </h1>
      </header>
      <ul className="flex flex-wrap gap-2">
        {tags.map(({ tag, count }) => (
          <li key={tag}>
            <Link
              to="/tags/$tag"
              params={{ tag }}
              className="inline-flex items-baseline gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-ink transition-colors hover:border-primary/40 hover:text-primary"
            >
              <span>{tag}</span>
              <span className="font-mono text-xs text-muted-foreground">{count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
