// Rendu Markdown + LaTeX des activités.
//
// Le site rend ses cours avec le processeur de Markdown Astro « satteri »
// (au build) auquel il branche deux extensions dans `astro.config.mjs` :
//   - `mathKatex`          : formules LaTeX composées avec KaTeX ;
//   - `obsidianCallouts`   : admonitions `> [!note]` réutilisant le style
//                            `starlight-aside` de Starlight.
//
// Les données des activités arrivent via l'URL et sont donc rendues côté
// client. Pour produire exactement le même rendu (GFM, tableaux, formules
// KaTeX, admonitions, coloration syntaxique), ce module exécute un petit
// pipeline `unified`/`remark`/`rehype` qui :
//   - réutilise KaTeX (constantes et styles du site) via `rehype-katex` ;
//   - réutilise la table des variantes et les icônes d'`obsidian-callouts.mjs`
//     pour produire les mêmes admonitions `starlight-aside`;
//   - n'autorise JAMAIS le HTML brut des auteurs : les balises inconnues sont
//     affichées comme du texte, et les liens sont contrôlés par
//     `rehype-sanitize` (schéma GitHub, protocoles dangereux rejetés) ;
//   - colore les blocs de code avec `rehype-highlight` (lowlight) ;
//   - n'évalue aucun contenu : la sortie est du HTML statique (délimité par
//     une ancre de fin ; aucune exécution).
//
// Le module est utilisable aussi bien dans le navigateur (bundlé par Astro)
// que dans Node (tests, scripts), ce qui le rend testable de façon déterministe.

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import python from 'highlight.js/lib/languages/python';
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import sql from 'highlight.js/lib/languages/sql';
import java from 'highlight.js/lib/languages/java';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';
import pythonRepl from 'highlight.js/lib/languages/python-repl';

import {
	CALL_OUT_VARIANTS,
	CALL_OUT_ICONS,
	CALL_OUT_MARKER,
	DEFAULT_CALLOUT_TITLES,
} from '../obsidian-callouts.mjs';

/**
 * Langages de coloration reconnus (mêmes familles que celles déjà employées
 * dans les cours). Limiter la liste garde le bundle client léger.
 */
const HIGHLIGHT_LANGUAGES = {
	python,
	python3: python,
	'python-repl': pythonRepl,
	javascript,
	js: javascript,
	typescript: javascript,
	css,
	json,
	bash,
	shell: bash,
	c,
	cpp,
	cplusplus: cpp,
	sql,
	java,
	html: xml,
	xml,
	yaml,
	yml: yaml,
};

const HIGHLIGHT_SET = new Set(Object.keys(HIGHLIGHT_LANGUAGES));

/** Max output size for rendered markdown of a single field. */
const MAX_HTML_LENGTH = 200_000;

/**
 * Schéma d'assainissement : remise à plat du schéma par défaut de
 * `rehype-sanitize` en permettant :
 *   - les classes KaTeX `math-inline` / `math-display` (posées par
 *     `remark-rehype` sur les nœuds de mathématique, `rehype-katex` les
 *     consomme ensuite) ;
 *   - les identifiants de section (ancre) sans le préfixe `user-content-`.
 */
const sanSchema = {
	...defaultSchema,
	clobberPrefix: '',
	attributes: {
		...defaultSchema.attributes,
		code: [
			['className', /^language-./],
			['className', 'math-inline'],
			['className', 'math-display'],
		],
	},
};

/** Remplace les blocs `> [!note]` par des `<aside class="starlight-aside…">`. */
function rehypeObsidianCallouts() {
	return (tree) => {
		visit(tree, 'element', (node, index, parent) => {
			if (node.tagName !== 'blockquote') return;
			const firstElementIndex = node.children.findIndex((child) => child.type === 'element');
			if (firstElementIndex === -1) return;
			const first = node.children[firstElementIndex];
			if (first.tagName !== 'p') return;
			const firstText = first.children.find((child) => child.type === 'text');
			if (!firstText) return;
			const match = CALL_OUT_MARKER.exec(firstText.value);
			if (!match) return;

			const variant = CALL_OUT_VARIANTS[match[1].toLowerCase()] ?? 'note';
			const label = DEFAULT_CALLOUT_TITLES[variant];

			// Texte du titre : ce qui suit le marqueur sur la première ligne.
			const afterMarker = firstText.value.slice(match[0].length);
			const titleChildren = [];
			let contentChildren = [];
			let inContent = false;

			// Découpage du premier paragraphe en titre / contenu (retour à la ligne).
			const inlineNodes = [...(afterMarker ? [{ type: 'text', value: afterMarker }] : []), ...first.children.slice(1)];
			for (const inline of inlineNodes) {
				if (inContent) {
					contentChildren.push(inline);
					continue;
				}
				if (inline.type === 'text' && inline.value.includes('\n')) {
					const indexOfNewline = inline.value.indexOf('\n');
					const before = inline.value.slice(0, indexOfNewline);
					const rest = inline.value.slice(indexOfNewline + 1);
					if (before !== '') titleChildren.push({ type: 'text', value: before });
					inContent = true;
					if (rest !== '') contentChildren.push({ type: 'text', value: rest });
					continue;
				}
				titleChildren.push(inline);
			}

			// Quel que soit le découpage, le titre par défaut sert de libellé.
			const titleText = textOf(titleChildren).trim();
			const asideLabel = titleText !== '' ? titleText : label;

			if (titleText === '') {
				titleChildren.push({ type: 'text', value: label });
			}

			// Contenu : reste du premier <p> (s'il y en a) + blocs suivants.
			contentChildren = contentChildren.length > 0 ? [{ type: 'element', tagName: 'p', properties: {}, children: contentChildren }] : [];
			const restBlocks = node.children.slice(firstElementIndex + 1);

			const aside = {
				type: 'element',
				tagName: 'aside',
				properties: { className: [`starlight-aside`, `starlight-aside--${variant}`], ariaLabel: asideLabel },
				children: [
					{
						type: 'element',
						tagName: 'p',
						properties: { className: ['starlight-aside__title'], ariaHidden: 'true' },
						children: [calloutIcon(variant), ...titleChildren],
					},
					{
						type: 'element',
						tagName: 'div',
						properties: { className: ['starlight-aside__content'] },
						children: [...contentChildren, ...restBlocks],
					},
				],
			};

			if (Array.isArray(parent) && typeof index === 'number') {
				parent.splice(index, 1, aside);
			} else if (parent && parent.children) {
				const idx = parent.children.indexOf(node);
				if (idx !== -1) parent.children.splice(idx, 1, aside);
			}
		});
	};
}

function calloutIcon(variant) {
	const iconString = CALL_OUT_ICONS[variant] ?? '';
	return {
		type: 'element',
		tagName: 'svg',
		properties: {
			viewBox: '0 0 24 24',
			width: '16',
			height: '16',
			fill: 'currentColor',
			className: ['starlight-aside__icon'],
		},
		children: parseIconPaths(iconString),
	};
}

/**
 * Transforme les fragments SVG internes d'`obsidian-callouts.mjs`
 * (`<path d="…" fill-rule="…"/>`) en nœuds hast. Ces chaînes sont des
 * constantes du site (pas des données d'activité) : un petit parseur
 * dédié suffit, il évite d'emporter `parse5` dans le bundle client.
 */
function parseIconPaths(iconString) {
	const paths = [];
	const tagRe = /<path\b([^>]*)\/>/g;
	let match;
	while ((match = tagRe.exec(iconString))) {
		const properties = {};
		const attrRe = /([a-zA-Z-]+)="([^"]*)"/g;
		let attr;
		while ((attr = attrRe.exec(match[1]))) {
			properties[attr[1]] = attr[2];
		}
		paths.push({ type: 'element', tagName: 'path', properties, children: [] });
	}
	return paths;
}

function textOf(nodes) {
	let out = '';
	for (const node of nodes) {
		if (node.type === 'text') out += node.value;
		else if (node.type === 'element') out += textOf(node.children ?? []);
		else if (node.type === 'comment') out += `<!--${node.value}-->`;
	}
	return out;
}

/**
 * Convertit les blocs \`\`\`mermaid en conteneurs \`.mermaid\` (le code reste
 * en texte brut). Le SVG est produit côté client par
 * \`src/lib/mermaid-client.mjs\` — exactement comme les pages de cours.
 */
function rehypeMermaid() {
	return (tree) => {
		visit(tree, 'element', (node, index, parent) => {
			if (node.tagName !== 'pre') return;
			const code = node.children.find((child) => child.type === 'element' && child.tagName === 'code');
			if (!code) return;
			const classes = Array.isArray(code.properties?.className) ? code.properties.className : [];
			if (!classes.includes('language-mermaid')) return;

			const source = textOf(code.children ?? []);
			const container = {
				type: 'element',
				tagName: 'div',
				properties: { className: ['mermaid'], dataMermaid: '' },
				children: [{ type: 'text', value: source }],
			};
			if (Array.isArray(parent) && typeof index === 'number') {
				parent.splice(index, 1, container);
			} else if (parent && Array.isArray(parent.children)) {
				const position = parent.children.indexOf(node);
				if (position !== -1) parent.children.splice(position, 1, container);
			}
		});
	};
}

/**
 * Les nœuds `html` du Markdown brut (par ex. `<script>`) sont purement
 * retirés du flux : le HTML des auteurs n'est ni rendu, ni conservé, ni
 * échappé. C'est le comportement le plus sûr.
 */
function dropRawHtml() {
	return undefined;
}

let pipeline;

function getPipeline() {
	if (!pipeline) {
		pipeline = unified()
			.use(remarkParse)
			.use(remarkGfm)
			.use(remarkMath)
			.use(remarkRehype, { allowDangerousHtml: false, handlers: { html: dropRawHtml } })
			.use(rehypeSanitize, sanSchema)
			.use(rehypeObsidianCallouts)
			.use(rehypeMermaid)
			.use(rehypeKatex)
			.use(limitHighlightLanguages)
			.use(rehypeHighlight, { languages: HIGHLIGHT_LANGUAGES })
			.use(rehypeStringify);
	}
	return pipeline;
}

/**
 * Retire la classe `language-*` des blocs non reconnus (mermaid, plain, …)
 * afin que `rehype-highlight` les laisse tels quels plutôt que de lever une
 * erreur sur un langage inconnu.
 */
function limitHighlightLanguages() {
	return (tree) => {
		visit(tree, 'element', (node) => {
			if (node.tagName !== 'code') return;
			const classes = Array.isArray(node.properties?.className) ? node.properties.className : null;
			if (!classes) return;
			const kept = classes.filter((name) => {
				if (typeof name !== 'string') return true;
				if (!name.startsWith('language-')) return true;
				return HIGHLIGHT_SET.has(name.slice('language-'.length));
			});
			node.properties.className = kept;
		});
	};
}

/**
 * Rend du Markdown (avec formules LaTeX, tableaux, admonitions, code) vers
 * une chaîne HTML sûre.
 * @param {string} source
 * @returns {string}
 */
export function renderMarkdown(source) {
	const input = source ?? '';
	const result = getPipeline().processSync(`${input}\n`);
	const html = String(result.value);
	if (html.length > MAX_HTML_LENGTH) {
		throw new Error(`Rendu trop volumineux (${html.length} caractères).`);
	}
	return html;
}