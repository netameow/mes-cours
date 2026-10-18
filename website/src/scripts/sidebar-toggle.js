// Bascule des panneaux latéraux (navigation gauche + table des matières droite)
// sur ordinateur. Le bouton est ajouté dynamiquement au coin bas-droit et
// l'état est mémorisé dans `localStorage` (clé `sidebars-hidden`).
//
// L'application de l'état avant le premier rendu est faite par un petit script
// inline dans `Head.astro` afin d'éviter tout clignotement des panneaux.

/** Clé de `localStorage`. */
const KEY = 'sidebars-hidden';

const root = document.documentElement;

// On ne propose la bascule que sur les pages qui ont au moins une sidebar.
if (root.hasAttribute('data-has-sidebar')) {
	const button = document.createElement('button');
	button.type = 'button';
	button.className = 'sidebar-toggle';
	button.title = 'Afficher / masquer les panneaux latéraux';
	button.setAttribute('aria-label', 'Afficher ou masquer les panneaux latéraux');
	button.innerHTML =
		'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /></svg>';

	const sync = () => {
		const hidden = root.classList.contains(KEY);
		button.setAttribute('aria-pressed', hidden ? 'true' : 'false');
	};

	sync();

	button.addEventListener('click', () => {
		const hidden = root.classList.toggle(KEY);
		if (hidden) localStorage.setItem(KEY, '1');
		else localStorage.removeItem(KEY);
		sync();
	});

	document.body.append(button);
}
