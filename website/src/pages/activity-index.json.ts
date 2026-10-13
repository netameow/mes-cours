import type { APIRoute } from 'astro';
import { buildActivityIndex } from '../lib/activity/index.mjs';

export const prerender = true;

/**
 * Index JSON des cours, pages et ancres (`activity-index.json`).
 * Destiné aux LLM et aux outils qui génèrent les références `r` des
 * activités. Structure :
 *   { base, courses: [{ code, path, label, kind, pages: [{ id, title, anchors: [{slug, text}] }] }] }
 */
export const GET: APIRoute = async () => {
	const index = await buildActivityIndex();
	return new Response(JSON.stringify(index), {
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
};