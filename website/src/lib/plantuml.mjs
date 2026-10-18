// Rendu des diagrammes PlantUML des pages de cours.
//
// Les blocs de code ```plantuml de la voûte sont convertis ici en images :
// leur source est encodée localement (deflate + base64, via
// `plantuml-encoder`) puis servie par le serveur public PlantUML, qui calcule
// le SVG à la volée. Aucun Java n'est requis ; il faut juste une connexion à
// `plantuml.com` à l'affichage. Contrairement à Mermaid, il n'existe pas de
// moteur de rendu PlantUML pur JavaScript.
import { encode } from 'plantuml-encoder';

/** Langages de bloc reconnus comme des diagrammes PlantUML. */
const LANGS = new Set(['plantuml', 'puml', 'pu']);
/** URL du serveur PlantUML public (rendu en SVG). */
const SERVER = 'https://www.plantuml.com/plantuml/svg/';

export const plantumlBlocks = {
	name: 'plantuml-blocks',
	code(node) {
		const lang = String(node.lang ?? '')
			.trim()
			.split(/\s+/)[0]
			.toLowerCase();
		if (!LANGS.has(lang)) return undefined;

		const source = String(node.value ?? '').trim();
		// Un bloc sans `@start…` n'est pas un diagramme valide : on le laisse tel quel.
		if (!/^@start/i.test(source)) return undefined;

		return {
			type: 'html',
			value: `<div class="plantuml"><img src="${SERVER}${encode(source)}" alt="Diagramme PlantUML" loading="lazy" /></div>`,
		};
	},
};