// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeShiki from "@shikijs/rehype";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      {
        enforce: "pre",
        ...mdx({
          remarkPlugins: [
            remarkFrontmatter,
            [remarkMdxFrontmatter, { name: "frontmatter" }],
            remarkGfm,
            remarkMath,
          ],
          rehypePlugins: [
            [
              rehypeShiki,
              {
                themes: { light: "github-light", dark: "github-dark-dimmed" },
                defaultColor: false,
              },
            ],
            rehypeKatex,
          ],
          providerImportSource: "@mdx-js/react",
        }),
      },
    ],
  },
});
