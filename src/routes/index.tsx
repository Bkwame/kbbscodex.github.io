import { createFileRoute, Link } from "@tanstack/react-router";
import { getAllPostMeta } from "@/lib/posts";
import { PostList } from "@/components/post-list";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "kbb's codex" },
      {
        name: "description",
        content:
          "A learning journal on bioinformatics, genomics, sequencing tools, and computational biology.",
      },
    ],
  }),
});

function Home() {
  const recent = getAllPostMeta().slice(0, 5);
  return (
    <div className="mx-auto max-w-3xl px-5 pb-16 pt-12 sm:pt-20">
      <section className="mb-14">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Learning bioinformatics, in bits and kmers.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          A working notebook on genomics, sequencing, and the tools and algorithms behind
          them, written as I learn.
        </p>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-serif text-lg font-semibold text-ink">Recent posts</h2>
          <Link
            to="/posts"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            All posts →
          </Link>
        </div>
        <PostList posts={recent} />
      </section>
    </div>
  );
}
