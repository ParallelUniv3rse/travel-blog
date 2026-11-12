// @ts-check

import { satteri } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';
import { defineConfig, fontProviders } from 'astro/config';

// Post photos in Markdown: tell the browser their real display width (the
// 720 px text column, full width minus margins on phones), so phones pick a
// smaller file from the srcset instead of one sized for the whole screen.
//
// Galleries: images written on consecutive lines (one paragraph, no blank line
// between them) become a thumbnail grid, `<p class="gallery gallery-N">`.
// An image in its own paragraph stays a standalone photo. Gallery images get
// a small `sizes` so phones load thumbnails; the lightbox in BlogPost.astro
// picks a large file from the same srcset.
const isImg = (c) => c.type === 'element' && c.tagName === 'img';
const galleryImages = new Set();
const postImageSizes = {
	name: 'post-image-sizes',
	element: {
		filter: ['p', 'img'],
		visit(node, ctx) {
			if (node.tagName === 'p') {
				const imgs = node.children.filter(isImg);
				const onlyImgs = node.children.every(
					(c) => isImg(c) || (c.type === 'text' && !c.value.trim()),
				);
				if (imgs.length < 2 || !onlyImgs) return;
				ctx.setProperty(node, 'className', ['gallery', `gallery-${imgs.length}`]);
				for (const img of imgs) galleryImages.add(img.properties.src);
				return;
			}
			if (node.properties?.width) return;
			ctx.setProperty(node, 'width', 720);
			ctx.setProperty(
				node,
				'sizes',
				galleryImages.has(node.properties.src)
					? '(min-width: 760px) 240px, 33vw'
					: '(min-width: 760px) 720px, calc(100vw - 36px)',
			);
		},
	},
};

// GitHub Pages with custom domain (public/CNAME).
export default defineConfig({
	site: 'https://blog.arnostneurad.com',
	base: '/',
	integrations: [mdx()],
	markdown: {
		processor: satteri({ hastPlugins: [postImageSizes] }),
	},
	image: {
		// WebP quality 70 instead of the default 80: ~25 % smaller, same look on screen.
		service: { config: { webp: { quality: 70 } } },
		// Responsive srcset/sizes for all images, including those in Markdown.
		layout: 'constrained',
		responsiveStyles: true,
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
