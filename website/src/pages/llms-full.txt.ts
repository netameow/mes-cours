import type { APIRoute } from 'astro';
import { loadIndex, pageUrl } from '../lib/docs-index.mjs';

export const prerender = true;

export const GET: APIRoute = async () => {
	const { kinds } = await loadIndex();

	const parts = [
		'# Mes cours',
		'',
		'> Notes de cours du BUT Informatique (première année, R1). Chaque note est précédée de son titre et de son URL source.',
	];

	for (const kind of kinds) {
		for (const notes of kind.courses.values()) {
			for (const note of notes) {
				const body = (note.entry.body ?? '').trim();
				parts.push('', '---', '', `# ${note.title}`, '', `Source : ${pageUrl(note.id)}`, '', body);
			}
		}
	}

	parts.push('');

	return new Response(parts.join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
