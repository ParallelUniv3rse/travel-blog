# Personal blog: working guide for Claude

Low-maintenance blog with updates from a 14-day vacation (the owner and their
girlfriend), shared by link with family and close friends. The owner never
edits files by hand; all writing, editing and publishing happens by asking
Claude. Keep it minimal: only what is needed for that.

## Stack
- Astro (official blog starter), static output.
- GitHub Pages, deployed by `.github/workflows/deploy.yml` on every push to `main`.
- Language: Czech. Write posts, titles, descriptions, alt text and UI
  text in Czech (`<html lang="cs">`, dates formatted `cs-CZ`).
- Site: https://blog.arnostneurad.com/ (custom domain: `site` + `base: '/'` in
  `astro.config.mjs`, `public/CNAME`).
- Internal links must go through `withBase()` / `postUrl()` in `src/utils.ts`.

## Content
- Posts: `src/content/blog/YYYY-MM-DD-slug.md` (`.mdx` only when a gallery is needed).
  URL is `/blog/<slug>/` (date prefix stripped).
- Frontmatter (validated in `src/content.config.ts`):
  ```yaml
  title: 'Post title'
  date: 2026-11-01
  description: 'One-sentence summary (used in post list and meta tags).'
  cover: '../../assets/posts/<slug>/cover.jpg'   # optional
  coverAlt: 'Describe the cover'                  # required if cover is set
  ```
- Images: `src/assets/posts/<slug>/`.
- Pages: homepage = post list, plus one page per post. No navigation menu,
  About page, RSS, tags, drafts or sitemap.
- Site title/description/author: `src/consts.ts`.

## Workflows
- **New post:** write from the owner's topic/notes in their voice, build,
  preview, commit, push.
- **Edit:** locate the post (grep titles/content), change it, build, commit, push.
- **Photos:**
  0. **Use every photo the owner sends.** Inline images in the message and
     attached files (e.g. HEIC in the uploads folder) are DIFFERENT photos,
     never duplicates: 5 inline + 5 HEIC = 10 photos. Before writing, list
     every file received with a one-line description and the total count.
     HEIC: ImageMagick here can't decode them; convert with Python
     `pillow-heif` in a scratchpad venv, then run the script on the JPEGs.
  1. Process every photo: `node scripts/process-photos.mjs <slug> <files...>`
     (auto-rotate, max 2000 px long side, JPEG ~80%, <500 KB target,
     strips ALL metadata incl. GPS; fails if metadata remains).
     Never commit unprocessed originals.
  2. Inline image in Markdown: `![alt text](../../assets/posts/<slug>/name.jpg)`
  3. Gallery: use `.mdx` and the `Gallery` component:
     ```mdx
     import Gallery from '../../components/Gallery.astro';
     import a from '../../assets/posts/<slug>/a.jpg';
     <Gallery images={[{ src: a, alt: '...', caption: '...' }]} />
     ```
  4. Every image needs meaningful alt text.
  5. Video: HEIC needs conversion to JPEG first (sharp can't decode it).
     Re-encode with ffmpeg to 720 px wide H.264, no audio unless needed, `-crf 33`,
     `-map_metadata -1 -movflags +faststart`; save to `public/posts/<slug>/name.mp4`
     plus a poster frame `name.jpg`, then embed in Markdown:
     `<video controls muted playsinline preload="none" width=… height=… poster="/posts/<slug>/name.jpg" aria-label="…"><source src="/posts/<slug>/name.mp4" type="video/mp4" /></video>`
  Astro generates responsive WebP sizes at build time (`image.layout: 'constrained'`,
  WebP quality 70). Markdown images get `width: 720` and a matching `sizes` from the
  `postImageSizes` plugin in `astro.config.mjs`, so phones load ~1080 px files.

## Rules
- Run `npm run build` before every push; never push a broken build.
- Keep design simple, readable, mobile-first.
- Do not add dependencies or features unless asked.
- **Ask before deleting any post.**
- Site must stay unlisted: keep the `noindex, nofollow, noarchive` robots meta
  in `BaseHead.astro`; no sitemap.
- Keep the repo well under 1 GB. Check with `du -sh src/assets` when adding
  photos; if it passes ~500 MB, propose moving images to external storage.

## Commits
- Short, concise subject line.
- Body: bullet points, short factual statements.
