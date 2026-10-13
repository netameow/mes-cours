// Correction déterministe des différents types d'activités.
//
// Règles de comparaison pour les réponses libres et les trous :
//   1. on retire les espaces en début/fin ;
//   2. on remplace les espaces multiples par un seul et on ignore la casse ;
//   3. on ignore les accents (normalisation NFD) ;
//   4. on retire la ponctuation finale (.,;:!?¿¡'"«»()[]{}).
// Ces règles sont documentées dans `llms.txt` pour que les LLM génèrent des
// activités reproductibles.

export function normalizeAnswerText(value) {
	return String(value ?? '')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/\s+/g, ' ')
		.trim()
		.replace(/^["'“”‘’«»([]{0,2}|[.,;:!?¿¡'"”’«»()\[\]]+$/g, '')
		.trim();
}

function truthy(condition) {
	return { status: condition ? 'correct' : 'incorrect', score: condition ? 1 : 0 };
}

/** Choix unique : `answer` est l'indice choisi (0…n-1). */
export function gradeMultipleChoice(item, answer) {
	if (typeof answer !== 'number' || !Number.isInteger(answer) || answer < 0 || answer >= item.o.length) {
		return { status: 'incomplete', score: 0 };
	}
	return truthy(answer === item.a);
}

/** Choix multiples : `answer` est un tableau d'indices. */
export function gradeMultipleMany(item, answer) {
	if (!Array.isArray(answer) || answer.length === 0) {
		return { status: 'incomplete', score: 0 };
	}
	const correct = [...item.a].sort();
	const chosen = [...answer].sort();
	const same = correct.length === chosen.length && correct.every((value, index) => value === chosen[index]);
	return truthy(same);
}

/** Vrai/faux : `answer` est un booléen. */
export function gradeTrueFalse(item, answer) {
	if (typeof answer !== 'boolean') return { status: 'incomplete', score: 0 };
	return truthy(answer === item.a);
}

/** Texte à compléter : `answers` est un tableau de chaînes saisies par trou. */
export function gradeFill(item, answers) {
	const blanks = item.a;
	if (!Array.isArray(answers) || answers.length !== blanks.length) {
		return { status: 'incomplete', score: 0, detail: blanks.map(() => 'missing') };
	}
	const detail = blanks.map((accepted, index) => {
		const ok = accepted.some(
			(possible) => normalizeAnswerText(possible) === normalizeAnswerText(answers[index]),
		);
		return ok ? 'correct' : 'incorrect';
	});
	const correctCount = detail.filter((status) => status === 'correct').length;
	const allCorrect = correctCount === detail.length;
	return {
		status: allCorrect ? 'correct' : correctCount === 0 ? 'incorrect' : 'partial',
		score: allCorrect ? 1 : correctCount / detail.length,
		detail,
	};
}

/** Réponse libre : comparaison déterministe contre une liste de réponses acceptées. */
export function gradeText(item, answer) {
	if (typeof answer !== 'string') return { status: 'incomplete', score: 0 };
	const expected = item.a ?? [];
	const normalized = normalizeAnswerText(answer);
	const matched = expected.some((possible) => normalizeAnswerText(possible) === normalized);
	if (matched) return { status: 'correct', score: 1 };
	// Une réponse vide est « incomplète », pas « fausse ».
	if (normalized === '') return { status: 'incomplete', score: 0 };
	return { status: 'incorrect', score: 0 };
}

/**
 * Association : `pairs` est un tableau `[indiceGauche, indiceDroite]` pour
 * chaque paire choisie. La colonne de droite est mélangée au rendu ; la
 * correction compare aux indices *originaux*.
 */
export function gradeMatch(item, pairs) {
	const n = item.o.length;
	if (!Array.isArray(pairs) || pairs.length === 0) {
		return { status: 'incomplete', score: 0 };
	}
	const detail = [];
	let correct = 0;
	for (let left = 0; left < n; left++) {
		const chosen = pairs.find(([l]) => l === left)?.[1];
		const ok = typeof chosen === 'number' && chosen === left;
		detail.push({ left, chosen, ok });
		if (ok) correct++;
	}
	const allCorrect = correct === n;
	return {
		status: allCorrect ? 'correct' : correct === 0 ? 'incorrect' : 'partial',
		score: allCorrect ? 1 : correct / n,
		detail,
	};
}

/**
 * Mise en ordre : `ranks` est l'ordre courant des éléments (chaque entier
 * 0…n-1 correspond à la position originale = rang correct).
 */
export function gradeOrder(item, ranks) {
	const n = item.o.length;
	if (!Array.isArray(ranks) || ranks.length !== n) return { status: 'incomplete', score: 0 };
	const allCorrect = ranks.every((rank, index) => rank === index);
	const positions = ranks.filter((rank, index) => rank === index).length;
	return {
		status: allCorrect ? 'correct' : positions === 0 ? 'incorrect' : 'partial',
		score: allCorrect ? 1 : positions / n,
		detail: ranks.map((rank, index) => rank === index),
	};
}

/** Flashcard : l'auto-évaluation est gérée par l'interface. */
export function gradeCard(_item, _marker) {
	return null;
}

/** Rend la liste « correcte » pour l'affichage, selon le type. */
export function correctAnswerSummary(item) {
	switch (item.k) {
		case 'mc':
			return item.o[item.a];
		case 'mm':
			return item.a.map((index) => item.o[index]).join(', ');
		case 'tf':
			return item.a ? 'Vrai' : 'Faux';
		case 'fill':
			return item.a.map((accepted, index) => `Trou ${index + 1} : ${accepted.join(' ou ')}`).join(' · ');
		case 'text':
			return item.m ?? (item.a ?? []).join(' ou ');
		case 'match':
			return 'Associez chaque élément de gauche avec sa colonne de droite.';
		case 'order':
			return 'L’ordre correct est affiché après validation.';
		case 'card':
			return '';
		default:
			return '';
	}
}