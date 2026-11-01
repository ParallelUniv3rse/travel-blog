// @ts-check

import mdx from '@astrojs/mdx';
import { defineConfig, fontProviders } from 'astro/config';

// GitHub Pages project site. When a custom domain is added:
// set `site` to the domain, set `base` to '/', and add public/CNAME.
export default defineConfig({
	site: 'https://paralleluniv3rse.github.io',
	base: '/travel-blog',
	integrations: [mdx()],
	image: {
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
