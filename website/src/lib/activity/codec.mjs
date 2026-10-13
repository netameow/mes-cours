// Codec pour les activités partageables par URL.
//
// Algorithme (dans cet ordre, à la génération) :
//   1. Sérialiser l'activité en JSON (UTF-8).
//   2. Compresser les octets UTF-8 avec DEFLATE brut (RFC 1951), niveau maximal.
//   3. Encoder le flux DEFLATE en Base64 URL-safe, sans padding (`A-Za-z0-9-_`).
//
// À la lecture, on inverse ces opérations : Base64URL → DEFLATE brut → UTF-8 → JSON.
//
// Ce module est volontairement utilisable à la fois côté navigateur (bundlé par
// Astro) et côté Node (tests, outil de génération). La compression utilise
// `fflate`, une implémentation pure JavaScript de DEFLATE, disponible sur les
// deux plateformes, ce qui évite de dépendre de `CompressionStream`/`DecompressionStream`
// (indisponibles dans certains navigateurs). Le flux produit est un DEFLATE brut
// valide, décompressible avec n'importe quelle bibliothèque standard (zlib, pako,
// Python `zlib` avec `wbits=-15`, …).

import { deflateSync, Inflate } from 'fflate';

export const VERSION = 1;

/** Limites de robustesse (voir aussi `schema.mjs`). */
export const LIMITS = {
	/** Longueur maximale (en caractères) du paramètre `data` de l'URL. */
	maxUrlLength: 20000,
	/** Taille maximale (en octets) des données compressées. */
	maxCompressedBytes: 32768,
	/** Taille maximale (en octets) des données décompressées. */
	maxDecompressedBytes: 262_144,
	/** Nombre maximal d'éléments d'une activité. */
	maxItems: 200,
	/** Nombre maximal d'options / paires par élément. */
	maxOptions: 64,
	/** Nombre maximal de références par élément. */
	maxReferences: 16,
	/** Profondeur maximale admise dans le JSON (anti données profondément imbriquées). */
	maxDepth: 16,
};

const B64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

export function bytesToBase64Url(bytes) {
	let out = '';
	for (let i = 0; i < bytes.length; i += 3) {
		const b0 = bytes[i];
		const b1 = i + 1 < bytes.length ? bytes[i + 1] : 0;
		const b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
		out += B64_ALPHABET[b0 >> 2];
		out += B64_ALPHABET[((b0 & 0x03) << 4) | (b1 >> 4)];
		if (i + 1 < bytes.length) out += B64_ALPHABET[((b1 & 0x0f) << 2) | (b2 >> 6)];
		if (i + 2 < bytes.length) out += B64_ALPHABET[b2 & 0x3f];
	}
	return out;
}

export function base64UrlToBytes(value) {
	if (typeof value !== 'string' || value.length === 0) {
		throw new Error('Chaîne Base64 vide.');
	}
	if (!/^[A-Za-z0-9_-]+$/.test(value)) {
		throw new Error('Caractères invalides dans la charge encodée (Base64 URL attendu).');
	}
	const len = value.length;
	const remainder = len % 4;
	// Sans '=' (rejeté par la regex), une longueur mod 4 de 2 → 1 octet,
	// 3 → 2 octets, 0 → complet. Une longueur mod 4 de 1 est invalide.
	if (remainder === 1) {
		throw new Error('Longueur de charge Base64 invalide.');
	}
	const out = new Uint8Array(((len * 3) / 4) | 0);
	let index = 0;
	for (let i = 0; i < len; i += 4) {
		const c0 = charToBits(value[i]);
		const c1 = charToBits(value[i + 1]);
		const c2 = i + 2 < len ? charToBits(value[i + 2]) : 0;
		const c3 = i + 3 < len ? charToBits(value[i + 3]) : 0;
		if (c0 < 0 || c1 < 0) throw new Error('Caractère Base64 invalide.');
		if (i + 2 < len && c2 < 0) throw new Error('Caractère Base64 invalide.');
		if (i + 3 < len && c3 < 0) throw new Error('Caractère Base64 invalide.');
		out[index++] = (c0 << 2) | (c1 >> 4);
		if (i + 2 < len) out[index++] = ((c1 & 0x0f) << 4) | (c2 >> 2);
		if (i + 3 < len) out[index++] = ((c2 & 0x03) << 6) | c3;
	}
	return out;
}

function charToBits(char) {
	const code = char.charCodeAt(0);
	if (code >= 65 && code <= 90) return code - 65;
	if (code >= 97 && code <= 122) return code - 97 + 26;
	if (code >= 48 && code <= 57) return code - 48 + 52;
	if (char === '-') return 62;
	if (char === '_') return 63;
	return -1;
}

function inflateRawLimited(data, outputLimit) {
	const chunks = [];
	let size = 0;
	let overLimit = null;
	const inflater = new Inflate((chunk) => {
		size += chunk.length;
		if (size > outputLimit) {
			overLimit = new Error(
				`Données décompressées trop volumineuses (limite ${outputLimit} octets dépassée).`,
			);
			inflater.terminate();
			return;
		}
		chunks.push(chunk);
	});
	try {
		inflater.push(data, true);
	} catch (error) {
		if (overLimit) throw overLimit;
		throw new Error('Données compressées illisibles (lien corrompu ou tronqué).');
	}
	if (overLimit) throw overLimit;
	return concat(chunks, size);
}

function concat(chunks, size) {
	const out = new Uint8Array(size);
	let offset = 0;
	for (const chunk of chunks) {
		out.set(chunk, offset);
		offset += chunk.length;
	}
	return out;
}

function encodeUtf8(text) {
	if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(text);
	// Repli pour les environnements sans TextEncoder.
	const bytes = [];
	for (const char of text) {
		let cp = char.codePointAt(0);
		if (cp < 0x80) bytes.push(cp);
		else if (cp < 0x800) {
			bytes.push(0xc0 | (cp >> 6), 0x80 | (cp & 0x3f));
		} else if (cp < 0x10000) {
			bytes.push(0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f));
		} else {
			bytes.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3f), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f));
		}
	}
	return Uint8Array.from(bytes);
}

function decodeUtf8(bytes) {
	if (typeof TextDecoder !== 'undefined') return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
	// Repli minimal (les plateformes cibles ont TextDecoder).
	let out = '';
	let i = 0;
	while (i < bytes.length) {
		const b0 = bytes[i++];
		let cp = b0;
		let extra = 0;
		if ((b0 & 0x80) === 0) {
			out += String.fromCodePoint(b0);
			continue;
		} else if ((b0 & 0xe0) === 0xc0) {
			cp = b0 & 0x1f;
			extra = 1;
		} else if ((b0 & 0xf0) === 0xe0) {
			cp = b0 & 0x0f;
			extra = 2;
		} else if ((b0 & 0xf8) === 0xf0) {
			cp = b0 & 0x07;
			extra = 3;
		} else {
			throw new Error('Octet UTF-8 invalide.');
		}
		if (i + extra > bytes.length) throw new Error('Séquence UTF-8 tronquée.');
		for (let j = 0; j < extra; j++) {
			const b = bytes[i++];
			if ((b & 0xc0) !== 0x80) throw new Error('Octet de continuation UTF-8 invalide.');
			cp = (cp << 6) | (b & 0x3f);
		}
		out += String.fromCodePoint(cp);
	}
	return out;
}

/** Sérialise une activité (objet JSON compact) en chaîne pour le paramètre `data`. */
export function encodeActivity(activity) {
	if (activity === undefined || activity === null || typeof activity !== 'object') {
		throw new TypeError('Une activité est un objet JSON.');
	}
	const json = JSON.stringify(activity);
	const utf8 = encodeUtf8(json);
	const compressed = deflateSync(utf8, { level: 9 });
	return bytesToBase64Url(compressed);
}

/**
 * Décode le paramètre `data` d'une URL en objet JSON.
 * Vérifie les limites de taille avant et pendant la décompression.
 */
export function decodeActivity(data) {
	if (typeof data !== 'string') {
		throw new Error("Le paramètre `data` est manquant ou n'est pas une chaîne.");
	}
	if (data.length > LIMITS.maxUrlLength) {
		throw new Error(
			`Lien trop long : ${data.length} caractères, limite ${LIMITS.maxUrlLength}. L'activité doit être allégée.`,
		);
	}
	const compressed = base64UrlToBytes(data);
	if (compressed.length > LIMITS.maxCompressedBytes) {
		throw new Error('Charge compressée trop volumineuse.');
	}
	const raw = inflateRawLimited(compressed, LIMITS.maxDecompressedBytes);
	let json;
	try {
		json = decodeUtf8(raw);
	} catch (error) {
		throw new Error(`Contenu illisible : ${error.message}`);
	}
	let parsed;
	try {
		parsed = JSON.parse(json);
	} catch (error) {
		throw new Error(`Données non valides (JSON illisible : ${error.message}).`);
	}
	return parsed;
}

/** Encode un objet en URL complète vers la page `/test`. */
export function encodeActivityUrl(activity, baseUrl = 'https://netameow.github.io/mes-cours/') {
	const data = encodeActivity(activity);
	const base = String(baseUrl).endsWith('/') ? String(baseUrl) : `${String(baseUrl)}/`;
	return `${base}test?data=${data}`;
}
