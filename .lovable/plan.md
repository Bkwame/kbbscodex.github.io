## Bioinformatics & Genomics Learning Blog

A clean, modern, minimalist blog inspired by `lh3.github.io` — but with a calmer, smarter visual identity and modern interactions. Posts are authored as MDX files in the repo, so you push to GitHub and the site rebuilds automatically on Cloudflare Pages / Vercel (both free).

---

### Design direction

- **Vibe:** calm, scholarly, modern — think a quiet research notebook crossed with a minimalist tech blog (Tailwind UI / Vercel / Anthropic-style restraint).
- **Palette (calm + smart):**
  - Light: warm off-white background (`oklch(0.985 0.005 95)`), deep slate-ink text (`oklch(0.22 0.02 250)`), muted teal accent (`oklch(0.55 0.08 200)`).
  - Dark: deep navy-slate background (`oklch(0.18 0.025 250)`), soft paper text, same teal accent slightly brighter.
- **Typography:** Inter (UI), Source Serif 4 or Lora (post body & H1) for a quiet "long-read" feel, JetBrains Mono for code.
- **Motion:** subtle fade/slide on route transitions; hover lift on post cards; smooth dark-mode toggle. Nothing flashy.
- **Layout:** centered max-width (~720px reading column, ~960px on listings), generous whitespace, hairline dividers.

---

### Pages & routes

```text
/                  Home — short hero (1–2 lines about you) + recent 5 posts
/posts             Archive — full chronological list, grouped by year
/posts/$slug       Individual post (MDX rendered)
/tags              All tags with post counts
/tags/$tag         Posts filtered by tag
/about             About / mini-CV page
/api/public/rss    Auto-generated RSS feed
```

A 404 page and an error boundary on every route.

### Components

- `SiteHeader` — site title + nav (Home, Archive, Tags, About) + dark-mode toggle + RSS icon
- `SiteFooter` — minimal: copyright, GitHub link, RSS link
- `PostCard` — date · title · tags · 1-line summary
- `PostList` — grouped-by-year listing (matches lh3 style)
- `TagPill` — small rounded label
- `Prose` wrapper — Tailwind typography styling for MDX output
- `ThemeToggle` — light/dark with `localStorage` persistence
- `CodeBlock` — Shiki-highlighted with copy button
- Math via `rehype-katex`

### Content authoring (MDX)

Posts live at `src/content/posts/*.mdx` with frontmatter:

```mdx
---
title: "My first week with minimap2"
date: 2026-05-12
tags: [genomics, alignment, tools]
summary: "Notes on getting started with long-read alignment."
---

Markdown body here, with optional React components, code blocks
with ```python …```, and inline math like $E = mc^2$.
```

To add a new post: create a new `.mdx` file, commit, push — the site rebuilds.

---

### Technical details

- **Stack:** TanStack Start (already configured) + Tailwind v4 + shadcn/ui primitives.
- **MDX pipeline:** `@mdx-js/rollup` Vite plugin + `import.meta.glob('/src/content/posts/*.mdx', { eager: true })` to enumerate posts at build time. No database needed.
- **Markdown plugins:**
  - `remark-gfm` (tables, task lists)
  - `remark-math` + `rehype-katex` (LaTeX)
  - `rehype-shiki` or `@shikijs/rehype` for syntax highlighting (calm "github-light" / "github-dark" themes that auto-switch).
- **Routing:** file-based under `src/routes/`. Post list is loaded synchronously via the eager glob (works at SSR and at static render).
- **RSS:** `/api/public/rss` server route reads the same eager glob and emits `application/rss+xml`.
- **Dark mode:** `class="dark"` on `<html>`, toggled by a small client-only script in `__root.tsx` to avoid flash.
- **SEO:** per-route `head()` with title/description/og:title/og:description; post routes include `og:title` and a structured-data JSON-LD `BlogPosting`.
- **Deployment:** repo connects to Cloudflare Pages (or Vercel) — both have generous free tiers and full TanStack Start support. I'll include a short `DEPLOY.md` with the exact steps after connecting Lovable → GitHub.

> Note on hosting: GitHub Pages itself only serves static files and would force us to drop server features (RSS endpoint, future search, etc.). Cloudflare Pages / Vercel free tiers give you the same "push to GitHub, site updates" workflow with no cost, and you can still keep the repo on GitHub.

---

### Build steps

1. **Foundation** — install MDX, Shiki, KaTeX, remark/rehype plugins; set up the Vite MDX plugin; add Inter / Source Serif / JetBrains Mono via `@fontsource`.
2. **Design tokens** — write the calm palette + typography + radii into `src/styles.css` (light + dark), wire Tailwind `prose` to use them.
3. **Layout shell** — `SiteHeader`, `SiteFooter`, `ThemeToggle` (no-flash dark mode), shared layout in `__root.tsx`.
4. **Content layer** — `src/content/posts/` directory, frontmatter typing, post-loader utility, 2–3 seed MDX posts (with code + math) so the design has real content to show.
5. **Routes** — `/`, `/posts`, `/posts/$slug`, `/tags`, `/tags/$tag`, `/about`, plus 404/error components.
6. **Polish** — Shiki highlighting, KaTeX styles, copy-to-clipboard on code, subtle motion on cards and route transitions, per-page SEO `head()`.
7. **RSS feed** — `/api/public/rss` server route.
8. **Deploy guide** — short `DEPLOY.md` covering: connect Lovable → GitHub, then connect that repo to Cloudflare Pages (build command `bun run build`, output dir handled by the TanStack adapter).

After step 1 the site already builds; each subsequent step is independently reviewable in preview.
