// Résolution des liens wiki Obsidian (`[[Cible]]` / `[[Cible|Libellé]]`).
//
// Les notes de la voûte utilisent la syntaxe de liens internes d'Obsidian :
//   - `[[4 – La mémoire et le cache]]`                → lien vers la page du même nom ;
//   - `[[Cours/Note|Libellé affiché]]`                → lien vers la page, libellé imposé ;
//   - `[[Note#Titre de section]]`                     → lien vers la page, ancré sur la
//                                                       section (identifiant Starlight).
//
// La cible est rapprochée des fichiers de la voûte en ignorant accents, casse et
// ponctuation. En cas d'homonymes (plusieurs cours ont une note du même nom),
// la note du cours courant est privilégiée ; si l'ambiguïté persiste, le lien
// n'est pas transformé et le texte d'origine est conservé.
//
// Les URL produites incluent la base du site (`base` en configuration) : Astro
// ne préfixe pas les liens Markdown par la base, ce lien doit donc le faire.

import { fileURLToPath } from 'node:url';
import GithubSlugger from 'github-slugger';
import { VAULT_ROOT, idForFile, listVaultFiles, slugify } from './vault.mjs';

/** Construit l'index nom → fichier de la voûte (une seule fois). */
function buildIndex() {
	const byPath = new Map();
	/** @type {Map<string, { id: string, course: string }[]>} */
	const byName = new Map();

	for (const rel of listVaultFiles()) {
		const relativeWithoutExt = rel.replace(/\.[^./]+$/, '');
		const parts = relativeWithoutExt.split('/');
		const name = parts[parts.length - 1] ?? '';
		const entry = {
			id: idForFile(rel),
			course: slugify(parts[0] ?? ''),
		};
		byPath.set(slugify(relativeWithoutExt), entry);
		const bucket = byName.get(slugify(name)) ?? [];
		bucket.push(entry);
		byName.set(slugify(name), bucket);
	}

	return { byPath, byName };
}

/** Cours auquel appartient le fichier en cours de rendu (ou `undefined`). */
function courseFromFileURL(fileURL) {
	if (!fileURL) return undefined;
	let path;
	try {
		path = fileURLToPath(fileURL);
	} catch {
		return undefined;
	}
	const normalized = path.replace(/\\/g, '/');
	const root = VAULT_ROOT.replace(/\\/g, '/').replace(/\/$/, '');
	if (!normalized.startsWith(`${root}/`)) return undefined;
	return slugify(normalized.slice(root.length + 1).split('/')[0] ?? '');
}

/** Cherche la note visée par une cible brute. */
function findEntry(index, target, currentCourse) {
	const clean = target
		.replace(/\\/g, '/')
		.replace(/^\.\//, '')
		.replace(/^\/+/, '')
		.replace(/\/+$/, '');
	if (clean === '') return null;

	const byPath = index.byPath.get(slugify(clean));
	if (byPath) return byPath;

	const candidates = index.byName.get(slugify(clean.split('/').pop() ?? ''));
	if (!candidates || candidates.length === 0) return null;
	if (candidates.length === 1) return candidates[0];
	return candidates.find((candidate) => candidate.course === currentCourse) ?? null;
}

/** Transforme le contenu interne d'un `[[…]]` en nœud de lien mdast, ou `null`. */
function buildLink(inner, index, prefix, currentCourse) {
	const pipeIndex = inner.indexOf('|');
	const targetWithAnchor = pipeIndex === -1 ? inner : inner.slice(0, pipeIndex);
	const alias = pipeIndex === -1 ? '' : inner.slice(pipeIndex + 1);

	const hashIndex = targetWithAnchor.indexOf('#');
	const target = (hashIndex === -1 ? targetWithAnchor : targetWithAnchor.slice(0, hashIndex)).trim();
	const anchor = hashIndex === -1 ? '' : targetWithAnchor.slice(hashIndex + 1).trim();
	if (target === '') return null;

	const entry = findEntry(index, target, currentCourse);
	if (!entry) return null;

	const label = alias.trim() !== '' ? alias.trim() : (target.split('/').pop() ?? target).trim();
	let url = `${prefix}/${entry.id}/`;
	if (anchor !== '') {
		const slug = new GithubSlugger().slug(anchor);
		if (slug !== '') url += `#${slug}`;
	}

	return { type: 'link', url, title: null, children: [{ type: 'text', value: label }] };
}

/**
 * Plugin mdast qui remplace les liens wiki `[[…]]` des notes par de vrais
 * liens vers les pages du site.
 * @param {{ base?: string }} [options]
 */
export function wikiLinks({ base = '/' } = {}) {
	const prefix = base === '/' ? '' : base.replace(/\/+$/, '');
	const index = buildIndex();

	return {
		name: 'wiki-links',
		text(node, ctx) {
			const value = node.value;
			if (typeof value !== 'string' || !value.includes('[[')) return undefined;

			const currentCourse = courseFromFileURL(ctx.fileURL);
			const parts = [];
			let lastIndex = 0;
			let replaced = false;

			for (const match of value.matchAll(/\[\[([^[\]\n]+?)\]\]/g)) {
				const start = match.index;
				if (start > lastIndex) parts.push({ type: 'text', value: value.slice(lastIndex, start) });

				const link = buildLink(match[1], index, prefix, currentCourse);
				if (link) {
					parts.push(link);
					replaced = true;
				} else {
					parts.push({ type: 'text', value: match[0] });
				}
				lastIndex = start + match[0].length;
			}

			if (!replaced) return undefined;
			if (lastIndex < value.length) parts.push({ type: 'text', value: value.slice(lastIndex) });

			ctx.replaceNode(node, parts);
			return undefined;
		},
	};
}
