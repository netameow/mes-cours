// Index des cours et des ancres, construit au build à partir de la
// collection de contenu. Il permet de résoudre les références `r` des
// activités vers de vraies URL du site.
//
// Les ancres des titres sont générées par le processeur Markdown du site
// (« satteri », qui utilise `github-slugger`) : minuscules, accents
// conservés, ponctuation supprimée, espaces → tirets.
// Ex. : « Mémoire centrale » → `#mémoire-centrale`.
//
// L'index est aussi exposé sur l'URL `activity-index.json` et tronqué puis
// embarqué dans la page `/test` pour résoudre les références sans réseau.

import { getCollection } from 'astro:content';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import GithubSlugger from 'github-slugger';
import { titleForFile } from '../vault.mjs';
import { normalizeKey } from './keys.mjs';

export { normalizeKey };

const COURSE_CODE = /^(R\s*1\s*\.\s*(\d+))/i;

function courseCodeFromLabel(label) {
	const match = COURSE_CODE.exec(label);
	if (!match) return null;
	return `R1.${match[2]}`;
}

async function collectHeadings(body) {
	const tree = unified().use(remarkParse).parse(body ?? '');
	const slugger = new GithubSlugger();
	const headings = [];
	collect(tree, slugger, headings);
	return headings;
}

function collect(node, slugger, out) {
	if (node.type === 'heading') {
		const text = headingText(node);
		out.push({ slug: slugger.slug(text), text });
		return;
	}
	for (const child of node.children ?? []) collect(child, slugger, out);
}

function headingText(node) {
	let text = '';
	for (const child of node.children ?? []) {
		if (child.type === 'text' || child.type === 'inlineCode') text += child.value;
		else if (child.type === 'link' || child.type === 'emphasis' || child.type === 'strong') text += headingText(child);
		else if (child.type === 'mdxTextExpression' && typeof child.value === 'string') text += child.value;
	}
	return text;
}

/** Construit l'index des cours + ancres. */
export async function buildActivityIndex() {
	const entries = await getCollection('docs');
	const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

	const courses = new Map();

	for (const entry of entries) {
		const [kind, coursePath, ...rest] = entry.id.split('/');
		if (kind !== 'cours' && kind !== 'annexes') continue;

		const label = courseLabelFor(entry);
		const code = courseCodeFromLabel(label) ?? coursePath;
		const courseKey = `${kind}:${code}`;

		let course = courses.get(courseKey);
		if (!course) {
			course = { code, path: `${kind}/${coursePath}`, label, kind, pages: [] };
			courses.set(courseKey, course);
		}

		const anchors = await collectHeadings(entry.body ?? '');
		course.pages.push({
			id: entry.id,
			title: entry.data.title || titleForFile(entry.filePath ?? entry.id),
			anchors,
		});
	}

	const sorted = [...courses.values()].sort((a, b) => a.label.localeCompare(b.label, 'fr', { numeric: true }));

	return { base, courses: sorted };
}

function courseLabelFor(entry) {
	const parts = (entry.filePath ?? entry.id).replace(/\\/g, '/').split('/');
	return parts.find((part) => /^R1\./i.test(part)) ?? parts[0];
}
