// Documentation du système d'activités à destination des LLM.
// Le texte complet est injecté dans `llms.txt` (voir `src/pages/llms.txt.ts`)
// et de nouvelles pièces sont publiées sur :
//   - `activity-index.json` : index des cours, pages et ancres réelles.
//   - `scripts/activity-link.mjs` : générateur de lien local.

/**
 * Construit la documentation Markdown du système d'activités.
 * @param {object} options
 * @param {string} options.base            URL de base du site, ex. « https://netameow.github.io/mes-cours/ »
 * @param {string} options.exampleUrl      Exemple de lien déjà encodé.
 * @param {string} options.exampleJson     JSON compact de l'exemple (pour lisibilité).
 * @param {string} options.indexUrl        URL absolue de l'index des ancres.
 */
export function activitySystemDoc(options) {
	const { base, exampleUrl, exampleJson, indexUrl } = options;
	const slashless = base.endsWith('/') ? base.slice(0, -1) : base;
	const page = `${slashless}/test`;
	const pageWithData = `${page}?data=…`;

	return `
## Activités pédagogiques partagées par lien

Le site permet de partager des **activités interactives** (quiz, flashcards,
exercices) par simple URL. Une activité est un objet JSON versionné, compressé
puis encodé dans le paramètre \`data\` de la page \`${pageWithData}\`.

### 1. Objectif

Un outil (un LLM, un enseignant) génère un JSON décrivant l'activité,
l'encode avec l'algorithme ci-dessous, et obtient une URL partageable.
La page HTML fait tout côté client : décodage, validation, rendu Markdown +
LaTeX, correction, navigation, bilan. **Aucun serveur ni compte n'est requis.**

### 2. URL publique

\`\`\`
${pageWithData}
\`\`\`

Le site est hébergé sous le préfixe \`/mes-cours/\`. Un lien invalide,
tronqué ou trop long affiche une erreur explicative.

### 3. Format JSON versionné (clés compactes)

Top-level :

| Clé | Rôle | Requis |
| --- | --- | --- |
| \`v\` | Version du format (entier, actuellement **1**) | oui |
| \`t\` | Titre de l’activité (Markdown court) | non |
| \`i\` | Consignes globales (Markdown) | non |
| \`d\` | Liste ordonnée des éléments | oui (peut être vide) |

Chaque élément de \`d\` :

| Clé | Rôle | Requis |
| --- | --- | --- |
| \`i\` | Identifiant unique (chaîne) | non (généré) |
| \`k\` | Type d’activité (voir §4) | oui |
| \`q\` | Énoncé / contenu principal (Markdown) | oui\* |
| \`o\` | Options (liste de chaînes Markdown) | selon type |
| \`a\` | Réponse / données de correction | selon type |
| \`e\` | Explication après validation (Markdown) | non |
| \`h\` | Indice (Markdown, affiché sur demande) | non |
| \`r\` | Références vers les cours (liste de chaînes) | non |
| \`m\` | Réponse modèle pour \`text\` en auto-évaluation | non |

\* \`fill\` affiche \`q\` avec des trous ; \`card\` utilise \`q\` comme recto.

Règles générales de validation :

- \`v\` inconnu → message d’erreur clair (jamais de plantage).
- \`i\` dupliqué → rejeté.
- Type \`k\` inconnu → rejeté.
- Trop d’éléments (200 max), trop d’options (64 max), trop de références
  (16 max), chaîne > 10 000 caractères → rejeté.
- Les identifiants peuvent être omis : ils sont générés (\`item-1\`, …).

### 4. Types d’activités

| Type | Sens | \`o\` | \`a\` | Correction |
| --- | --- | --- | --- | --- |
| \`mc\` | Choix unique | oui (≥ 2) | entier = indice de la bonne option | strict |
| \`mm\` | Choix multiples | oui (≥ 2) | liste d’entiers (les bons indices) | ensemble exact |
| \`tf\` | Vrai / faux | non | booléen (\`true\` = Vrai) | strict |
| \`fill\` | Texte à compléter | non | liste de listes : réponses acceptées par trou | par trou, tolérante |
| \`text\` | Réponse libre | non | liste de réponses acceptées (\`a\`) **ou** réponse modèle (\`m\`) | déterministe ou auto-évaluation |
| \`match\` | Association | liste de gauche | liste de droite alignée (\`a[i]\` correspond à \`o[i]\`) | toutes les paires |
| \`order\` | Mise en ordre | liste **dans l’ordre correct** | aucun | séquence complète |
| \`card\` | Flashcard | non | verso (Markdown) | auto-évaluation |

Exemples :

\`\`\`json
{ "v": 1, "t": "Exemples", "d": [
  { "i": "m1", "k": "mc", "q": "Quel est le rôle de la RAM ?",
    "o": ["Stocker temporairement", "Exécuter", "Afficher"], "a": 0,
    "e": "La RAM conserve temporairement les données.", "h": "Relisez le §2 du cours." },
  { "i": "m2", "k": "mm", "q": "Mémoires volatiles ?",
    "o": ["RAM", "ROM", "DRAM", "Disque"], "a": [0, 2] },
  { "i": "m3", "k": "tf", "q": "La ROM est volatile.", "a": false },
  { "i": "m4", "k": "fill",
    "q": "Un octet vaut {{1}} bits, et une mémoire de 2¹⁰ mots de 8 bits stocke {{2}} octets.",
    "a": [["8", "huit"], ["8192", "8 192"]] },
  { "i": "m5", "k": "text", "q": "Résoudre $2x + 4 = 10$.",
    "a": ["3", "x = 3", "x=3"], "e": "On retire 4 puis on divise par 2." },
  { "i": "m6", "k": "text", "q": "Expliquer le cache en une phrase.",
    "m": "Une petite mémoire très rapide qui copie les données récemment utilisées." },
  { "i": "m7", "k": "match", "q": "Associer :",
    "o": ["Registres", "RAM"], "a": ["Quelques octets, très rapides", "Quelques Go"] },
  { "i": "m8", "k": "order", "q": "Ordre croissant de capacité :",
    "o": ["Registres", "Cache", "RAM", "Mémoire de masse"] },
  { "i": "m9", "k": "card", "q": "Définir **mémoire volatile**.",
    "a": "Une mémoire qui perd ses données sans alimentation (ex. la RAM)." }
] }
\`\`\`

### 5. Règles de correction

La correction est **déterministe** (pas de modèle externe) :

- \`mc\`, \`tf\` : égalité stricte.
- \`mm\` : les indices choisis sont exactement ceux de \`a\` (ordre ignoré).
- \`fill\` / \`text\` : une réponse est acceptée si sa **normalisation**
  correspond à au moins une réponse admise. Normalisation :
  1. suppression des espaces de début/fin ;
  2. espaces multiples ramenés à un seul, casse ignorée ;
  3. accents ignorés (normalisation NFD) ;
  4. ponctuation de début/fin retirée (\`"…"\`, \`!\`, \`?\`, virgules, points…).
  Exemples : \`"Café !"\` ≈ \`cafe\`, \`x = 3\` ≈ \`x=3\`, \`"Oui"\` ≈ \`oui\`.
- \`match\` : toutes les paires doivent être correctes (score partiel possible).
- \`order\` : toute la séquence exacte (score partiel possible).
- \`text\` avec \`m\` uniquement, et \`card\` : **auto-évaluation** par l’utilisateur ;
  l’interface affiche la réponse attendue après validation.

**Ne jamais afficher \`e\`, \`a\`, \`m\`, ou l’ancre de retour avant** la
validation (ou avant que l’utilisateur ait explicitement retourné la carte).
\`h\` (indice) ne se révèle que sur demande.

### 6. Markdown et LaTeX

Tous les champs textuels (\`t\`, \`i\`, \`q\`, \`o\`, \`e\`, \`h\`, \`m\`,
recto/verso des flashcards, éléments de \`match\`/\`order\`) acceptent le
même Markdown et LaTeX que les cours :

- titres, paragraphes, **gras**, *emphase*, listes, citations ;
- liens ; tableaux (GFM) ; code inline \`\`\`code\`\`\` ; blocs de code avec
  coloration (\`\`\`python…\`\`\`) ;
- formules KaTeX : inline \`$x^2$\` et en bloc \`$$ ... $$\` (sur leurs
  propres lignes) ;
- **diagrammes Mermaid** : blocs \`\`\`mermaid\`\`\` (\`flowchart\`, \`sequenceDiagram\`,
  \`classDiagram\`, …) rendus en SVG côté client, comme dans les cours ;
- admonitions Obsidian : \`> [!note]\`, \`[!tip]\`, \`[!caution]\`, \`[!danger]\`
  (mêmes styles que les cours).

Tout HTML brut saisi par l’auteur est **retiré** (pas de \`<script>\` ni
d'attributs \`onerror\`), les URLs de type \`javascript:\` sont supprimées.

### 7. Références vers les cours (\`r\`)

Chaque référence désigne une page et, éventuellement, une ancre :

- \`R1.03\` → page principale du cours R1.03 ;
- \`R1.03#4-mémoire-adressable--principe\` → 1re page du cours contenant
  cette ancre ;
- \`cours/r1-03-introduction-a-l-architecture-des-ordinateurs/4-la-memoire-et-le-cache#lecture\`
  → page et ancre exactes.

Règles des ancres (identiques au rendu des cours, \`github-slugger\`) :
minuscules, **accents conservés**, ponctuation supprimée, espaces → tirets.
Ex. « 4. Mémoire adressable : principe » → \`#4-mémoire-adressable--principe\`.
La comparaison des ancres ignore accents/casse/ponctuation : \`#memoire-centrale\`
<-> \`#mémoire-centrale\`.

Les références **font toujours un lien** vers l’URL réelle sous \`/mes-cours/\` ;
une référence inexistante est simplement signalée (jamais un chemin de fichier,
jamais une requête arbitraire). Plusieurs références par élément sont permises.

**Index exploitable** : \`${indexUrl}\` (JSON : cours, codes, pages, ancres).
On peut aussi lire \`activity-index.json\` à la racine du site.

### 8. Algorithme exact de compression et d’encodage

Étapes de **génération** (le LLM peut déléguer au script local §10) :

1. \`JSON.stringify\` de l’activité ⇒ texte UTF-8 ;
2. **DEFLATE brut** (RFC 1951) des octets UTF-8 (pas de l’enveloppe
   zlib/gzip), niveau maximal ;
3. **Base64 URL-safe sans padding** du flux DEFLATE (\`A-Za-z0-9-_\`) ;
4. URL finale : \`${page}?data=<payload>\`.

Étapes de **lecture** (faîtes par la page) : Base64URL → DEFLATE → UTF-8 → JSON
→ validation. Exemple équivalent en Python :

\`\`\`python
import json, zlib, base64

data = json.dumps(activity, ensure_ascii=False).encode("utf-8")
raw = zlib.compressobj(level=9, wbits=-15)   # wbits=-15 ⇒ DEFLATE brut
payload = raw.compress(data) + raw.flush()
url_payload = base64.urlsafe_b64encode(payload).rstrip(b"=").decode()
url = "https://netameow.github.io/mes-cours/test?data=" + url_payload
\`\`\`

### 9. Limites de taille

| Ressource | Limite |
| --- | --- |
| Longueur du paramètre \`data\` | 20 000 caractères |
| Données décompressées | 256 Ko |
| Éléments (\`d\`) | 200 |
| Options / paires par élément | 64 |
| Références par élément | 16 |
| Chaque chaîne | 10 000 caractères |
| Profondeur JSON | 16 |

Au-delà : message d’erreur (lien trop long, charge trop volumineuse…).
Les décompressions excessives sont bloquées (anti « zip bomb »).

### 10. Génération et validation des données

Recommandation : produire l’URL avec l’outil local (aucun backend) :

\`\`\`bash
# Depuis le dépôt website/
npm run activity:link -- activite.json
cat activite.json | npm run activity:link -- --base https://netameow.github.io/mes-cours/
npm run activity:link -- activite.json --check   # valide seulement
\`\`\`

Règles de génération :
- rester **sobre** sur la longueur (des dizaines de questions dans un seul
  lien dépassent vite 20 000 caractères après encodage ; privilégier plusieurs
  liens ou des réponses courtes) ;
- la répétition compresse bien : préférer des textes avec du vocabulaire
  commun ;
- toujours tester le lien une fois généré.

### 11. Exemple complet de génération de lien

\`\`\`json
${exampleJson}
\`\`\`

Lien généré (valide tel quel) :

\`\`\`
${exampleUrl}
\`\`\`

### 12. Récapitulatif

- Formats acceptés : \`mc\`, \`mm\`, \`tf\`, \`fill\`, \`text\`, \`match\`,
  \`order\`, \`card\`.
- Support Markdown + LaTeX complet dans tous les champs textuels.
- Références de cours documentées dans \`${indexUrl}\`.
- Algorithme : JSON UTF-8 → DEFLATE brut → Base64URL sans padding.
`;
}