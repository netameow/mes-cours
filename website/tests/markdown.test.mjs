import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderMarkdown } from '../src/lib/activity/markdown.mjs';

test('Markdown de base : emphase, gras, code, listes, liens', () => {
	const html = renderMarkdown('Un **gras**, un _italique_, du `code`.\n\n- a\n- b\n\n[un lien](https://example.com)');
	assert.match(html, /<strong>gras<\/strong>/);
	assert.match(html, /<em>italique<\/em>/);
	assert.match(html, /<code>code<\/code>/);
	assert.match(html, /<ul>[\s\S]*<li>a<\/li>/);
	assert.match(html, /<a href="https:\/\/example\.com">un lien<\/a>/);
});

test('tableaux GFM', () => {
	const html = renderMarkdown('| A | B |\n| - | - |\n| 1 | 2 |\n');
	assert.match(html, /<table>/);
	assert.match(html, /<th>A<\/th>/);
	assert.match(html, /<td>1<\/td>/);
});

test('blocs de code avec coloration', () => {
	const html = renderMarkdown('```python\ndef f(x):\n    return x + 1\n```');
	assert.match(html, /<pre><code class="[^"]*language-python"/);
	assert.match(html, /hljs-keyword/);
});

test('diagrammes Mermaid → conteneur .mermaid (rendu SVG côté client)', () => {
	const html = renderMarkdown('```mermaid\nflowchart LR\n    A --> B\n```');
	assert.match(html, /<div class="mermaid" data-mermaid/);
	assert.match(html, /flowchart LR/);
	assert.ok(!html.includes('language-mermaid'), 'le bloc mermaid n’est pas coloré comme du code');
});

test('formules LaTeX inline et en bloc sont composées par KaTeX', () => {
	const html = renderMarkdown('Du texte $x^2 + 1$.\n\n$$\ny = 2x\n$$\n');
	assert.match(html, /<span class="katex">/);
	assert.match(html, /katex-mathml/m);
	assert.match(html, /katex-display/);
});

test('markdown contenu dans options et explications', () => {
	const html = renderMarkdown('- Option $\\frac{1}{2}$\n- **Option grasse**\n\nPour aller plus loin : [page](https://ex.org).');
	assert.match(html, /katex/);
	assert.match(html, /<strong>Option grasse<\/strong>/);
	assert.match(html, /href="https:\/\/ex\.org"/);
});

test('admonitions Obsidian → starlight-aside', () => {
	const html = renderMarkdown('> [!tip]\n> Une astuce **pratique**.');
	assert.match(html, /<aside class="starlight-aside starlight-aside--tip"/);
	assert.match(html, /starlight-aside__icon/);
	assert.match(html, /Une astuce <strong>pratique<\/strong>/);
});

test('admonition avec titre personnalisé et variante danger', () => {
	const html = renderMarkdown('> [!danger] Gare\n> Texte.');
	assert.match(html, /starlight-aside--danger/);
	assert.match(html, /Gare/);
});

test('le HTML brut de l’auteur n’est jamais exécutable', () => {
	const html = renderMarkdown('<script>alert(1)</script> et <img src=x onerror=alert(1)>');
	assert.ok(!/<script/.test(html), 'aucune balise script');
	assert.ok(!/<img/.test(html), 'aucune balise image');
	assert.ok(!/onerror/.test(html), 'aucun gestionnaire onerror');
	assert.ok(!/alert/.test(html), 'aucun code exécutable conservé');
});

test('les URL dangereuses des liens sont neutralisées', () => {
	const html = renderMarkdown('[triche](javascript:alert(1)) et [ok](https://exemple.org)');
	assert.ok(!/javascript:/i.test(html));
	assert.match(html, /href="https:\/\/exemple\.org"/);
});

test('le contenu est du HTML statique (pas d’exécution)', () => {
	const html = renderMarkdown('texte ordinaire `var x = 1;`');
	assert.ok(!/<script/.test(html));
	assert.match(html, /texte ordinaire/);
});

test('lignes citées (blockquote) simples restent des citations', () => {
	const html = renderMarkdown('> Une simple citation.');
	assert.match(html, /<blockquote>/);
	assert.match(html, /Une simple citation\./);
});

test('maths dans une option et dans l’explication', () => {
	const html = renderMarkdown('$f\'(x)=2x$\n\n$$\n\\frac{a}{b}\n$$\n');
	assert.match(html, /katex-display/);
	assert.match(html, /2x/);
});