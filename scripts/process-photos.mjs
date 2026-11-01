#!/usr/bin/env node
// Prepare photos for a post: auto-rotate, resize to max 2000 px on the long
// side, re-encode as JPEG ~80% quality, and strip ALL metadata (EXIF, GPS, XMP).
//
// Usage: node scripts/process-photos.mjs <post-slug> <photo> [photo...]
// Output: src/assets/posts/<post-slug>/<name>.jpg

import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const MAX_SIDE = 2000;
const TARGET_BYTES = 500 * 1024;

const [slug, ...inputs] = process.argv.slice(2);
if (!slug || inputs.length === 0) {
	console.error('Usage: node scripts/process-photos.mjs <post-slug> <photo> [photo...]');
	process.exit(1);
}

const outDir = path.join('src/assets/posts', slug);
await mkdir(outDir, { recursive: true });

for (const input of inputs) {
	const name = path
		.basename(input, path.extname(input))
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
	const out = path.join(outDir, `${name}.jpg`);

	let quality = 80;
	let size;
	do {
		// sharp drops all metadata unless .withMetadata()/.keepExif() is called.
		await sharp(input)
			.rotate()
			.resize(MAX_SIDE, MAX_SIDE, { fit: 'inside', withoutEnlargement: true })
			.jpeg({ quality, mozjpeg: true })
			.toFile(out);
		size = (await stat(out)).size;
		quality -= 5;
	} while (size > TARGET_BYTES && quality >= 60);

	const meta = await sharp(out).metadata();
	if (meta.exif || meta.xmp || meta.iptc) throw new Error(`Metadata left in ${out}`);
	console.log(`${out}  ${meta.width}x${meta.height}  ${Math.round(size / 1024)} KB  q${quality + 5}`);
}
