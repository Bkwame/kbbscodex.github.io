# Writing and editing posts

Posts are MDX files in `src/content/posts/`. MDX is Markdown that can also hold
React components. The file name becomes the address: `treemmer-review.mdx` is
served at `/posts/treemmer-review`.

## The edit loop

1. Open the repository in VS Code and start a terminal.
2. `bun run dev`, then open <http://localhost:8080>. Leave it running.
3. Edit the `.mdx` file and save. The browser refreshes by itself.
4. When you're happy: `Ctrl + C`, then `bun run build` to make sure it builds.
5. `git add`, `git commit -m "..."`, `git push`. Cloudflare redeploys the live site.

If you want to look at your changes before committing: `git status` lists the files
you changed, and `git diff` shows the lines.

## The top of every post (frontmatter)

```mdx
---
title: "Post title"
date: 2026-10-21
tags: [bioinformatics, phylogenetics]
summary: "One sentence shown in the post list and the RSS feed."
---
```

- `date` is `yyyy-mm-dd`. Posts are sorted by it, newest first.
- Tags are lowercase, separated by commas. A new tag gets its own page automatically.

## Everyday formatting

| You type | You get |
|---|---|
| `## Heading` / `### Smaller heading` | Section headings |
| `**bold**`, `*italic*` | **bold**, *italic* |
| `[link text](https://example.org)` | A link |
| `` `-RTL 0.9` `` | Inline code |
| `- item` or `1. item` | Bullet or numbered list |
| `$d(i,j)$` | Inline maths |
| `$$` on its own line, the formula, then `$$` | Displayed maths |
| `> quoted text` | A quote |

Code blocks use three backticks and a language name for colours:

````mdx
```bash
python3 Treemmer_v0.3.py tree.nwk -RTL 0.9
```
````

Tables are pipes and dashes:

```mdx
| Flag | What it does |
|---|---|
| `-X N` | Stop when N leaves remain |
```

## Images

Put the image in `src/content/images/`, import it at the top of the post (below the
frontmatter), then place it where you want it:

```mdx
import myTree from "../images/my-tree.webp";

<figure>
  <img src={myTree} alt="Describe what the image shows, for screen readers." />
  <figcaption>Caption under the image.</figcaption>
</figure>
```

Figures automatically use the wider layout on big screens. Use `.webp` or `.png`, and
file names without spaces.

## Things that trip MDX up

- Curly braces `{ }` in normal text are read as code. Put them inside backticks or
  maths, or write `\{` and `\}`.
- A `<` in normal text can be read as the start of a tag. Write "less than", or put it
  in backticks.
- An `import` line must sit right after the frontmatter, with a blank line around it.
- If the page goes blank or shows an error in `bun run dev`, the terminal says which
  line of the `.mdx` file is wrong.

## Post components

These live in `src/components/blog/` and are only used where a post imports them:

- `TreemmerAnimation`: the step-by-step pruning animation.
- `RtlDecayChart`: the MTB versus influenza decay chart. Its data is in
  `rtl-decay-data.ts`.

## Where the site text lives

- Home page: `src/routes/index.tsx`
- About page: `src/routes/about.tsx`
- Header and footer: `src/components/site-header.tsx`, `src/components/site-footer.tsx`
- Fonts, colours and post styling (including the reading width, `--measure`):
  `src/styles.css`
