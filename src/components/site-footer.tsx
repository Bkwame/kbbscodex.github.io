export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto flex max-w-3xl flex-col items-start justify-between gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center">
        <p>
          © {new Date().getFullYear()} · kbb's codex.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Bkwame"
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://github.com/Bkwame/kbbscodex.github.io/issues"
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink transition-colors"
          >
            Report an error
          </a>
          <a
            href="/api/public/rss"
            title="RSS feed: paste this link into a feed reader to follow new posts"
            className="hover:text-ink transition-colors"
          >
            RSS
          </a>
        </div>
      </div>
    </footer>
  );
}
