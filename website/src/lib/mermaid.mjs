// Rendu des diagrammes Mermaid des pages de cours.
//
// Les blocs de code ```mermaid de la voûte sont convertis ici en conteneurs
// `.mermaid` : le texte brut du diagramme y est conservé (il est échappé
// automatiquement lors de la sérialisation HTML, puis relu tel quel par
// Mermaid dans le DOM). Le rendu SVG, lui, est fait côté client par
// `mermaid-client.mjs`, chargé à la demande et seulement sur les pages qui
// contiennent réellement un diagramme.

/** Langages de bloc reconnus comme des diagrammes Mermaid. */
const DIAGRAM_LANGS = new Set(['mermaid']);

export const mermaidDiagrams = {
	name: 'mermaid-diagrams',
	code(node) {
		const lang = String(node.lang ?? '')
			.trim()
			.split(/\s+/)[0]
			.toLowerCase();
		if (!DIAGRAM_LANGS.has(lang)) return undefined;

		return {
			type: 'paragraph',
			data: {
				hName: 'div',
				hProperties: { className: ['mermaid'], 'data-mermaid': '' },
			},
			children: [{ type: 'text', value: node.value }],
		};
	},
};
