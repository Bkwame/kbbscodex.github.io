import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Notes on bioinformatics & genomics" },
      {
        name: "description",
        content:
          "About me and this learning journal on bioinformatics, genomics, and computational biology.",
      },
      { property: "og:title", content: "About — Notes on bioinformatics & genomics" },
      {
        property: "og:description",
        content: "About me and this learning journal on bioinformatics & genomics.",
      },
    ],
  }),
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-16 pt-12 sm:pt-16">
      <header className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">About</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-ink">
          Hi — I'm learning bioinformatics in the open.
        </h1>
      </header>

      <div className="prose">
        <p>
          I'm a researcher (in training) working through bioinformatics, genomics, and the
          algorithms that make modern sequencing possible. This site is the public version
          of my notebook: short posts on tools, papers, and the bugs I hit along the way.
        </p>

        <h2>What you'll find here</h2>
        <ul>
          <li>Hands-on notes on read aligners, variant callers, and assemblers.</li>
          <li>Slow walkthroughs of algorithms — FM-index, minimizers, de Bruijn graphs.</li>
          <li>Notes on papers I'm trying to understand, with the maths kept explicit.</li>
        </ul>

        <h2>Elsewhere</h2>
        <ul>
          <li>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              GitHub
            </a>{" "}
            — code and pipelines.
          </li>
          <li>
            <a href="/api/public/rss">RSS feed</a> — for a quieter inbox.
          </li>
        </ul>

        <h2>Get in touch</h2>
        <p>
          Spotted an error or have something to add? Open an issue on the GitHub repo for
          this site and I'll read it.
        </p>
      </div>
    </div>
  );
}
