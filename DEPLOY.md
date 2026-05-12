# Deploying the blog (free hosting)

Two equally good free options. Pick one.

## Option A — Cloudflare Pages

The project is already configured for Cloudflare Workers (`wrangler.jsonc`), so this is the most natural fit.

1. **Connect GitHub.** In Lovable: top-right `+` menu → GitHub → Connect project, then create a new repo.
2. Go to <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Pages** → **Import a Git repository**.
3. Pick your repo. Use these build settings:
   - **Framework preset:** None
   - **Build command:** `bun run build`
   - **Build output directory:** `dist`
   - **Node version:** 20 or higher
4. Deploy. Cloudflare will give you a `your-project.pages.dev` URL. Every push to `main` re-deploys automatically.

## Option B — Vercel

1. Same step 1 as above (connect GitHub via Lovable).
2. Go to <https://vercel.com/new>, import the repo.
3. Vercel auto-detects Vite. If it asks:
   - **Build command:** `bun run build`
   - **Output directory:** `dist`
4. Deploy. You get `your-project.vercel.app`. Every push re-deploys.

## Adding new posts

1. Create a new file in `src/content/posts/` named `your-slug.mdx`.
2. Use this frontmatter at the top:
   ```mdx
   ---
   title: "Your post title"
   date: 2026-05-12
   tags: [genomics, tools]
   summary: "One-line summary for the listing and RSS feed."
   ---
   ```
3. Write the body in Markdown. Code blocks are syntax-highlighted (Shiki). Inline math like `$E = mc^2$` and display math with `$$ … $$` work via KaTeX.
4. Commit and push. The site rebuilds and the new post is live.

## Custom domain

Both Cloudflare Pages and Vercel support free custom domains — add yours in the project's dashboard. You only pay for the domain itself with your registrar.
