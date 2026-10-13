import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

export const getStaticPaths: GetStaticPaths = async () => {
	const docs = await getCollection('docs');
	return docs.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
};

export const GET: APIRoute = ({ props }) => {
	const { entry } = props;
	const body = entry.body ?? '';

	return new Response(body, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
		},
	});
};
