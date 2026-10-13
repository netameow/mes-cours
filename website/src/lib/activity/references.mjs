// Résolution des références `r` des activités vers de vraies URL du site.
//
// Formats acceptés (voir aussi `llms.txt`) :
//   - « R1.03 »                          → page principale du cours.
//   - « R1.03#mémoire-centrale »         → ancré sur la 1re page du cours
//                                          contenant cette ancre.
//   - « cours/r1-03-…/4-la-memoire-et-le-cache »                          → page.
//   - « cours/r1-03-…/4-la-memoire-et-le-cache#4-mémoire-adressable--principe » → ancre.
//   - variantes avec `./`, `/`, sans `cours/`, espaces supplémentaires.
//
// Les ancres sont comparées en ignorant accents, casse et ponctuation
// (« memoire-centrale » == « mémoire-centrale »).
//
// Une référence inconnue n'est jamais transformée en chemin de fichier ou en
// requête arbitraire : elle est simplement signalée comme introuvable et
// l'interface n'affiche alors qu'un libellé non cliquable.

import { normalizeKey } from './keys.mjs';

function splitAnchor(ref) {
	const hashIndex = ref.lastIndexOf('#');
	if (hashIndex === -1) return { path: ref, anchor: null };
	return { path: ref.slice(0, hashIndex), anchor: ref.slice(hashIndex + 1) };
}

function cleanPath(path) {
	return String(path)
		.replace(/\\/g, '/')
		.replace(/^\.\//, '')
		.replace(/^\/+/, '')
		.replace(/\/+$/, '');
}

function pageUrl(base, id, anchor) {
	const url = `${base}${id}/`;
	return anchor ? `${url}#${anchor}` : url;
}

/**
 * Résout une référence vers une URL du site.
 * @param {string} ref
 * @param {{ base: string, courses: Array }} index
 * @returns {{ ok: boolean, url?: string, label?: string, page?: string, course?: string, note?: string }}
 */
export function resolveReference(ref, index) {
	if (typeof ref !== 'string') return { ok: false, note: 'Référence vide.' };
	const { path, anchor } = splitAnchor(ref.trim());
	const pathClean = cleanPath(path);
	if (pathClean === '') return { ok: false, note: 'Référence vide.' };

	const page = findPage(index, pathClean);
	if (page) {
		if (anchor) {
			const found = findAnchor(page, anchor);
			if (found) {
				return {
					ok: true,
					url: pageUrl(index.base, page.id, found.slug),
					label: displayLabel(page, found.slug),
					page: page.id,
				};
			}
			return {
				ok: page !== null,
				url: pageUrl(index.base, page.id),
				label: displayLabel(page, null),
				page: page.id,
				note: `Ancre « ${anchor} » absente de cette page.`,
			};
		}
		return { ok: true, url: pageUrl(index.base, page.id), label: displayLabel(page, null), page: page.id };
	}

	const course = findCourse(index, pathClean);
	if (course) {
		if (anchor) {
			// Ancre de cours : première page du cours contenant cette ancre.
			for (const candidate of course.pages) {
				const found = findAnchor(candidate, anchor);
				if (found) {
					return {
						ok: true,
						url: pageUrl(index.base, candidate.id, found.slug),
						label: displayLabel(candidate, found.slug),
						page: candidate.id,
					};
				}
			}
			const main = mainPage(course);
			return {
				ok: true,
				url: pageUrl(index.base, main.id),
				label: displayLabel(main, null),
				page: main.id,
				note: `Aucune page du cours ne contient l'ancre « ${anchor} ».`,
			};
		}
		const main = mainPage(course);
		return { ok: true, url: pageUrl(index.base, main.id), label: main.title, page: main.id };
	}

	return { ok: false, note: `Référence « ${ref.trim()} » introuvable.` };
}

/** Cherche une ancre par slug (toutes orthographes autorisées). */
function findAnchor(page, anchor) {
	return page.anchors.find((entry) => {
		const slug = entry.slug ?? entry;
		return normalizeKey(slug) === normalizeKey(anchor);
	});
}

function displayLabel(page, anchorSlug) {
	const baseLabel = page.title;
	return anchorSlug ? `${baseLabel} · ${anchorSlug}` : baseLabel;
}

function findPage(index, cleanPath) {
	const key = normalizeKey(cleanPath);
	const bare = cleanPath.replace(/^cours\//, '').replace(/^annexes\//, '');
	const bareKey = normalizeKey(bare);
	for (const course of index.courses) {
		for (const page of course.pages) {
			if (normalizeKey(page.id) === key || normalizeKey(page.id) === bareKey) return page;
		}
	}
	return null;
}

function findCourse(index, cleanPath) {
	const key = normalizeKey(cleanPath);
	const matches = [];
	for (const course of index.courses) {
		if (normalizeKey(course.code) === key) {
			matches.push(course);
			continue;
		}
		if (normalizeKey(course.path) === key || normalizeKey(course.path).startsWith(key)) {
			matches.push(course);
			continue;
		}
		if (normalizeKey(course.label) === key) matches.push(course);
	}
	if (matches.length === 0) return null;
	// Un code de cours peut exister à la fois dans « cours » et « annexes » :
	// on privilégie systématiquement les cours.
	return matches.find((course) => course.kind === 'cours') ?? matches[0];
}

function mainPage(course) {
	// La « page principale » est celle dont le slug de note égale le slug de cours.
	for (const page of course.pages) {
		const parts = page.id.split('/');
		if (parts.length >= 2 && normalizeKey(parts[parts.length - 1]) === normalizeKey(course.path.split('/').pop())) {
			return page;
		}
	}
	return course.pages[0];
}

/** Résout toutes les références d'un élément. */
export function resolveReferences(refs, index) {
	const resolved = (refs ?? []).map((ref) => ({ ref, ...resolveReference(ref, index) }));
	return {
		links: resolved.filter((r) => r.ok),
		missing: resolved.filter((r) => !r.ok),
		total: resolved.length,
	};
}