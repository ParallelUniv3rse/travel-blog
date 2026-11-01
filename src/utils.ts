import { type CollectionEntry, getCollection } from 'astro:content';

/** Prefix an internal path with the site base (needed for GitHub Pages project sites). */
export function withBase(path: string): string {
	const base = import.meta.env.BASE_URL.replace(/\/$/, '');
	return `${base}/${path.replace(/^\//, '')}`;
}

export function postUrl(post: CollectionEntry<'blog'>): string {
	return withBase(`/blog/${post.id}/`);
}

export function tagUrl(tag: string): string {
	return withBase(`/tags/${slugifyTag(tag)}/`);
}

export function slugifyTag(tag: string): string {
	return tag
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

/** Published posts, newest first. Drafts are shown only in `astro dev`. */
export async function getPosts(): Promise<CollectionEntry<'blog'>[]> {
	const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
	return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
