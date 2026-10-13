#!/usr/bin/env node
// Usage :
//   npm run activity:link -- activite.json
//   npm run activity:link -- activite.json --base https://example.com/mes-cours/
//   cat activite.json | npm run activity:link --
//
// Lit un JSON conforme au format des activités, le valide, puis affiche
// l'URL complète de la page `/test` avec le paramètre `data` encodé.
//
// Options :
//   --base <url>   préfixe de l'URL (défaut : https://netameow.github.io/mes-cours/)
//   --check        valide seulement (n'affiche pas l'URL) ; code 0 si valide
//   --json         affiche le résultat au format JSON

import { readFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { encodeActivity, encodeActivityUrl } from '../src/lib/activity/codec.mjs';
import { validateActivity } from '../src/lib/activity/schema.mjs';

const DEFAULT_BASE = 'https://netameow.github.io/mes-cours/';

function parseArgs(argv) {
	const args = { files: [], base: DEFAULT_BASE, check: false, json: false };
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (arg === '--check') args.check = true;
		else if (arg === '--json') args.json = true;
		else if (arg === '--base') args.base = argv[++i] ?? DEFAULT_BASE;
		else if (arg === '--') args.files.push(argv[++i] ?? '');
		else if (arg.startsWith('-')) {
			console.error(`Option inconnue : ${arg}`);
			process.exit(2);
		} else args.files.push(arg);
	}
	return args;
}

async function readInput(files) {
	if (files.length > 0 && files[0] !== '') {
		return readFileSync(files[0], 'utf8');
	}
	const stdin = createInterface({ input: process.stdin });
	const lines = [];
	for await (const line of stdin) lines.push(line);
	return lines.join('\n');
}

function normalizeBase(base) {
	return String(base).endsWith('/') ? String(base) : `${String(base)}/`;
}

async function main() {
	const args = parseArgs(process.argv.slice(2));
	let source;
	try {
		source = await readInput(args.files);
	} catch (error) {
		console.error(`Impossible de lire l'entrée : ${error.message}`);
		process.exit(1);
	}

	let raw;
	try {
		raw = JSON.parse(source);
	} catch (error) {
		console.error(`JSON illisible : ${error.message}`);
		process.exit(1);
	}

	const validation = validateActivity(raw);
	if (!validation.ok) {
		for (const error of validation.errors) console.error(`✗ ${error}`);
		if (validation.activity) {
			for (const warning of validation.warnings ?? []) console.warn(`! ${warning}`);
		}
		process.exit(1);
	}
	for (const warning of validation.warnings ?? []) console.warn(`! ${warning}`);

	if (args.check) {
		console.log(`✓ Activité valide (${validation.activity.d.length} éléments, version ${validation.activity.v}).`);
		process.exit(0);
	}

	const data = encodeActivity(validation.activity);
	const base = normalizeBase(args.base);
	const url = `${base}test?data=${data}`;

	if (args.json) {
		console.log(
			JSON.stringify(
				{ data, url, items: validation.activity.d.length, warnings: validation.warnings ?? [] },
				null,
				2,
			),
		);
	} else {
		console.log(url);
		console.error(`${url.length} caractères (limite : ${data.length > 20000 ? '⚠ dépasse 20 000' : 'OK'}).`);
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});