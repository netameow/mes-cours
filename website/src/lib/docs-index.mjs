import { getCollection } from 'astro:content';
import { titleForFile } from './vault.mjs';

const BASE = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const SITE = import.meta.env.SITE;

export function absoluteUrl(path) {
	return new URL(`${BASE}${path}`, SITE).href;
}

export function pageUrl(id) {
	return absoluteUrl(`${id}/`);
}

export function rawUrl(id) {
	return absoluteUrl(`${id}.md`);
}

const KINDS = [
	{ key: 'cours', label: 'Cours' },
	{ key: 'annexes', label: 'Annexes' },
];

export async function loadIndex() {
	const entries = await getCollection('docs');
	const collator = new Intl.Collator('fr', { numeric: true, sensitivity: 'base' });

	const kinds = KINDS.map((kind) => ({ ...kind, courses: new Map() }));
	const kindByKey = new Map(kinds.map((kind) => [kind.key, kind]));

	const sorted = [...entries].sort((a, b) => collator.compare(a.filePath ?? a.id, b.filePath ?? b.id));

	for (const entry of sorted) {
		const [kindKey] = entry.id.split('/');
		const kind = kindByKey.get(kindKey);
		if (!kind) continue;

		const courseLabel = courseLabelFor(entry);
		if (!kind.courses.has(courseLabel)) kind.courses.set(courseLabel, []);
		kind.courses.get(courseLabel).push({
			id: entry.id,
			title: entry.data.title || titleForFile(entry.filePath ?? entry.id),
			entry,
		});
	}

	return { kinds };
}

function courseLabelFor(entry) {
	const parts = (entry.filePath ?? entry.id).replace(/\\/g, '/').split('/');
	return parts.find((part) => /^R1\./i.test(part)) ?? parts[0];
}
