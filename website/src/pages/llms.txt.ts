import type { APIRoute } from 'astro';
import { absoluteUrl, loadIndex, rawUrl } from '../lib/docs-index.mjs';
import { activitySystemDoc } from '../lib/activity/spec.mjs';
import { encodeActivityUrl } from '../lib/activity/codec.mjs';

export const prerender = true;

const ACTIVITY_EXAMPLE = {
	v: 1,
	t: 'Exemple compact',
	d: [
		{ i: 'r', k: 'mc', q: 'La RAM est-elle volatile ?', o: ['Oui', 'Non'], a: 0, e: 'Elle perd son contenu sans courant.' },
		{ i: 't', k: 'text', q: 'Résoudre $2x + 4 = 10$.', a: ['3', 'x = 3'] },
	],
};

export const GET: APIRoute = async () => {
	const { kinds } = await loadIndex();

	const lines = [
		'# Mes cours',
		'',
		"> Notes de cours du BUT Informatique (première année, R1), organisées par matière. Chaque lien pointe vers la version Markdown brut de la note ; sa page HTML s'obtient en retirant le suffixe `.md`.",
		'',
	];

	for (const kind of kinds) {
		if (kind.courses.size === 0) continue;
		lines.push(`## ${kind.label}`, '');
		for (const [course, notes] of kind.courses) {
			lines.push(`### ${course}`, '');
			for (const note of notes) {
				lines.push(`- [${note.title}](${rawUrl(note.id)})`);
			}
			lines.push('');
		}
	}

	lines.push(
		'## Ressources',
		'',
		`- [Version intégrale en Markdown](${absoluteUrl('llms-full.txt')}): toutes les notes dans un seul fichier.`,
		`- [Plan du site (XML)](${absoluteUrl('sitemap-index.xml')}): liste des URL du site.`,
		'',
	);

	const exampleUrl = encodeActivityUrl(ACTIVITY_EXAMPLE, absoluteUrl(''));
	const exampleJson = JSON.stringify(ACTIVITY_EXAMPLE, null, 2);
	const indexUrl = absoluteUrl('activity-index.json');
	const activityDoc = activitySystemDoc({ base: absoluteUrl(''), exampleUrl, exampleJson, indexUrl });

	lines.push(activityDoc.trimStart().trimEnd(), '');

	return new Response(lines.join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
