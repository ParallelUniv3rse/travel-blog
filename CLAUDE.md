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
- Posts: `src/content/blog/YYYY-MM-DD-slug.md` (always `.md`; galleries work in plain Markdown).
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
  0. **Consider every photo the owner sends.** Inline images in the message and
     attached files (e.g. HEIC in the uploads folder) are DIFFERENT files,
     never duplicates: 5 inline + 5 HEIC = 10 photos. Before writing, list
     every file received with a one-line description and the total count.
     Use all of them except near-identical shots: of those, keep the best
     one and say which were left out. Straighten tilted horizons/verticals
     and lightly reframe (crop empty sky, stray edges) so photos look nice;
     crop the converted JPEG before running the script.
     Files of ~135 bytes are iCloud placeholders, not photos: report them.
     HEIC: ImageMagick here can't decode them; convert with Python
     `pillow-heif` in a scratchpad venv, then run the script on the JPEGs.
  1. Process every photo: `node scripts/process-photos.mjs <slug> <files...>`
     (auto-rotate, max 2000 px long side, JPEG ~80%, <500 KB target,
     strips ALL metadata incl. GPS; fails if metadata remains).
     Never commit unprocessed originals.
  2. Standalone image (own paragraph, blank lines around it):
     `![alt text](../../assets/posts/<slug>/name.jpg)`. Tall shots are capped
     at 70vh. Use for key photos that a paragraph is about.
  3. Gallery: put image lines directly one under another (no blank line
     between them, plain `.md`). That paragraph becomes a thumbnail grid
     (3 columns; 2 for 2 or 4 photos). With 5/8 photos the first spans
     2 columns, with 7/10 the full row, so put a landscape photo first.
     Use galleries for runs of supporting photos so text isn't buried;
     keep runs of more than ~2 standalone images out. Every post photo opens
     large in a lightbox on tap (`BlogPost.astro`). Videos stay standalone.
  4. Every image needs meaningful alt text.
  5. Video: HEIC needs conversion to JPEG first (sharp can't decode it).
     Re-encode with ffmpeg to 720 px wide H.264, no audio unless needed, `-crf 33`,
     `-map_metadata -1 -movflags +faststart`; save to `public/posts/<slug>/name.mp4`
     plus a poster frame `name.jpg`, then embed in Markdown:
     `<video controls muted playsinline preload="none" width=… height=… poster="/posts/<slug>/name.jpg" aria-label="…"><source src="/posts/<slug>/name.mp4" type="video/mp4" /></video>`
  Astro generates responsive WebP sizes at build time (`image.layout: 'constrained'`,
  WebP quality 70). Markdown images get `width: 720` and a matching `sizes` from the
  `postImageSizes` plugin in `astro.config.mjs`, so phones load ~1080 px files
  (gallery thumbnails get a ~240 px `sizes`).

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
