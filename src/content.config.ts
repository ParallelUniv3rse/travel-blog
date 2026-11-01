import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Files are named YYYY-MM-DD-slug.md(x); the URL uses only the slug part.
	loader: glob({
		base: './src/content/blog',
		pattern: '**/*.{md,mdx}',
		generateId: ({ entry }) => entry.replace(/\.mdx?$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, ''),
	}),
	schema: ({ image }) =>
		z
			.object({
				title: z.string(),
				date: z.coerce.date(),
				description: z.string(),
				updated: z.coerce.date().optional(),
				cover: image().optional(),
				coverAlt: z.string().optional(),
				tags: z.array(z.string()).default([]),
				draft: z.boolean().default(false),
			})
			.refine((d) => !d.cover || !!d.coverAlt, {
				message: 'coverAlt is required when cover is set',
				path: ['coverAlt'],
			}),
});

export const collections = { blog };
