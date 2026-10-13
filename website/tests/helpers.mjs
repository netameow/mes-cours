// Aides partagées pour les tests.

export const SAMPLE_INDEX = {
	base: '/mes-cours/',
	courses: [
		{
			code: 'R1.03',
			path: 'cours/r1-03-introduction-a-l-architecture-des-ordinateurs',
			label: "R1.03 – Introduction à l'architecture des ordinateurs",
			kind: 'cours',
			pages: [
				{
					id: 'cours/r1-03-introduction-a-l-architecture-des-ordinateurs/4-la-memoire-et-le-cache',
					title: '4 – La mémoire et le cache',
					anchors: [
						{ slug: 'version-détaillée', text: 'Version détaillée' },
						{ slug: '4-mémoire-adressable--principe', text: '4. Mémoire adressable : principe' },
						{ slug: 'lecture', text: 'Lecture' },
						{ slug: 'niveaux-de-cache', text: 'Niveaux de cache' },
					],
				},
				{
					id: 'cours/r1-03-introduction-a-l-architecture-des-ordinateurs/r1-03-introduction-a-l-architecture-des-ordinateurs',
					title: "R1.03 – Introduction à l'architecture des ordinateurs",
					anchors: [{ slug: 'introduction', text: 'Introduction' }],
				},
			],
		},
		{
			code: 'R1.06',
			path: 'cours/r1-06-math-discrete',
			label: 'R1.06 – Math Discrète',
			kind: 'cours',
			pages: [
				{
					id: 'cours/r1-06-math-discrete/1-introduction-et-vocabulaire',
					title: '1 – Introduction et vocabulaire',
					anchors: [{ slug: 'ensembles', text: 'Ensembles' }],
				},
			],
		},
	],
};

export const SAMPLE_ACTIVITY = {
	v: 1,
	t: 'Révision — Architecture des ordinateurs',
	d: [
		{ i: 'mc1', k: 'mc', q: 'Quel est le rôle de la RAM ?', o: ['stocker', 'exécuter', 'afficher'], a: 0, e: 'La RAM stocke.', r: ['R1.03#niveaux-de-cache'] },
		{ i: 'mm1', k: 'mm', q: 'Volatiles ?', o: ['RAM', 'ROM', 'DRAM', 'disque'], a: [0, 2] },
		{ i: 'tf1', k: 'tf', q: 'Affirmation.', a: true },
		{ i: 'fill1', k: 'fill', q: 'Ha ! {{1}} et {{2}}.', a: [['oui'], ['non', 'nan']] },
		{ i: 'tx1', k: 'text', q: 'Résoudre $2x+4=10$.', a: ['3', 'x = 3'] },
		{ i: 'mt1', k: 'match', q: 'Associer.', o: ['A', 'B'], a: ['1', '2'] },
		{ i: 'od1', k: 'order', q: 'Ordre croissant.', o: ['a', 'b', 'c'] },
		{ i: 'cd1', k: 'card', q: 'Recto', a: 'Verso' },
	],
};