// Test d'intégration « sans navigateur » : on reproduit le flux réel de la
// page /test — lire `?data=`, décoder, valider, monter l'interface dans un
// DOM, répondre à chaque type, vérifier la correction et le bilan.
//
// Cela couvre les comportements DOM du moteur (boutons, saisies, feedback,
// navigation, références) sans navigateur complet.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { encodeActivity, decodeActivity } from '../src/lib/activity/codec.mjs';
import { validateActivity } from '../src/lib/activity/schema.mjs';
import { mountActivity } from '../src/lib/activity/ui.mjs';
import { SAMPLE_INDEX } from './helpers.mjs';

function setupDom() {
	const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
		url: 'https://netameow.github.io/mes-cours/test?data=abc',
	});
	globalThis.window = dom.window;
	globalThis.document = dom.window.document;
	globalThis.NodeFilter = dom.window.NodeFilter;
	globalThis.location = dom.window.location;
	return dom;
}

/** Use les boutons ↑ pour trier les lignes par ordre/index croissant. */
function sortOrderAsc(root) {
	const getRows = () => [...root.querySelectorAll('.order-row')];
	const target = (n) => getRows().find((r) => r.querySelector('.order-index')?.textContent === String(n));
	const length = getRows().length;
	for (let pos = 1; pos <= length; pos++) {
		let guard = 0;
		while (getRows().indexOf(target(pos)) !== pos - 1 && guard++ < length) {
			const row = target(pos);
			row.querySelector('[aria-label="Monter l’élément"]').click();
		}
	}
}

const activity = {
	v: 1,
	t: 'Test interface',
	d: [
		{ i: 'a', k: 'mc', q: 'RAM ?', o: ['stocker', 'afficher'], a: 0, e: 'explication', r: ['R1.03#lecture'] },
		{ i: 'b', k: 'mm', q: 'volatiles ?', o: ['RAM', 'ROM', 'Flash'], a: [0, 2] },
		{ i: 'c', k: 'tf', q: 'vrai ?', a: true },
		{ i: 'd', k: 'fill', q: 'Valeur : {{1}}.', a: [['16']] },
		{ i: 'e', k: 'text', q: 'Dérivée ?', a: ['3x^2'] },
		{ i: 'f', k: 'match', q: 'Associer', o: ['Gauche A', 'Gauche B'], a: ['Dr1', 'Dr2'] },
		{ i: 'g', k: 'order', q: 'Ordre', o: ['Premier', 'Deuxième', 'Troisième'] },
		{ i: 'h', k: 'card', q: 'Recto', a: 'Verso' },
	],
};

test('flux complet dans un DOM : répondre, valider, bilan, recommencer', () => {
	const dom = setupDom();
	const root = document.getElementById('root');
	const data = encodeActivity(activity);
	const raw = decodeActivity(data); // mêmes étapes que la page /test
	const validation = validateActivity(raw);
	assert.equal(validation.ok, true);
	mountActivity(root, { activity: validation.activity, index: SAMPLE_INDEX });

	// Question 1 : choix unique R1 → correct.
	assert.match(root.textContent, /RAM/);
	let radios = root.querySelectorAll('input[type="radio"]');
	assert.equal(radios.length, 2);
	radios[0].click();
	root.querySelector('[data-testid="validate"]').click();
	assert.match(root.querySelector('.activity-feedback').textContent, /Correct/);
	assert.match(root.querySelector('.activity-feedback').textContent, /explication/);
	const refLinks = root.querySelectorAll('.reference-list a');
	assert.equal(refLinks.length, 1);
	assert.match(refLinks[0].getAttribute('href'), /r1-03.*4-la-memoire.*#lecture/);

	// Question 2 : choix multiples [0,2] → correct.
	root.querySelector('[data-testid="next"]').click();
	let checks = root.querySelectorAll('input[type="checkbox"]');
	checks[0].click();
	checks[2].click();
	root.querySelector('[data-testid="validate"]').click();
	assert.match(root.querySelector('.activity-feedback').textContent, /Correct/);

	// Question 3 : vrai/faux → Vrai.
	root.querySelector('[data-testid="next"]').click();
	let tfs = root.querySelectorAll('input[type="radio"]');
	tfs[0].click(); // Vrai
	root.querySelector('[data-testid="validate"]').click();
	assert.match(root.querySelector('.activity-feedback').textContent, /Correct/);

	// Question 4 : texte à compléter.
	root.querySelector('[data-testid="next"]').click();
	let inputs = root.querySelectorAll('.fill-input');
	assert.equal(inputs.length, 1);
	inputs[0].value = '16';
	inputs[0].dispatchEvent(new dom.window.Event('input', { bubbles: true }));
	root.querySelector('[data-testid="validate"]').click();
	assert.match(root.querySelector('.activity-feedback').textContent, /Correct/);

	// Question 5 : réponse libre.
	root.querySelector('[data-testid="next"]').click();
	let textarea = root.querySelector('.text-answer');
	textarea.value = '  3x^2  ';
	textarea.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
	root.querySelector('[data-testid="validate"]').click();
	assert.match(root.querySelector('.activity-feedback').textContent, /Correct/);

	// Question 6 : association (mauvaise → incorrect)
	root.querySelector('[data-testid="next"]').click();
	assert.equal(root.querySelectorAll('.match-row select').length, 2);
	// Joue volontairement mal : ligne 1 → Dr2 (index 1)
	let selects = root.querySelectorAll('.match-row select');
	selects[0].value = '1';
	selects[0].dispatchEvent(new dom.window.Event('change', { bubbles: true }));
	selects[1].value = '0';
	selects[1].dispatchEvent(new dom.window.Event('change', { bubbles: true }));
	root.querySelector('[data-testid="validate"]').click();
	assert.match(root.querySelector('.activity-feedback').textContent, /Incorrect/);
	// L'association attendue est affichée.
	assert.ok(root.querySelector('.match-correct'));

	// Question 7 : mise en ordre — remettre les lignes dans l’ordre correct.
	root.querySelector('[data-testid="next"]').click();
	assert.equal(root.querySelectorAll('.order-row').length, 3);
	sortOrderAsc(root);
	root.querySelector('[data-testid="validate"]').click();
	assert.match(root.querySelector('.activity-feedback').textContent, /Correct/);

	// Question 8 : flashcard → retourner puis auto-évaluer.
	root.querySelector('[data-testid="next"]').click();
	assert.ok(root.querySelector('.flashcard-front'));
	root.querySelector('.flashcard .activity-btn').click();
	assert.ok(root.querySelector('.flashcard.is-flipped'));
	root.querySelector('[data-testid="validate"]').click();
	const selfButtons = root.querySelectorAll('.self-eval button');
	assert.equal(selfButtons.length, 2);
	selfButtons[0].click();
	assert.match(root.querySelector('.activity-feedback').textContent, /Carte validée/);

	// Bilan : tout est correct sauf l'association → 7/8.
	root.querySelector('[data-testid="next"]').click();
	assert.match(root.querySelector('.activity-final').textContent, /7 \/ 8/);
	const summary = root.querySelector('.activity-final');
	assert.match(summary.textContent, /Bilan/);
	assert.equal(summary.querySelectorAll('.final-status.correct').length, 7);
	assert.equal(summary.querySelectorAll('.final-status.incorrect').length, 1);

	// Recommencer.
	root.querySelectorAll('.activity-final button')[0].click();
	assert.equal(root.querySelector('.activity-dots').children.length, 8);

	dom.window.close();
});

test('les réponses manquantes affichent une correction incomplète', () => {
	const dom = setupDom();
	const root = document.getElementById('root');
	const validation = validateActivity(activity);
	assert.equal(validation.ok, true);
	mountActivity(root, { activity: validation.activity, index: SAMPLE_INDEX });
	// Valider sans rien sélectionner.
	root.querySelector('[data-testid="validate"]').click();
	assert.match(root.querySelector('.activity-feedback').textContent, /incomplète/);
	// Le bouton suivant reste disponible après validation.
	assert.equal(root.querySelector('[data-testid="next"]').disabled, false);
	dom.window.close();
});

test('progression : points mis à jour et navigation directe', () => {
	const dom = setupDom();
	const root = document.getElementById('root');
	const validation = validateActivity(activity);
	assert.equal(validation.ok, true);
	mountActivity(root, { activity: validation.activity, index: SAMPLE_INDEX });

	// Premier point marqué courant.
	assert.ok(root.querySelector('.activity-dot.is-current'));
	// Cliquer sur le 6e point.
	const dots = root.querySelectorAll('.activity-dot');
	dots[5].click();
	assert.match(root.textContent, /Question 6\/8/);
	assert.equal(root.querySelectorAll('.activity-dot')[5].classList.contains('is-current'), true);
	assert.match(root.textContent, /Associer/);
	dom.window.close();
});