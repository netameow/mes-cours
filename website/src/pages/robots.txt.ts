import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib/docs-index.mjs';

export const prerender = true;

export const GET: APIRoute = () => {
	const body = [
		'User-agent: *',
		'Allow: /',
		'',
		`# Index lisible par les agents et les IA : ${absoluteUrl('llms.txt')}`,
		`Sitemap: ${absoluteUrl('sitemap-index.xml')}`,
		'',
	].join('\n');

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
