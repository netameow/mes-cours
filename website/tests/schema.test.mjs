import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateActivity } from '../src/lib/activity/schema.mjs';
import { SAMPLE_ACTIVITY } from './helpers.mjs';
import { LIMITS } from '../src/lib/activity/codec.mjs';

function valid(overrides = {}) {
	return {
		v: 1,
		t: 'Titre',
		d: [{ i: 'q1', k: 'mc', q: 'Question ?', o: ['a', 'b'], a: 0 }],
		...overrides,
	};
}

test('une activité d’exemple complète est valide', () => {
	const result = validateActivity(SAMPLE_ACTIVITY);
	assert.equal(result.ok, true, JSON.stringify(result.errors));
	assert.equal(result.activity.d.length, 8);
});

test('un objet non-objet est rejeté', () => {
	assert.equal(validateActivity(null).ok, false);
	assert.equal(validateActivity('coucou').ok, false);
});

test('version manquante ou inconnue → message clair', () => {
	assert.match(validateActivity({ d: [] }).errors[0], /v.*requis/);
	const future = validateActivity({ v: 7, d: [] });
	assert.equal(future.ok, false);
	assert.match(future.errors[0], /version.*7|7.*version|inconnue/);
	assert.match(future.errors[0], /plus récente/);
});

test('type inconnu → message listant les types pris en charge', () => {
	const result = validateActivity(valid({ d: [{ i: 'q1', k: 'bloup', q: 'x' }] }));
	assert.equal(result.ok, false);
	assert.match(result.errors[0], /bloup.*inconnu/);
	assert.match(result.errors[0], /mc, mm, tf, fill, text, match, order, card/);
});

test('activité vide → valide avec avertissement', () => {
	const result = validateActivity({ v: 1, t: 'Vide', d: [] });
	assert.equal(result.ok, true);
	assert.ok(result.warnings.length >= 1);
});

test('identifiants dupliqués → erreur', () => {
	const result = validateActivity(
		valid({
			d: [
				{ i: 'a', k: 'mc', q: 'q1', o: ['1', '2'], a: 0 },
				{ i: 'a', k: 'mc', q: 'q2', o: ['1', '2'], a: 1 },
			],
		}),
	);
	assert.equal(result.ok, false);
	assert.match(result.errors[0], /dupliqu/);
});

test('identifiants absents → générés, sans erreur', () => {
	const result = validateActivity(
		valid({
			d: [
				{ k: 'mc', q: 'q1', o: ['1', '2'], a: 0 },
				{ k: 'mc', q: 'q2', o: ['1', '2'], a: 1 },
			],
		}),
	);
	assert.equal(result.ok, true);
	assert.ok(result.activity.d[0].i === 'item-1');
});

test('mc : indice de réponse hors bornes → erreur', () => {
	const result = validateActivity(valid({ d: [{ i: 'q1', k: 'mc', q: 'q', o: ['a', 'b'], a: 5 }] }));
	assert.equal(result.ok, false);
	assert.match(result.errors[0], /indice/);
});

test('mm : réponses hors bornes ou vides → erreur', () => {
	assert.equal(validateActivity(valid({ d: [{ i: 'q1', k: 'mm', q: 'q', o: ['a', 'b'], a: [3] }] })).ok, false);
	assert.equal(validateActivity(valid({ d: [{ i: 'q1', k: 'mm', q: 'q', o: ['a', 'b'], a: [] }] })).ok, false);
});

test('tf : réponse non booléenne → erreur', () => {
	const result = validateActivity(valid({ d: [{ i: 'q1', k: 'tf', q: 'q', a: 'vrai' }] }));
	assert.equal(result.ok, false);
	assert.match(result.errors[0], /bool/);
});

test('fill : réponses acceptées par trou → validation', () => {
	const ok = validateActivity(
		valid({ d: [{ i: 'q1', k: 'fill', q: 'A {{1}} et {{2}}.', a: [['x'], ['y', 'z']] }] }),
	);
	assert.equal(ok.ok, true);
	const ko = validateActivity(valid({ d: [{ i: 'q1', k: 'fill', q: 'A {{1}}.', a: [] }] }));
	assert.equal(ko.ok, false);
});

test('text : exige « a » ou « m »', () => {
	assert.equal(validateActivity(valid({ d: [{ i: 'q1', k: 'text', q: 'q' }] })).ok, false);
	assert.equal(validateActivity(valid({ d: [{ i: 'q1', k: 'text', q: 'q', a: ['x'] }] })).ok, true);
	assert.equal(validateActivity(valid({ d: [{ i: 'q1', k: 'text', q: 'q', m: 'modèle' }] })).ok, true);
});

test('match : tailles de référence et de gauche égales', () => {
	const ok = validateActivity(valid({ d: [{ i: 'q1', k: 'match', q: 'q', o: ['a', 'b'], a: ['1', '2'] }] }));
	assert.equal(ok.ok, true);
	const ko = validateActivity(valid({ d: [{ i: 'q1', k: 'match', q: 'q', o: ['a', 'b'], a: ['1'] }] }));
	assert.equal(ko.ok, false);
});

test('order : se base sur « o » uniquement', () => {
	const ok = validateActivity(valid({ d: [{ i: 'q1', k: 'order', q: 'q', o: ['a', 'b', 'c'] }] }));
	assert.equal(ok.ok, true);
	const ko = validateActivity(valid({ d: [{ i: 'q1', k: 'order', q: 'q', o: ['a', 'b'], a: [1, 0] }] }));
	assert.equal(ko.ok, false);
});

test('card : verso requis', () => {
	assert.equal(validateActivity(valid({ d: [{ i: 'q1', k: 'card', q: 'recto' }] })).ok, false);
	assert.equal(validateActivity(valid({ d: [{ i: 'q1', k: 'card', q: 'recto', a: 'verso' }] })).ok, true);
});

test('structure trop profonde → erreur', () => {
	const deep = { v: 1 };
	let cursor = deep;
	for (let i = 0; i < LIMITS.maxDepth + 2; i++) {
		cursor.x = {};
		cursor = cursor.x;
	}
	const result = validateActivity(deep);
	assert.equal(result.ok, false);
	assert.match(result.errors[0], /profonde/);
});

test('trop d’éléments → erreur', () => {
	const d = [];
	for (let i = 0; i < LIMITS.maxItems + 1; i++) d.push({ i: `q${i}`, k: 'mc', q: 'q', o: ['a', 'b'], a: 0 });
	const result = validateActivity({ v: 1, d });
	assert.equal(result.ok, false);
	assert.match(result.errors[0], /Trop d'éléments/);
});

test('options absentes pour mc → erreur', () => {
	const result = validateActivity(valid({ d: [{ i: 'q1', k: 'mc', q: 'q', o: ['seule'], a: 0 }] }));
	assert.equal(result.ok, false);
	assert.match(result.errors[0], /au moins 2 options/);
});

test('champs mal typés → erreur', () => {
	const result = validateActivity(valid({ d: [{ i: 'q1', k: 'mc', q: 42, o: ['a', 'b'], a: 0 }] }));
	assert.equal(result.ok, false);
	assert.match(result.errors[0], /doit être une chaîne/);
});