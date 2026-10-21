import { Link } from "@tanstack/react-router";
import { Rss } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

// "Home" is hidden on phones to save space: the site name on the left already links home.
const navLinks: { to: "/" | "/posts" | "/tags" | "/about"; label: string; exact?: boolean }[] = [
  { to: "/", label: "Home", exact: true },
  { to: "/posts", label: "Archive" },
  { to: "/tags", label: "Tags" },
  { to: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4 sm:px-5">
        <Link
          to="/"
          className="shrink-0 whitespace-nowrap font-serif text-[1.05rem] font-semibold tracking-tight text-ink hover:text-primary transition-colors"
        >
          kbb's codex
        </Link>
        <nav className="flex items-center gap-0.5 text-sm sm:gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.exact ?? false }}
              activeProps={{ className: "text-ink" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className={`rounded-md px-1.5 py-1.5 transition-colors hover:text-ink sm:px-2.5 ${l.to === "/" ? "hidden sm:inline-block" : ""}`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="/api/public/rss"
            aria-label="RSS feed"
            title="RSS feed: paste this link into a feed reader to follow new posts"
            className="inline-flex h-9 w-9 sm:ml-1 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Rss className="h-[16px] w-[16px]" />
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
