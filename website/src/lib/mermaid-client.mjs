// Rendu côté client des diagrammes Mermaid des cours.
//
// Le module `mermaid.mjs` transforme les blocs ```mermaid en conteneurs
// `.mermaid` (le code du diagramme y figure en texte). Ce module remplace
// ensuite chaque conteneur par le SVG correspondant, et le re-rend lorsque le
// thème clair/sombre de Starlight change.
//
// Mermaid est importé dynamiquement : les pages sans diagramme ne paient ni le
// téléchargement ni l'analyse du paquet.

const DIAGRAM_SELECTOR = '.mermaid';

/** Code source de chaque diagramme, conservé pour pouvoir re-rendre (thème). */
const sourceByElement = new WeakMap();

/** Promesse de chargement de Mermaid, partagée entre les rendus. */
let mermaidPromise;

/** Identifiant monotone, requis unique à chaque appel de `mermaid.render`. */
let diagramCounter = 0;

/**
 * Jeton de rendu : incrémenté à chaque (re)rendu pour ignorer un rendu devenu
 * obsolète par un changement de thème survenu entre-temps.
 */
let renderToken = 0;

function loadMermaid() {
	mermaidPromise ??= import('mermaid').then((module) => module.default);
	return mermaidPromise;
}

/** Thème de diagramme correspondant au thème courant de Starlight. */
function currentTheme() {
	return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'default';
}

export async function renderDiagrams() {
	const diagrams = [...document.querySelectorAll(DIAGRAM_SELECTOR)];
	if (diagrams.length === 0) return;

	const token = ++renderToken;
	const mermaid = await loadMermaid();
	if (token !== renderToken) return;

	mermaid.initialize({
		startOnLoad: false,
		securityLevel: 'strict',
		theme: currentTheme(),
	});

	for (const element of diagrams) {
		let source = sourceByElement.get(element);
		if (source === undefined) {
			source = element.textContent ?? '';
			sourceByElement.set(element, source);
		}

		element.classList.remove('mermaid-rendered', 'mermaid-error');
		try {
			const { svg, bindFunctions } = await mermaid.render(`mermaid-${++diagramCounter}`, source);
			if (token !== renderToken) return;
			element.innerHTML = svg;
			element.classList.add('mermaid-rendered');
			bindFunctions?.(element);
		} catch (error) {
			if (token !== renderToken) return;
			element.textContent = source;
			element.classList.add('mermaid-error');
			console.error('Diagramme Mermaid invalide', error);
		}
	}
}

/**
 * Met en place le rendu des diagrammes de la page courante et surveille les
 * changements de thème pour les re-rendre.
 */
export function setupMermaid() {
	const render = () => {
		renderDiagrams().catch((error) => console.error('Rendu Mermaid impossible', error));
	};

	render();

	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type === 'attributes' && mutation.target === document.documentElement) {
				render();
				return;
			}
		}
	});
	observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
