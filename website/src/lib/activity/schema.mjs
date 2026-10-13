// Registre de types d'activités et validation du format versionné.
//
// Format compact (clés courtes) :
//   v : version du format (entier, actuellement 1)
//   t : titre de l'activité (chaîne Markdown courte, facultatif)
//   i : consignes globales (Markdown, facultatif)
//   d : liste ordonnée des éléments de l'activité
//
// Élément :
//   i : identifiant unique (facultatif — généré si absent)
//   k : type d'activité (voir ACTIVITY_TYPES)
//   q : énoncé / contenu principal (Markdown)
//   o : options (selon le type)
//   a : réponse ou données de correction (selon le type)
//   e : explication après validation (Markdown, facultatif)
//   h : indice (Markdown, facultatif, révélé sur demande)
//   r : références vers les cours (liste de chaînes, facultative)

import { LIMITS } from './codec.mjs';

/** Version du format prise en charge par cette implémentation. */
export const SUPPORTED_VERSION = 1;

/**
 * Définit les règles par type d'activité.
 *  - label : libellé court affiché.
 *  - needsOptions : champ `o` requis.
 *  - validateAnswer : (item, problèmes) → void
 */
export const ACTIVITY_TYPES = {
	mc: { label: 'Choix unique' },
	mm: { label: 'Choix multiples' },
	tf: { label: 'Vrai ou faux' },
	fill: { label: 'Texte à compléter' },
	text: { label: 'Réponse libre' },
	match: { label: 'Association' },
	order: { label: 'Mise en ordre' },
	card: { label: 'Flashcard' },
};

export const ACTIVITY_TYPE_NAMES = Object.keys(ACTIVITY_TYPES);

const MAX_FIELD_LENGTH = 10_000;
const MAX_TITLE_LENGTH = 300;

class ValidationIssue {
	constructor(message) {
		this.message = message;
	}
}

function isPlainObject(value) {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isNonEmptyString(value) {
	return typeof value === 'string' && value.trim() !== '';
}

function checkString(item, field, problems, { required = false } = {}) {
	const value = item[field];
	if (value === undefined || value === null) {
		if (required) problems.push(`Élément « ${item?.i ?? '?'} » : le champ « ${field} » est requis.`);
		return value;
	}
	if (typeof value !== 'string') {
		problems.push(`Élément « ${item?.i ?? '?'} » : le champ « ${field} » doit être une chaîne.`);
		return value;
	}
	if (value.length > MAX_FIELD_LENGTH) {
		problems.push(
			`Élément « ${item?.i ?? '?'} » : le champ « ${field} » est trop long (${value.length} caractères, limite ${MAX_FIELD_LENGTH}).`,
		);
	}
	return value;
}

function checkReferenceList(item, problems) {
	const refs = item.r;
	if (refs === undefined || refs === null) return;
	if (!Array.isArray(refs)) {
		problems.push(`Élément « ${item?.i ?? '?'} » : le champ « r » doit être une liste de chaînes.`);
		return;
	}
	if (refs.length > LIMITS.maxReferences) {
		problems.push(
			`Élément « ${item?.i ?? '?'} » : trop de références (${refs.length}, limite ${LIMITS.maxReferences}).`,
		);
	}
	for (const ref of refs) {
		if (typeof ref !== 'string' || ref.trim() === '') {
			problems.push(`Élément « ${item?.i ?? '?'} » : une référence doit être une chaîne non vide.`);
		} else if (ref.length > 400) {
			problems.push(`Élément « ${item?.i ?? '?'} » : référence trop longue.`);
		}
	}
}

function checkOptions(item, problems, { min = 2 } = {}) {
	const options = item.o;
	if (!Array.isArray(options)) {
		problems.push(`Élément « ${item?.i ?? '?'} » : le champ « o » (options) est requis.`);
		return [];
	}
	if (options.length < min) {
		problems.push(`Élément « ${item?.i ?? '?'} » : il faut au moins ${min} options.`);
	}
	if (options.length > LIMITS.maxOptions) {
		problems.push(
			`Élément « ${item?.i ?? '?'} » : trop d'options (${options.length}, limite ${LIMITS.maxOptions}).`,
		);
	}
	options.forEach((option, index) => {
		if (typeof option !== 'string') {
			problems.push(`Élément « ${item?.i ?? '?'} » : l'option ${index + 1} doit être une chaîne.`);
		} else if (option.length > MAX_FIELD_LENGTH) {
			problems.push(`Élément « ${item?.i ?? '?'} » : l'option ${index + 1} est trop longue.`);
		}
	});
	return options;
}

function checkIndex(item, field, index, length, problems) {
	if (typeof index !== 'number' || !Number.isInteger(index) || index < 0 || index >= length) {
		problems.push(
			`Élément « ${item?.i ?? '?'} » : le champ « ${field} » doit être un indice valide (0 à ${length - 1}).`,
		);
	}
}

function validateAnswer(item, kind, problems) {
	const a = item.a;
	switch (kind) {
		case 'mc': {
			const options = Array.isArray(item.o) ? item.o : [];
			if (options.length === 0) return;
			checkIndex(item, 'a', a, options.length, problems);
			break;
		}
		case 'mm': {
			const options = Array.isArray(item.o) ? item.o : [];
			if (options.length === 0) return;
			if (!Array.isArray(a) || a.length === 0) {
				problems.push(`Élément « ${item?.i ?? '?'} » : le champ « a » doit être une liste d'indices non vide.`);
				return;
			}
			const seen = new Set();
			for (const index of a) {
				checkIndex(item, 'a', index, options.length, problems);
				if (seen.has(index)) {
					problems.push(`Élément « ${item?.i ?? '?'} » : indice en double dans « a ».`);
				}
				seen.add(index);
			}
			break;
		}
		case 'tf':
			if (typeof a !== 'boolean') {
				problems.push(`Élément « ${item?.i ?? '?'} » : le champ « a » doit être un booléen (true/false).`);
			}
			break;
		case 'fill': {
			if (!Array.isArray(a) || a.length === 0) {
				problems.push(
					`Élément « ${item?.i ?? '?'} » : le champ « a » doit contenir la liste des réponses acceptées pour chaque trou ([[...],[...]]).`,
				);
				return;
			}
			if (a.length > LIMITS.maxOptions) {
				problems.push(`Élément « ${item?.i ?? '?'} » : trop de trous dans « fill ».`);
			}
			a.forEach((accepted, blankIndex) => {
				if (!Array.isArray(accepted) || accepted.length === 0) {
					problems.push(
						`Élément « ${item?.i ?? '?'} » : chaque trou doit avoir au moins une réponse acceptée (trou ${blankIndex + 1}).`,
					);
					return;
				}
				for (const answer of accepted) {
					if (!isNonEmptyString(answer)) {
						problems.push(
							`Élément « ${item?.i ?? '?'} » : les réponses acceptées du trou ${blankIndex + 1} doivent être des chaînes non vides.`,
						);
					}
				}
			});
			break;
		}
		case 'text': {
			const hasAccepted = Array.isArray(a) && a.length > 0;
			const hasModel = typeof item.m === 'string' && item.m.trim() !== '';
			if (!hasAccepted && !hasModel) {
				problems.push(
					`Élément « ${item?.i ?? '?'} » : une réponse libre doit fournir « a » (réponses acceptées) ou « m » (réponse modèle pour auto-évaluation).`,
				);
				return;
			}
			if (Array.isArray(a)) {
				for (const answer of a) {
					if (!isNonEmptyString(answer)) {
						problems.push(
							`Élément « ${item?.i ?? '?'} » : les réponses acceptées doivent être des chaînes non vides.`,
						);
					}
				}
			} else if (a !== undefined) {
				problems.push(`Élément « ${item?.i ?? '?'} » : le champ « a » doit être une liste de chaînes.`);
			}
			break;
		}
		case 'match': {
			const left = Array.isArray(item.o) ? item.o : [];
			const right = Array.isArray(a) ? a : [];
			if (left.length === 0) return;
			if (right.length !== left.length || right.length === 0) {
				problems.push(
					`Élément « ${item?.i ?? '?'} » : l'association exige autant de colonnes de droite (« a ») que de gauche (« o »).`,
				);
				return;
			}
			for (const rightItem of right) {
				if (typeof rightItem !== 'string') {
					problems.push(`Élément « ${item?.i ?? '?'} » : les éléments de « a » doivent être des chaînes.`);
				}
			}
			break;
		}
		case 'order': {
			if (!Array.isArray(item.o) || item.o.length === 0) return;
			if (a !== undefined && a !== null) {
				problems.push(`Élément « ${item?.i ?? '?'} » : le type « order » n'utilise pas le champ « a » (« o » est l'ordre correct).`);
			}
			break;
		}
		case 'card': {
			if (!isNonEmptyString(a)) {
				problems.push(`Élément « ${item?.i ?? '?'} » : une flashcard doit avoir « a » (verso).`);
			}
			break;
		}
		default:
			break;
	}
}

/**
 * Vérifie la structure d'un objet JSON décompressé (anti profondeur, anti
 * tableaux démesurés) avant validation fine.
 */
function checkJsonShape(value, problems, depth = 0, path = 'activité') {
	if (depth > LIMITS.maxDepth) {
		problems.push(`Structure trop profonde (niveau ${depth} > ${LIMITS.maxDepth}).`);
		return;
	}
	if (Array.isArray(value)) {
		if (value.length > LIMITS.maxDecompressedBytes / 8) {
			problems.push(`Tableau trop volumineux à « ${path} ».`);
			return;
		}
		for (let i = 0; i < value.length; i++) checkJsonShape(value[i], problems, depth + 1, `${path}[${i}]`);
	} else if (isPlainObject(value)) {
		for (const [key, child] of Object.entries(value)) checkJsonShape(child, problems, depth + 1, `${path}.${key}`);
	}
}

/**
 * Valide une activité décodée.
 * @returns {{ ok: boolean, errors: string[], activity?: object, warnings?: string[] }}
 */
export function validateActivity(raw) {
	const errors = [];
	const warnings = [];

	if (!isPlainObject(raw)) {
		return { ok: false, errors: ["L'activité doit être un objet JSON."], warnings };
	}

	checkJsonShape(raw, errors);
	if (errors.length > 0) return { ok: false, errors, warnings };

	// --- version ---
	if (!('v' in raw)) {
		errors.push('Le champ « v » (version du format) est requis.');
	} else if (typeof raw.v !== 'number' || !Number.isInteger(raw.v)) {
		errors.push('Le champ « v » doit être un entier (version du format).');
	} else if (raw.v !== SUPPORTED_VERSION) {
		errors.push(
			raw.v > SUPPORTED_VERSION
				? `Version du format ${raw.v} inconnue : l'activité utilise une version plus récente que celle prise en charge (${SUPPORTED_VERSION}).`
				: `Version du format ${raw.v} inconnue.`,
		);
	}
	if (errors.length > 0) return { ok: false, errors, warnings };

	// --- titre / consignes ---
	if (raw.t !== undefined && (typeof raw.t !== 'string' || raw.t.trim() === '')) {
		errors.push('Le champ « t » (titre) doit être une chaîne non vide.');
	} else if (typeof raw.t === 'string' && raw.t.length > MAX_TITLE_LENGTH) {
		errors.push(`Titre trop long (${raw.t.length} caractères, limite ${MAX_TITLE_LENGTH}).`);
	}
	if (raw.i !== undefined && typeof raw.i !== 'string') {
		errors.push('Le champ « i » (consignes) doit être une chaîne.');
	}
	if (errors.length > 0) return { ok: false, errors, warnings };

	// --- éléments ---
	if (!Array.isArray(raw.d)) {
		errors.push('Le champ « d » (éléments) doit être une liste.');
		return { ok: false, errors, warnings };
	}
	if (raw.d.length > LIMITS.maxItems) {
		errors.push(
			`Trop d'éléments (${raw.d.length}, limite ${LIMITS.maxItems}). Découpez l'activité en plusieurs liens.`,
		);
		return { ok: false, errors, warnings };
	}

	const seenIds = new Set();
	const items = [];
	raw.d.forEach((item, index) => {
		if (!isPlainObject(item)) {
			errors.push(`L'élément ${index + 1} doit être un objet.`);
			return;
		}
		const id = item.i ?? `item-${index + 1}`;
		if (item.i !== undefined && !isNonEmptyString(item.i)) {
			errors.push(`Élément ${index + 1} : le champ « i » (identifiant) doit être une chaîne non vide.`);
		}
		if (seenIds.has(id)) {
			errors.push(`Identifiant dupliqué : « ${id} ». Les identifiants doivent être uniques.`);
		}
		seenIds.add(id);

		const kind = item.k;
		if (typeof kind !== 'string' || !(kind in ACTIVITY_TYPES)) {
			errors.push(
				`Élément « ${id} » : type d'activité « ${kind ?? '(manquant)'} » inconnu. Types pris en charge : ${ACTIVITY_TYPE_NAMES.join(', ')}.`,
			);
			return;
		}

		checkString(item, 'q', errors, { required: true });
		checkString(item, 'e', errors);
		checkString(item, 'h', errors);
		checkReferenceList(item, errors);

		const requiredOptions = kind === 'mc' || kind === 'mm' || kind === 'match' || kind === 'order';
		if (requiredOptions) checkOptions(item, errors, { min: kind === 'match' || kind === 'order' ? 1 : 2 });

		validateAnswer(item, kind, errors);

		const itemOut = { ...item };
		if (itemOut.i === undefined) itemOut.i = id;
		items.push(itemOut);
	});

	if (errors.length > 0) return { ok: false, errors, warnings };

	const activity = {
		v: SUPPORTED_VERSION,
		t: typeof raw.t === 'string' ? raw.t : undefined,
		i: typeof raw.i === 'string' ? raw.i : undefined,
		d: items,
	};

	if (activity.d.length === 0) {
		warnings.push("L'activité ne contient aucun élément.");
	}

	return { ok: true, errors, warnings, activity };
}

/** Calcule le nombre total de questions (utile à l'interface). */
export function countItems(activity) {
	return activity.d.length;
}