import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — kbb's codex" },
      {
        name: "description",
        content:
          "About me and this learning journal on bioinformatics, genomics, and computational biology.",
      },
      { property: "og:title", content: "About — kbb's codex" },
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
          Hi, I'm Kwame.
        </h1>
      </header>

      <div className="prose">
        <p>
          A researcher (in training) working through bioinformatics, genomics, and the
          algorithms that make modern sequencing possible. This site is the public version
          of my notebook: short posts on tools, papers, and the bugs I hit along the way.
        </p>

        <h2>What you'll find here</h2>
        <ul>
          <li>Hands-on notes and my two takes on tools.</li>
          <li>Slow walkthroughs of algorithms.</li>
          <li>Notes on papers I'm trying to understand.</li>
          <li>My experiences around bioinformatics.</li>
        </ul>

        <h2>Elsewhere</h2>
        <ul>
          <li>
            <a href="https://github.com/Bkwame" target="_blank" rel="noreferrer">
              GitHub
            </a>
            : code and pipelines.
          </li>
          <li>
            <a href="/api/public/rss">RSS feed</a>: add this link to a feed reader (Feedly,
            Inoreader, NetNewsWire and so on) and new posts will show up there automatically,
            no email sign-up needed.
          </li>
        </ul>

        <h2>Get in touch</h2>
        <p>
          Spotted an error or have something to add?{" "}
          <a
            href="https://github.com/Bkwame/kbbscodex.github.io/issues"
            target="_blank"
            rel="noreferrer"
          >
            Open an issue on this site's GitHub repository
          </a>{" "}
          and I'll read it.
        </p>
      </div>
    </div>
  );
}
