import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { themeInitScript } from "@/components/theme-toggle";

function NotFoundComponent() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        That page doesn't exist — maybe a stale link, maybe a typo.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center rounded-md border border-border px-4 py-2 text-sm text-ink transition-colors hover:bg-accent"
      >
        ← Back home
      </Link>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-sm text-muted-foreground">error</p>
      <h1 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-ink">
        Something broke loading this page.
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">{error.message}</p>
      <div className="mt-6 flex gap-2">
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:opacity-90"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-md border border-border px-4 py-2 text-sm text-ink transition-colors hover:bg-accent"
        >
          Home
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "kbb's codex" },
      {
        name: "description",
        content:
          "A learning journal on bioinformatics, genomics, sequencing, and computational biology.",
      },
      { property: "og:title", content: "kbb's codex" },
      {
        property: "og:description",
        content: "A learning journal on bioinformatics, genomics, and computational biology.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "kbb's codex — RSS",
        href: "/api/public/rss",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    // The theme script below may add class="dark" before React loads, which is expected.
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}
