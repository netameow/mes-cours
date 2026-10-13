import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encodeActivity, decodeActivity, encodeActivityUrl } from '../src/lib/activity/codec.mjs';
import { validateActivity } from '../src/lib/activity/schema.mjs';
import { renderMarkdown } from '../src/lib/activity/markdown.mjs';
import { resolveReferences } from '../src/lib/activity/references.mjs';
import { SAMPLE_INDEX } from './helpers.mjs';

// Un parcours complet : construction d'une activité riche (Markdown, LaTeX,
// références), encodage, décodage, validation, rendu de chaque champ,
// résolution des références.
const richActivity = {
	v: 1,
	t: 'Révision — $\\mathrm{ALU}$ et **mémoire**',
	i: 'Répondez directement. Quelques consignes **en Markdown** et une formule $E=mc^2$.',
	d: [
		{
			i: 'e1',
			k: 'mc',
			q: 'Quelle est la capacité d’une mémoire de $2^{10}$ mots de 8 bits ?',
			o: ['1024 octets', '$2^{10}$ octets', '8192 bits', '$2^{13}$ octets'],
			a: 3,
			e: '$2^{10}\\times 8 = 2^{13}$ bits.',
			r: ['R1.03#3-capacité-et-temps-daccès', 'cours/r1-03-introduction-a-l-architecture-des-ordinateurs/4-la-memoire-et-le-cache#lecture'],
		},
		{
			i: 'e2',
			k: 'mm',
			q: 'Les mémoires **non volatiles** :',
			o: ['ROM', 'RAM', 'Flash', 'Registres'],
			a: [0, 2],
			e: 'La ROM et la Flash conservent les données sans alimentation.',
		},
		{
			i: 'e3',
			k: 'tf',
			q: 'Le cache utilise des politiques LRU ou LFU pour choisir quoi remplacer.',
			a: true,
			r: ['R1.03#gestion-du-cache'],
		},
		{
			i: 'e4',
			k: 'fill',
			q: 'Le mot d’une mémoire à `n` bits peut coder $2^n$ valeurs. Pour $n=4$ : $2^4 = {{1}}$.',
			a: [['16']],
			e: '$2^4=16$.',
		},
		{
			i: 'e5',
			k: 'text',
			q: 'Donner la dérivée de $f(x)=x^3$.',
			a: ['3x^2', '3 x^2', '3x²'],
			e: "$f'(x)=3x^2$.",
			r: ['R1.06'],
		},
		{
			i: 'e6',
			k: 'match',
			q: 'Associer durée :',
			o: ['Mémoire centrale', 'Disque (HDD)', 'SSD'],
			a: ['nanoseconde', '10 ms', '300 µs'],
			e: 'Le disque est le plus lent.',
		},
		{
			i: 'e7',
			k: 'order',
			q: 'Remettre dans l’ordre de la hiérarchie (du plus proche au plus loin du CPU) :',
			o: ['RAM', 'Cache L1', 'Disque', 'Cache L3'],
			e: 'L1 → L3 → RAM → disque.',
		},
		{
			i: 'e8',
			k: 'card',
			q: 'Définir **antimémoire**.',
			a: 'Copie rapide de données récemment utilisées, placée entre le CPU et la mémoire centrale.',
			r: ['R1.03#6-hiérarchie-des-mémoires-et-cache'],
		},
	],
};

test('parcours complet : lien → données → validation → rendu → références', () => {
	const data = encodeActivity(richActivity);
	assert.ok(data.length < 20_000, `URL : ${data.length} caractères`);

	const decoded = decodeActivity(data);
	assert.deepEqual(decoded, richActivity);

	const validation = validateActivity(decoded);
	assert.equal(validation.ok, true, JSON.stringify(validation.errors));
	const activity = validation.activity;

	// Chaque champ textuel se rend sans HTML douteux et avec KaTeX quand présent.
	const stringAnswers = (item) => {
		if (Array.isArray(item.a)) return item.a.flat().filter((v) => typeof v === 'string');
		return typeof item.a === 'string' ? [item.a] : [];
	};
	const fields = [
		activity.t,
		activity.i,
		...activity.d.flatMap((item) => [
			item.q,
			...(item.o ?? []),
			...stringAnswers(item),
			...(item.h ? [item.h] : []),
			...(item.e ? [item.e] : []),
			...(item.m ? [item.m] : []),
		]),
	];
	for (const field of fields) {
		const html = renderMarkdown(field);
		assert.ok(!/<script|<iframe|onerror=|javascript:/i.test(html), `HTML non sûr généré pour : ${field}`);
	}
	assert.match(renderMarkdown(activity.d[0].q), /katex/);
	assert.match(renderMarkdown(activity.t), /katex/);

	// Références réelles résolues.
	const refs = activity.d
		.flatMap((item) => item.r)
		.filter((ref) => typeof ref === 'string');
	assert.ok(refs.length >= 5);
	const { links, missing } = resolveReferences(refs, SAMPLE_INDEX);
	assert.equal(missing.length, 0, JSON.stringify(missing));
	for (const link of links) assert.match(link.url, /^\/mes-cours\//);

	// L'URL générée pointe bien vers /mes-cours/test?data=…
	const full = encodeActivityUrl(activity, 'https://netameow.github.io/mes-cours');
	assert.match(full, /^https:\/\/netameow\.github\.io\/mes-cours\/test\?data=/);
});

test('les éléments `fill` normaux (hors code) restent ouverts', () => {
	const html = renderMarkdown(richActivity.d[3].q);
	assert.match(html, /\{\{1\}\}/); // le marqueur de trou est conservé côté rendu brut
});