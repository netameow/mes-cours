import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
	encodeActivity,
	decodeActivity,
	encodeActivityUrl,
	bytesToBase64Url,
	base64UrlToBytes,
	LIMITS,
} from '../src/lib/activity/codec.mjs';

test('round-trip : encode → decode donne une activité identique', () => {
	const activity = { v: 1, t: 'Test', d: [{ i: 'a', k: 'mc', q: 'q', o: ['x', 'y'], a: 0 }] };
	const data = encodeActivity(activity);
	assert.equal(decodeActivity(data).t, 'Test');
	assert.deepEqual(decodeActivity(data), activity);
});

test('round-trip : unicodes, accents et emoji', () => {
	const activity = { v: 1, t: 'Éléments à vérifier 😀 café € π — “citroën”', d: [] };
	const data = encodeActivity(activity);
	assert.equal(decodeActivity(data).t, activity.t);
});

test('round-trip : caractères réservés d’URL et guillemets', () => {
	const text = 'a b c + / ? % & # = " \' ; : @ [ ] < > { } | \\ ^ ~ ! $ ( ) ™';
	const activity = { v: 1, t: text, d: [] };
	const data = encodeActivity(activity);
	assert.equal(/^[A-Za-z0-9_-]+$/.test(data), true);
	assert.equal(decodeActivity(data).t, text);
});

test('la charge encodée respecte l’alphabet Base64URL sans padding', () => {
	const data = encodeActivity({ v: 1, d: [] });
	assert.match(data, /^[A-Za-z0-9_-]+$/);
	assert.ok(!data.includes('='));
});

test('base64 URL : conversion aller-retour', () => {
	const bytes = Uint8Array.from([0, 1, 2, 3, 250, 251, 252, 253, 254, 255]);
	const b64 = bytesToBase64Url(bytes);
	assert.equal(b64, 'AAECA_r7_P3-_w');
	assert.deepEqual(base64UrlToBytes(b64), bytes);
});

test('base64URL : rejette les caractères invalides', () => {
	assert.throws(() => base64UrlToBytes('abc+'), /invalide|invalides/);
	assert.throws(() => base64UrlToBytes('a'), /Longueur|invalide/);
});

test('données JSON illisibles → erreur claire', async () => {
	const { deflateSync } = await import('fflate');
	const compressed = deflateSync(new TextEncoder().encode('ceci nest pas du json 123'));
	const data = bytesToBase64Url(compressed);
	assert.throws(() => decodeActivity(data), /JSON illisible|données non valides/i);
});

test('lien tronqué / corrompu → erreur lisible', async () => {
	const { deflateSync } = await import('fflate');
	const full = bytesToBase64Url(deflateSync(new TextEncoder().encode('une activité très longue …')));
	const truncated = full.slice(0, 17);
	assert.throws(() => decodeActivity(truncated), /tronqué|corrompu|invalide|illisible/i);
});

test('lien trop long → erreur « lien trop long »', () => {
	assert.throws(() => decodeActivity('A'.repeat(LIMITS.maxUrlLength + 1)), /Lien trop long/);
});

test('décompression excessive (zip bomb) → refusée', () => {
	// Un JSON très répétitif compressé très fort (3 Ko encodé) se décompresse
	// en ~400 000 octets, au-delà de la limite définie.
	const huge = { v: 1, t: 'a'.repeat(400_000), d: [] };
	const data = encodeActivity(huge);
	assert.ok(data.length < 10_000, `URL trop longue pour ce test : ${data.length}`);
	assert.throws(() => decodeActivity(data), /volumineuses/);
});

test('encodeActivityUrl construit une URL sous le préfixe donné', () => {
	const url = encodeActivityUrl({ v: 1, d: [] }, 'https://example.com/mes-cours/');
	assert.match(url, /^https:\/\/example\.com\/mes-cours\/test\?data=/);
	const urlNoSlash = encodeActivityUrl({ v: 1, d: [] }, 'https://example.com/mes-cours');
	assert.match(urlNoSlash, /^https:\/\/example\.com\/mes-cours\/test\?data=/);
});