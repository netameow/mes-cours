import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveReference, resolveReferences } from '../src/lib/activity/references.mjs';
import { SAMPLE_INDEX } from './helpers.mjs';

test('code de cours seul → page principale du cours', () => {
	const result = resolveReference('R1.03', SAMPLE_INDEX);
	assert.equal(result.ok, true);
	assert.match(result.url, new RegExp(`^${SAMPLE_INDEX.base}cours/r1-03-introduction-a-l-architecture-des-ordinateurs/`));
});

test('code de cours + ancre (accents ignorés) → page et ancre réelles', () => {
	const result = resolveReference('R1.03#4-mémoire-adressable--principe', SAMPLE_INDEX);
	assert.equal(result.ok, true);
	assert.match(result.url, /4-la-memoire-et-le-cache\/#4-mémoire-adressable--principe/);
});

test('ancre écrite sans accents résolue par normalisation', () => {
	const result = resolveReference('R1.03#4-memoire-adressable--principe', SAMPLE_INDEX);
	assert.equal(result.ok, true);
	assert.match(result.url, /#4-mémoire-adressable--principe/);
});

test('chemin complet de page + ancre', () => {
	const result = resolveReference(
		'cours/r1-03-introduction-a-l-architecture-des-ordinateurs/4-la-memoire-et-le-cache#lecture',
		SAMPLE_INDEX,
	);
	assert.equal(result.ok, true);
	assert.match(result.url, /#lecture/);
});

test('préfixe ./ accepté', () => {
	const result = resolveReference('./cours/r1-03-introduction-a-l-architecture-des-ordinateurs/4-la-memoire-et-le-cache', SAMPLE_INDEX);
	assert.equal(result.ok, true);
});

test('ancre inconnue → lien vers la page, avec note explicative', () => {
	const result = resolveReference('R1.03#un-ancre-qui-nexiste-pas', SAMPLE_INDEX);
	assert.equal(result.ok, true);
	assert.match(result.url, /\/$/);
	assert.match(result.note, /ancre/);
});

test('référence totalement inconnue → signalée sans lien', () => {
	const result = resolveReference('R1.99', SAMPLE_INDEX);
	assert.equal(result.ok, false);
	assert.match(result.note, /introuvable/);
	assert.equal(result.url, undefined);
});

test('les références ne deviennent jamais des chemins locaux arbitraires', () => {
	const result = resolveReference('../../etc/passwd', SAMPLE_INDEX);
	assert.equal(result.ok, false);
});

test('resolveReferences sépare liens valides et manquants', () => {
	const { links, missing } = resolveReferences(['R1.03#niveaux-de-cache', 'R1.99', 'R1.06#ensembles'], SAMPLE_INDEX);
	assert.equal(links.length, 2);
	assert.equal(missing.length, 1);
	assert.equal(missing[0].ref, 'R1.99');
});

test('plusieurs références par élément sont toutes résolues', () => {
	const { links } = resolveReferences(['R1.03#lecture', 'R1.06'], SAMPLE_INDEX);
	assert.equal(links.length, 2);
});

test('un cours présent aussi en annexes privilégie les notes du cours', () => {
	const indexBoth = {
		base: '/mes-cours/',
		courses: [
			{ code: 'R1.03', path: 'annexes/r1-03-introduction-a-l-architecture-des-ordinateurs', label: 'R1.03 – Intro', kind: 'annexes', pages: [] },
			{
				code: 'R1.03',
				path: 'cours/r1-03-introduction-a-l-architecture-des-ordinateurs',
				label: 'R1.03 – Intro',
				kind: 'cours',
				pages: [
					{
						id: 'cours/r1-03-introduction-a-l-architecture-des-ordinateurs/4-la-memoire-et-le-cache',
						title: '4 – La mémoire et le cache',
						anchors: [{ slug: 'lecture', text: 'Lecture' }],
					},
				],
			},
		],
	};
	const result = resolveReference('R1.03#lecture', indexBoth);
	assert.equal(result.ok, true);
	assert.match(result.url, /^\/mes-cours\/cours\/r1-03/);
	assert.ok(!result.url.includes('annexes'));
});