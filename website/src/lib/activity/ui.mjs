// Moteur d'activités interactives (côté client).
//
// Cette bibliothèque construit l'interface de la page `/test` à partir d'une
// activité validée et d'un index de références. Elle n'exécute jamais de
// contenu de l'activité : tout le Markdown passe par le pipeline assaini de
// `markdown.mjs`, et les corrections sont déterministes (`grade.mjs`).

import { renderMarkdown } from './markdown.mjs';
import {
	gradeMultipleChoice,
	gradeMultipleMany,
	gradeTrueFalse,
	gradeFill,
	gradeText,
	gradeMatch,
	gradeOrder,
	correctAnswerSummary,
} from './grade.mjs';
import { resolveReferences } from './references.mjs';
import { ACTIVITY_TYPES } from './schema.mjs';
import { renderDiagrams } from '../mermaid-client.mjs';

/* ------------------------------------------------------------------ */
/* Utilitaires                                                         */
/* ------------------------------------------------------------------ */

function el(tag, className, text) {
	const node = document.createElement(tag);
	if (className) node.className = className;
	if (text !== undefined) node.textContent = text;
	return node;
}

function mdBlock(node, markdown) {
	node.innerHTML = renderMarkdown(markdown);
	// Rendu Mermaid (SVG) immédiat, comme sur les pages de cours : les
	// diagrammes ajoutés dynamiquement le sont par `renderDiagrams()`.
	if (typeof node.querySelector === 'function' && node.querySelector('.mermaid')) {
		renderDiagrams().catch((error) => console.error('Rendu Mermaid impossible', error));
	}
	return node;
}

function button(label, className, onClick) {
	const node = el('button', `sl-button activity-btn ${className ?? ''}`);
	node.type = 'button';
	node.textContent = label;
	node.addEventListener('click', onClick);
	return node;
}

function plainText(markdown) {
	const div = document.createElement('div');
	div.innerHTML = renderMarkdown(markdown);
	return (div.textContent || '').replace(/\s+/g, ' ').trim();
}

/* PRNG déterministe : même activité + même élément → même mélange. */
function hashString(value) {
	let h = 2166136261;
	for (let i = 0; i < value.length; i++) {
		h ^= value.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}

function mulberry32(seed) {
	let a = seed >>> 0;
	return function () {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function shuffled(array, seed) {
	const copy = [...array];
	const rand = mulberry32(seed);
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function listenerState(state, item) {
	const key = item.i;
	const set = (value) => {
		if (!state.answered[key]) state.responses[key] = value;
	};
	return {
		get: (fallback) => (state.responses[key] !== undefined ? state.responses[key] : fallback),
		set,
		answered: Boolean(state.answered[key]),
	};
}

/* ------------------------------------------------------------------ */
/* Saisies par type                                                    */
/* ------------------------------------------------------------------ */

function buildInputs(item, state, inputState) {
	const container = el('div', 'activity-input');

	switch (item.k) {
		case 'mc': {
			const group = el('div', 'options-group');
			group.setAttribute('role', 'radiogroup');
			group.setAttribute('aria-label', 'Réponse à choix unique');
			const previous = inputState.get(undefined);
			item.o.forEach((option, index) => {
				const label = el('label', 'option');
				const input = document.createElement('input');
				input.type = 'radio';
				input.name = `mc-${item.i}`;
				input.value = String(index);
				if (previous === index) input.checked = true;
				const md = el('span', 'option-markdown');
				mdBlock(md, option);
				label.append(input, md);
				input.addEventListener('change', () => inputState.set(index));
				group.appendChild(label);
			});
			container.appendChild(group);
			break;
		}
		case 'mm': {
			const group = el('div', 'options-group');
			group.setAttribute('role', 'group');
			group.setAttribute('aria-label', 'Réponse à choix multiples');
			const previous = new Set(inputState.get([]));
			item.o.forEach((option, index) => {
				const label = el('label', 'option');
				const input = document.createElement('input');
				input.type = 'checkbox';
				input.value = String(index);
				if (previous.has(index)) input.checked = true;
				const md = el('span', 'option-markdown');
				mdBlock(md, option);
				label.append(input, md);
				input.addEventListener('change', () => {
					const selected = [...group.querySelectorAll('input[type="checkbox"]:checked')].map((node) =>
						Number(node.value),
					);
					inputState.set(selected.sort((a, b) => a - b));
				});
				group.appendChild(label);
			});
			container.appendChild(group);
			break;
		}
		case 'tf': {
			const group = el('div', 'options-group');
			group.setAttribute('role', 'radiogroup');
			group.setAttribute('aria-label', 'Vrai ou faux');
			const previous = inputState.get(undefined);
			[true, false].forEach((value) => {
				const label = el('label', 'option');
				const input = document.createElement('input');
				input.type = 'radio';
				input.name = `tf-${item.i}`;
				input.value = String(value);
				if (previous === value) input.checked = true;
				const md = el('span', 'option-markdown');
				md.textContent = value ? 'Vrai' : 'Faux';
				label.append(input, md);
				input.addEventListener('change', () => inputState.set(value));
				group.appendChild(label);
			});
			container.appendChild(group);
			break;
		}
		case 'fill': {
			const md = el('div', 'fill-statement markdown-content');
			mdBlock(md, item.q);
			hydrateFillInputs(md, inputState);
			container.appendChild(md);
			break;
		}
		case 'text': {
			const textarea = document.createElement('textarea');
			textarea.className = 'text-answer';
			textarea.rows = 3;
			textarea.placeholder = 'Écrivez votre réponse ici…';
			const previous = inputState.get(undefined);
			if (typeof previous === 'string') textarea.value = previous;
			textarea.addEventListener('input', () => inputState.set(textarea.value));
			container.appendChild(textarea);
			break;
		}
		case 'match': {
			container.appendChild(buildMatchInput(item, inputState));
			break;
		}
		case 'order': {
			container.appendChild(buildOrderInput(item, state, inputState));
			break;
		}
		case 'card': {
			container.appendChild(buildCard(item, inputState));
			break;
		}
		default:
			break;
	}
	return container;
}

function hydrateFillInputs(container, inputState) {
	const textNodes = [];
	const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
	while (walker.nextNode()) textNodes.push(walker.currentNode);

	const previous = Array.isArray(inputState.get([])) ? inputState.get([]) : [];
	const re = /\{\{(\d+)\}\}/g;
	for (const tn of textNodes) {
		const parent = tn.parentElement;
		if (parent && parent.closest('pre, code, .katex')) continue;
		const text = tn.nodeValue;
		if (!text.includes('{{')) continue;
		const parts = text.split(re);
		if (parts.length <= 1) continue;
		const frag = document.createDocumentFragment();
		for (let i = 0; i < parts.length; i++) {
			if (i % 2 === 0) {
				frag.appendChild(document.createTextNode(parts[i]));
			} else {
				const n = Number(parts[i]);
				const input = document.createElement('input');
				input.type = 'text';
				input.className = 'fill-input';
				input.autocomplete = 'off';
				input.setAttribute('aria-label', `Champ ${n}`);
				input.value = previous[n - 1] ?? '';
				frag.appendChild(input);
			}
		}
		tn.parentNode.replaceChild(frag, tn);
	}

	const sync = () => {
		const values = [...container.querySelectorAll('.fill-input')].map((node) => node.value);
		inputState.set(values);
	};
	container.querySelectorAll('.fill-input').forEach((input) => input.addEventListener('input', sync));
}

function buildMatchInput(item, inputState) {
	const seed = hashString(`${item.i}:match`);
	const rightShuffled = shuffled(item.a.map((value, index) => ({ value, index })), seed);
	const previousMap = new Map();
	const previousPairs = inputState.get([]);
	if (Array.isArray(previousPairs)) {
		for (const [left, right] of previousPairs) previousMap.set(left, right);
	}

	const table = el('div', 'match-table');
	item.o.forEach((left, leftIndex) => {
		const row = el('div', 'match-row');
		const leftCell = el('div', 'match-left');
		mdBlock(leftCell, left);
		const rightCell = el('div', 'match-right');
		const select = document.createElement('select');
		select.setAttribute('aria-label', `Association de l'élément ${leftIndex + 1}`);
		const placeholder = document.createElement('option');
		placeholder.value = '';
		placeholder.textContent = '— choisir —';
		select.appendChild(placeholder);
		rightShuffled.forEach(({ value, index }) => {
			const option = document.createElement('option');
			option.value = String(index);
			option.textContent = plainText(value);
			select.appendChild(option);
		});
		if (previousMap.has(leftIndex)) select.value = String(previousMap.get(leftIndex));
		select.addEventListener('change', () => {
			const rows = table.querySelectorAll('.match-row');
			const pairs = [];
			rows.forEach((r, l) => {
				const chosen = r.querySelector('select').value;
				if (chosen !== '') pairs.push([l, Number(chosen)]);
			});
			inputState.set(pairs);
		});
		rightCell.appendChild(select);
		row.append(leftCell, rightCell);
		table.appendChild(row);
	});
	return table;
}

function buildOrderInput(item, state, inputState) {
	const seed = hashString(`${item.i}:order`);
	const key = item.i;
	if (!state.order[key]) {
		state.order[key] = shuffled(item.o.map((value, index) => ({ value, index })), seed);
	}
	const entries = state.order[key];
	const initialRanks = inputState.get(undefined);
	if (Array.isArray(initialRanks)) {
		// Réordonne le rendu selon les rangs saisis (après navigation arrière).
		const sorted = [...entries].sort((entryA, entryB) => {
			const rankOf = (entry) => initialRanks.indexOf(entry.index);
			return rankOf(entryA) - rankOf(entryB);
		});
		state.order[key] = sorted;
		entries.splice(0, entries.length, ...sorted);
	}

	const list = el('ol', 'order-list');
	list.setAttribute('aria-label', 'Éléments à remettre dans l’ordre');

	const sync = () => {
		const ranks = [...list.children].map((row) => Number(row.querySelector('.order-index').textContent) - 1);
		const reordered = [...list.children].map(
			(row) => entries.find((entry) => entry.index === Number(row.dataset.rank)) ?? entries[0],
		);
		state.order[key] = reordered;
		inputState.set(ranks);
	};

	entries.forEach((entry) => {
		const row = el('li', 'order-row');
		row.dataset.rank = String(entry.index);
		const indexBadge = el('span', 'order-index', String(entry.index + 1));
		indexBadge.setAttribute('aria-hidden', 'true');
		const md = el('span', 'order-markdown');
		mdBlock(md, entry.value);
		const controls = el('span', 'order-controls');
		const up = el('button', 'order-btn', '↑');
		up.type = 'button';
		up.setAttribute('aria-label', 'Monter l’élément');
		const down = el('button', 'order-btn', '↓');
		down.type = 'button';
		down.setAttribute('aria-label', 'Descendre l’élément');
		up.addEventListener('click', () => {
			if (row.previousElementSibling) {
				list.insertBefore(row, row.previousElementSibling);
				sync();
			}
		});
		down.addEventListener('click', () => {
			if (row.nextElementSibling) {
				list.insertBefore(row.nextElementSibling, row);
				sync();
			}
		});
		controls.append(up, down);
		row.append(indexBadge, md, controls);
		list.appendChild(row);
	});
	sync(); // enregistre l'ordre initial pour que « Valider » sans déplacement compte
	return list;
}

function buildCard(item, inputState) {
	const wrapper = el('div', 'flashcard');
	const front = el('div', 'flashcard-face flashcard-front');
	const frontLabel = el('p', 'flashcard-label', 'Recto');
	mdBlock(front, item.q);
	front.prepend(frontLabel);
	const back = el('div', 'flashcard-face flashcard-back');
	const backLabel = el('p', 'flashcard-label', 'Verso');
	mdBlock(back, item.a);
	back.prepend(backLabel);

	const flipBtn = button('Retourner la carte', 'secondary', () => {
		wrapper.classList.add('is-flipped');
		flipBtn.hidden = true;
		inputState.set(true);
	});
	front.appendChild(flipBtn);

	wrapper.append(front, back);
	return wrapper;
}

/* ------------------------------------------------------------------ */
/* Moteur principal                                                    */
/* ------------------------------------------------------------------ */

function defaultState(activity) {
	return {
		activity,
		responses: Object.create(null),
		answered: Object.create(null),
		scored: Object.create(null), // 'correct' | 'incorrect' | undefined
		grades: Object.create(null), // dernière correction par élément
		selfEval: Object.create(null), // résultat choisi pour les auto-évaluations
		order: Object.create(null),
	};
}

/**
 * Monte l'activité dans `root`.
 * @param {HTMLElement} root
 * @param {object} options `{ activity, index }`
 * @returns {{ state, goTo: (i:number)=>void }}
 */
export function mountActivity(root, options) {
	const { activity, index } = options;
	const state = defaultState(activity);
	const items = activity.d;
	let current = 0;

	root.innerHTML = '';

	/* --- en-tête --- */
	const header = el('header', 'activity-header');
	if (activity.t) {
		const title = el('h2', 'activity-title');
		mdBlock(title, activity.t);
		header.appendChild(title);
	}
	const intro = el('div', 'activity-intro');
	if (activity.i) mdBlock(intro, activity.i);
	else intro.hidden = true;
	header.appendChild(intro);

	const scoreLine = el('p', 'activity-score', '');
	scoreLine.setAttribute('aria-live', 'polite');
	header.appendChild(scoreLine);
	root.appendChild(header);

	/* --- progression --- */
	const dots = el('ol', 'activity-dots');
	dots.setAttribute('aria-label', 'Progression');
	root.appendChild(dots);

	/* --- carte d'élément --- */
	const card = el('section', 'activity-card');
	card.setAttribute('aria-label', 'Activité');
	root.appendChild(card);

	/* --- écran final --- */
	const final = el('section', 'activity-final');
	final.hidden = true;
	root.appendChild(final);

	function updateScoreLine() {
		const corrected = items.filter((item) => state.scored[item.i] === 'correct').length;
		scoreLine.textContent = `${corrected}/${items.length} correcte${items.length > 1 ? 's' : ''}`;
	}

	function buildDots() {
		dots.innerHTML = '';
		items.forEach((item, itemIndex) => {
			const dot = el('button', 'activity-dot');
			dot.type = 'button';
			const status = state.scored[item.i];
			if (status === 'correct') dot.classList.add('is-correct');
			else if (status === 'incorrect') dot.classList.add('is-incorrect');
			if (itemIndex === current) dot.classList.add('is-current');
			const stateLabel = status === 'correct' ? 'réussie' : status === 'incorrect' ? 'à revoir' : 'en attente';
			dot.setAttribute('aria-label', `Question ${itemIndex + 1} (${stateLabel})`);
			dot.addEventListener('click', () => renderItem(itemIndex));
			dots.appendChild(dot);
		});
	}

	function renderItem(itemIndex) {
		current = itemIndex;
		renderCard(itemIndex);
		buildDots();
	}

	const gradeItem = (item, response) => {
		let gradeStatus;
		switch (item.k) {
			case 'mc':
				gradeStatus = gradeMultipleChoice(item, response);
				break;
			case 'mm':
				gradeStatus = gradeMultipleMany(item, response);
				break;
			case 'tf':
				gradeStatus = gradeTrueFalse(item, response);
				break;
			case 'fill':
				gradeStatus = gradeFill(item, response ?? []);
				break;
			case 'text':
				gradeStatus = gradeText(item, response);
				if (gradeStatus.status === 'incorrect' && typeof item.m === 'string' && !item.a) {
					gradeStatus = { status: 'self', score: 0, model: item.m };
				}
				break;
			case 'match':
				gradeStatus = gradeMatch(item, response ?? []);
				break;
			case 'order':
				gradeStatus = gradeOrder(item, response ?? []);
				break;
			case 'card':
				gradeStatus = { status: 'self', score: 0 };
				break;
			default:
				gradeStatus = { status: 'incorrect', score: 0 };
		}
		return gradeStatus;
	};

	function renderCard(itemIndex) {
		const item = items[itemIndex];
		card.innerHTML = '';
		card.setAttribute('aria-label', `Question ${itemIndex + 1} sur ${items.length}`);

		const meta = el('p', 'activity-meta');
		meta.textContent = `Question ${itemIndex + 1}/${items.length} · ${ACTIVITY_TYPES[item.k]?.label ?? item.k}`;
		card.appendChild(meta);

		const inputState = listenerState(state, item);
		const answered = inputState.answered;

		if (item.k !== 'fill' && item.k !== 'card') {
			const question = el('div', 'activity-question');
			mdBlock(question, item.q);
			card.appendChild(question);
		}

		card.appendChild(buildInputs(item, state, inputState));

		/* actions */
		const actions = el('div', 'activity-actions');

		const backBtn = button('← Précédent', 'secondary', () => {
			if (itemIndex > 0) renderItem(itemIndex - 1);
		});
		backBtn.disabled = itemIndex === 0;
		actions.appendChild(backBtn);

		if (item.h && !answered) {
			const hintBtn = button('Indice', 'secondary', () => {
				const hintBox = card.querySelector('.activity-hint');
				if (hintBox) {
					hintBox.hidden = !hintBox.hidden;
					return;
				}
				const box = el('div', 'activity-hint');
				mdBlock(box, item.h);
				card.appendChild(box);
			});
			actions.appendChild(hintBtn);
		}

		if (!answered) {
			const validateBtn = button('Valider', 'primary', () => validateCurrent(itemIndex));
			validateBtn.dataset.testid = 'validate';
			actions.appendChild(validateBtn);
		}

		const nextBtn = button(itemIndex < items.length - 1 ? 'Suivant →' : 'Voir le bilan →', 'secondary', () => {
			if (itemIndex < items.length - 1) renderItem(itemIndex + 1);
			else showFinal();
		});
		nextBtn.disabled = !answered;
		nextBtn.dataset.testid = 'next';
		actions.appendChild(nextBtn);
		card.appendChild(actions);

		const feedback = el('div', 'activity-feedback');
		feedback.setAttribute('aria-live', 'assertive');
		feedback.tabIndex = -1;
		card.appendChild(feedback);

		if (answered) renderFeedback(item, feedback);
	}

	function validateCurrent(itemIndex) {
		const item = items[itemIndex];
		const response = state.responses[item.i];
		const gradeStatus = gradeItem(item, response);
		state.grades[item.i] = gradeStatus;
		state.answered[item.i] = true;
		state.scored[item.i] = gradeStatus.status === 'correct' ? 'correct' : 'incorrect';
		updateScoreLine();
		buildDots();
		renderCard(itemIndex);
		const focusable = card.querySelector('.activity-feedback');
		if (focusable) focusable.focus();
	}

	function renderFeedback(item, feedback) {
		const result = state.grades[item.i];
		const status = result.status;

		const selfResult = state.selfEval[item.i];
		const effectiveStatus = selfResult ? selfResult : status;
		const badge = el('p', `feedback-badge ${effectiveStatus}`);
		const messages = {
			correct: '✔ Correct',
			partial: '~ Partiellement correct',
			incorrect: '✘ Incorrect',
			incomplete: 'Réponse incomplète',
			self: 'Auto-évaluation',
		};
		badge.textContent = selfResult ? (selfResult === 'correct' ? '✔ Correct' : '✘ À revoir') : (messages[status] ?? status);
		feedback.appendChild(badge);

		if (status === 'incomplete') {
			feedback.appendChild(el('p', 'feedback-note', 'Répondez avant de valider.'));
		}

		const markSelf = (item, chosen) => {
			state.selfEval[item.i] = chosen;
			state.scored[item.i] = chosen;
			updateScoreLine();
			buildDots();
			const fb = card.querySelector('.activity-feedback');
			if (fb) {
				fb.innerHTML = '';
				renderFeedback(item, fb);
			}
		};

		/* Texte libre avec réponse modèle : auto-évaluation. */
		if (item.k === 'text' && result.model) {
			const model = el('div', 'text-model');
			const label = el('p', 'feedback-label', 'Réponse modèle');
			model.appendChild(label);
			mdBlock(model, result.model);
			feedback.appendChild(model);

			if (!state.selfEval[item.i]) {
				const self = el('div', 'self-eval');
				const ok = button('Ma réponse était correcte', 'primary', () => markSelf(item, 'correct'));
				const ko = button('À revoir', 'secondary', () => markSelf(item, 'incorrect'));
				self.append(ok, ko);
				feedback.appendChild(self);
			} else {
				feedback.appendChild(
					el(
						'p',
						'feedback-note',
						state.selfEval[item.i] === 'correct'
							? 'Vous avez validé cette réponse. ✔'
							: 'Vous avez marqué cette réponse « à revoir ».',
					),
				);
			}
		}

		/* Flashcard : auto-évaluation après retournement. */
		if (item.k === 'card') {
			if (!state.selfEval[item.i]) {
				const self = el('div', 'self-eval');
				self.appendChild(el('p', 'feedback-label', 'Saviez-vous la réponse ?'));
				const ok = button('Oui, je la connaissais', 'primary', () => markSelf(item, 'correct'));
				const ko = button('Non, à revoir', 'secondary', () => markSelf(item, 'incorrect'));
				self.append(ok, ko);
				feedback.appendChild(self);
			} else {
				feedback.appendChild(
					el(
						'p',
						'feedback-note',
						state.selfEval[item.i] === 'correct' ? 'Carte validée. ✔' : 'Carte marquée « à revoir ».',
					),
				);
			}
		}

		if (item.k !== 'card') {
			if (item.e) {
				const explanation = el('div', 'activity-explanation');
				const label = el('p', 'feedback-label', 'Explication');
				explanation.appendChild(label);
				mdBlock(explanation, item.e);
				feedback.appendChild(explanation);
			}

			if (item.k === 'order' && status !== 'correct') {
				const expected = el('ol', 'order-correct');
				item.o.forEach((value) => {
					const li = el('li');
					mdBlock(li, value);
					expected.appendChild(li);
				});
				const group = el('div', 'activity-correct-answer');
				group.appendChild(el('p', 'feedback-label', 'Ordre attendu'));
				group.appendChild(expected);
				feedback.appendChild(group);
			} else if (item.k === 'match' && status !== 'correct') {
				const pairs = el('ul', 'match-correct');
				item.o.forEach((left, leftIndex) => {
					const li = el('li');
					const leftSpan = el('span', 'match-correct-left');
					mdBlock(leftSpan, left);
					const arrow = el('span', 'match-correct-arrow', '→');
					const rightSpan = el('span', 'match-correct-right');
					mdBlock(rightSpan, item.a[leftIndex]);
					li.append(leftSpan, arrow, rightSpan);
					pairs.appendChild(li);
				});
				const group = el('div', 'activity-correct-answer');
				group.appendChild(el('p', 'feedback-label', 'Associations attendues'));
				group.appendChild(pairs);
				feedback.appendChild(group);
			} else {
				const correctSummary = correctAnswerSummary(item);
				if (correctSummary && status !== 'correct') {
					const answer = el('div', 'activity-correct-answer');
					const label = el(
						'p',
						'feedback-label',
						status === 'incomplete' ? 'Proposition de réponse' : 'Réponse attendue',
					);
					answer.appendChild(label);
					if (item.k === 'text' && typeof item.m === 'string') mdBlock(answer, item.m);
					else mdBlock(answer, correctSummary);
					feedback.appendChild(answer);
				}
			}
		}

		/* Références vers les cours. */
		if (item.r && item.r.length > 0) {
			const refsBox = el('div', 'activity-references');
			const label = el('p', 'feedback-label', 'Pour aller plus loin');
			refsBox.appendChild(label);
			const list = el('ul', 'reference-list');
			const { links, missing } = resolveReferences(item.r, index);
			for (const link of links) {
				const li = el('li');
				const anchor = document.createElement('a');
				anchor.href = link.url;
				anchor.textContent = link.label;
				anchor.setAttribute('rel', 'noopener');
				if (link.note) anchor.title = link.note;
				li.appendChild(anchor);
				if (link.note) li.appendChild(el('span', 'reference-note', ` — ${link.note}`));
				list.appendChild(li);
			}
			for (const missingRef of missing) {
				const li = el('li', 'reference-missing');
				li.appendChild(el('span', 'reference-missing-label', 'Référence inexistante'));
				li.appendChild(el('span', 'reference-missing-value', `« ${missingRef.ref} »`));
				li.title = missingRef.note ?? 'Aucune page ne correspond à cette référence.';
				list.appendChild(li);
			}
			refsBox.appendChild(list);
			feedback.appendChild(refsBox);
		}

		if (feedback.textContent.trim() === '' && !feedback.querySelector('.self-eval')) {
			feedback.hidden = true;
		}
	}

	function showFinal() {
		card.hidden = true;
		dots.hidden = true;
		final.hidden = false;
		final.innerHTML = '';

		const title = el('h2', 'activity-final-title', 'Bilan');
		final.appendChild(title);

		const correct = items.filter((item) => state.scored[item.i] === 'correct').length;
		const summary = el('p', 'activity-final-score');
		summary.textContent = `${correct} / ${items.length} élément${items.length > 1 ? 's' : ''} réussi${items.length > 1 ? 's' : ''}`;
		final.appendChild(summary);

		const list = el('ul', 'final-list');
		items.forEach((item, itemIndex) => {
			const li = el('li');
			const status = state.scored[item.i] ?? 'pending';
			const badge = el('span', `final-status ${status}`, status === 'correct' ? '✔' : status === 'incorrect' ? '✘' : '·');
			const textButton = el('button', 'final-link');
			textButton.type = 'button';
			textButton.textContent = `Question ${itemIndex + 1} — ${plainText(item.q).slice(0, 80)}`;
			textButton.addEventListener('click', () => {
				final.hidden = true;
				card.hidden = false;
				dots.hidden = false;
				renderItem(itemIndex);
			});
			li.append(badge, textButton);
			list.appendChild(li);
		});
		final.appendChild(list);

		const restart = button('Recommencer', 'primary', () => {
			state.responses = Object.create(null);
			state.answered = Object.create(null);
			state.scored = Object.create(null);
			state.grades = Object.create(null);
			state.selfEval = Object.create(null);
			state.order = Object.create(null);
			updateScoreLine();
			final.hidden = true;
			card.hidden = false;
			dots.hidden = false;
			renderItem(0);
		});
		final.appendChild(restart);
	}

	updateScoreLine();
	buildDots();
	renderItem(0);

	return { state, goTo: renderItem };
}