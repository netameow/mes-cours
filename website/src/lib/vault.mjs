import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const VAULT_ROOT = fileURLToPath(new URL('../../../', import.meta.url));

export const SIDEBAR_SYNC_FILE = fileURLToPath(new URL('../../.vault-sidebar-sync', import.meta.url));

export function vaultSignature() {
	return listVaultFiles().join('\n');
}

export function writeSidebarSignature(signature) {
	if (!existsSync(SIDEBAR_SYNC_FILE)) return false;
	try {
		if (readFileSync(SIDEBAR_SYNC_FILE, 'utf8') === signature) return false;
		writeFileSync(SIDEBAR_SYNC_FILE, signature);
		return true;
	} catch {
		return false;
	}
}

const COURSE_DIR = /^R1\./i;
const ANNEX_DIR = /^annexe/i;
const MARKDOWN_EXT = /\.(md|mdx|markdown|mdown|mkdn|mkd|mdwn)$/i;

const fileCollator = new Intl.Collator('fr', { numeric: true, sensitivity: 'base' });

export function slugify(value) {
	return String(value)
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function idForFile(relativePath) {
	const parts = relativePath.replace(/\\/g, '/').split('/');
	parts[parts.length - 1] = parts[parts.length - 1].replace(MARKDOWN_EXT, '');
	const fileName = parts.pop() ?? '';
	const isAnnex = parts.length > 1 && parts.slice(1).some((part) => ANNEX_DIR.test(part));
	const course = slugify(parts[0] ?? '');
	const rest = parts
		.slice(1)
		.filter((part) => !ANNEX_DIR.test(part))
		.map(slugify)
		.filter(Boolean);
	return [isAnnex ? 'annexes' : 'cours', course, ...rest, slugify(fileName)].filter(Boolean).join('/');
}

export function titleForFile(filePathOrRelative) {
	const name = basename(filePathOrRelative.replace(/\\/g, '/'));
	return name.replace(MARKDOWN_EXT, '');
}

export function listVaultFiles() {
	/** @type {string[]} */
	const files = [];
	for (const dirent of readdirSync(VAULT_ROOT, { withFileTypes: true })) {
		if (!dirent.isDirectory() || dirent.name.startsWith('.')) continue;
		if (!COURSE_DIR.test(dirent.name)) continue;
		walk(join(VAULT_ROOT, dirent.name), dirent.name, files);
	}
	return files.sort((a, b) => fileCollator.compare(a, b));
}

function walk(absoluteDir, relativeDir, out) {
	for (const dirent of readdirSync(absoluteDir, { withFileTypes: true })) {
		if (dirent.name.startsWith('.')) continue;
		const absolute = join(absoluteDir, dirent.name);
		const relative = `${relativeDir}/${dirent.name}`;
		if (dirent.isDirectory()) walk(absolute, relative, out);
		else if (dirent.isFile() && !dirent.name.startsWith('_') && MARKDOWN_EXT.test(dirent.name)) out.push(relative);
	}
}

export function buildSidebar() {
	/** @type {Map<string, { rel: string, id: string, title: string }[]>} */
	const entries = new Map();
	for (const rel of listVaultFiles()) {
		const id = idForFile(rel);
		const [kind] = id.split('/');
		if (!entries.has(kind)) entries.set(kind, []);
		entries.get(kind).push({ rel, id, title: titleForFile(rel) });
	}

	return [
		{ label: 'Accueil', link: '/' },
		{ label: 'Cours', items: sectionItems(entries.get('cours') ?? []) },
		{ label: 'Annexes', items: sectionItems(entries.get('annexes') ?? []) },
	];
}

function sectionItems(entries) {
	const courses = new Map();
	for (const entry of entries) {
		const courseSlug = entry.id.split('/')[1];
		const label = entry.rel.split('/')[0];
		if (!courses.has(courseSlug)) courses.set(courseSlug, { label, entries: [] });
		courses.get(courseSlug).entries.push(entry);
	}

	return [...courses.values()]
		.sort((a, b) => fileCollator.compare(a.label, b.label))
		.map((course) => ({
			label: course.label,
			items: courseNodes(course.entries),
		}));
}

function courseNodes(entries) {
	/** @type {Map<string, typeof entries>} */
	const dirs = new Map();
	/** @type {typeof entries} */
	const pages = [];
	/** @type {Map<string, string>} */
	const dirLabels = new Map();

	for (const entry of entries) {
		const rest = entry.rel.split('/').slice(1);
		if (rest.length === 1) {
			pages.push(entry);
			continue;
		}
		const dir = rest[0];
		if (!dirs.has(dir)) {
			dirs.set(dir, []);
			dirLabels.set(dir, dir);
		}
		dirs.get(dir).push(entry);
	}

	/** @type {{ sort: string, node: object }[]} */
	const nodes = [];
	for (const [dir, list] of dirs) {
		nodes.push({
			sort: dirLabels.get(dir) ?? dir,
			node: { label: dirLabels.get(dir) ?? dir, items: list.map(pageLink) },
		});
	}
	for (const entry of pages) {
		nodes.push({ sort: entry.title, node: pageLink(entry) });
	}
	nodes.sort((a, b) => fileCollator.compare(a.sort, b.sort));
	return nodes.map((node) => node.node);
}

/**
 * @param {{ id: string, title: string }} entry
 */
function pageLink(entry) {
	return { label: entry.title, link: `/${entry.id}/` };
}
