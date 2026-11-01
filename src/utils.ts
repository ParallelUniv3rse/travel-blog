import { type CollectionEntry, getCollection } from 'astro:content';

/** Prefix an internal path with the site base (needed for GitHub Pages project sites). */
export function withBase(path: string): string {
	const base = import.meta.env.BASE_URL.replace(/\/$/, '');
	return `${base}/${path.replace(/^\//, '')}`;
}

export function postUrl(post: CollectionEntry<'blog'>): string {
	return withBase(`/blog/${post.id}/`);
}

/** All posts, newest first. */
export async function getPosts(): Promise<CollectionEntry<'blog'>[]> {
	const posts = await getCollection('blog');
	return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
