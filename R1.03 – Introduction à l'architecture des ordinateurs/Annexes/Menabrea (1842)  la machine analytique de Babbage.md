> [!note]
> **L.-F. Menabrea, *Notions sur la machine analytique de M. Charles Babbage*** – *Bibliothèque universelle de Genève*, nouvelle série, tome 41, 1842 (pp. 352 à 376). Scan de 26 pages (OCRé pour ce résumé). Annexe du chapitre 5.

## Contexte

Menabrea, capitaine du génie militaire, rend compte de ce que Charles **Babbage** lui a exposé lors d'un voyage à Turin. Il ne décrit pas la mécanique en détail mais les **buts** et les **principes** de la machine. (Ce texte fut ensuite traduit en anglais et annoté par Ada Lovelace en 1843, ce qui est une information de contexte hors du PDF.)

## Idée générale

- Le travail mathématique se divise en une partie **mécanique** (lois précises et invariables, qu'on peut confier à une machine) et une partie qui demande le **raisonnement** (réservée à l'intelligence).
- Critique des machines à calculer existantes (celle de Pascal ne fait que les 4 opérations) : elles exigent l'intervention continuelle de l'homme, source d'erreurs. Il faut à la fois l'**exactitude** et l'**économie de temps**.
- Babbage veut une machine capable non seulement de calculs arithmétiques mais aussi de **calculs analytiques** dont les lois sont connues.

## La machine à différences (première machine)

Inspirée du travail de de Prony sur les tables logarithmiques et trigonométriques : dans la troisième section, « à peu près 80 personnes » interpolaient par de simples additions et soustractions. Babbage a mis ce travail en mécanisme. Exemple du texte : la suite des carrés 1, 4, 9, 16, 25… a pour **différences premières** 3, 5, 7, 9… et pour **différences deuxièmes** constantes (2). Trois cadrans suffisent pour générer toute la suite **par simples additions**.

## La machine analytique : l'architecture avant l'heure

| Dans le texte (1842) | Rôle | Équivalent dans le cours |
| --- | --- | --- |
| **Colonnes des variables** (le **magasin**) | Piles de disques où sont écrits et rangés les nombres et les résultats (jusqu'à 40 disques par colonne dans l'exemple) | Mémoire |
| **Le moulin** | Appareil où s'exécutent les opérations : les nombres y sont transportés, combinés, puis le résultat est renvoyé sur une colonne | Unité de traitement (UT / UAL) |
| **Cartons des opérations** | Cartes perforées disposées à la suite (inspirées du métier **Jacquard**) qui indiquent quelle opération faire : addition, soustraction, multiplication, division | Instructions : code d'opération |
| **Cartons des variables** | Indiquent sur quelles colonnes agir et où écrire le résultat | Instructions : adresses des opérandes |
| Le gardien, la sonnerie | La machine s'arrête et prévient (passage par zéro ou l'infini) | Registre d'état / interruption |

### Le principe de Jacquard

Pour tisser une étoffe brodée, un carton perforé détermine, trou par trou, quels leviers (donc quels fils) se soulèvent. Une série de cartons à la suite reproduit le dessin automatiquement. La machine analytique applique le même mécanisme pour **choisir elle-même ses dispositions successives** sans la main de l'homme : c'est l'ancêtre du **programme**.

### Exemples du texte

- Résolution de **deux équations du premier degré à deux inconnues** : un tableau liste les opérations commandées par les cartons (4 multiplications, 2 soustractions, 1 division), avec les colonnes sur lesquelles elles agissent. Remarque importante : un nombre qui doit servir à plusieurs opérations est **réécrit** par la machine en même temps qu'elle l'efface pour l'envoyer au moulin.
- **Signes** : au-dessus de chaque colonne un disque indique le signe (pair/impair) ; les règles de signes sont assurées en **additionnant ou soustrayant ces chiffres de signe**.
- Calculs **analytiques** (développements en séries sur des puissances ou des fonctions), multiplication de deux polynômes.
- **Boucles** : pour calculer a·bⁿ, un seul carton de multiplication suffit, grâce à un **compteur** qui décompte (n−1), (n−2)… jusqu'à zéro : **le nombre de cartons ne dépend pas de la valeur de n**. C'est l'idée de la **boucle** et de la **rupture de séquence conditionnelle**.
- Conséquence tirée par l'auteur : les cartons n'indiquent que la nature des opérations et les colonnes ; ils ont donc **toute la généralité de l'analyse**.

> Lien avec le cours : on retrouve l'**UT** (le moulin), la **mémoire** (le magasin), le **programme** séparé des données (les cartons) et la **séquence d'instructions** (chapitre 5). La grande différence : chez Babbage le programme est sur des cartes, pas **dans la mémoire** : l'idée du programme enregistré viendra avec Turing et Von Neumann.