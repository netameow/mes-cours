> [!note]
> **A. M. Turing, *On Computable Numbers, with an Application to the Entscheidungsproblem*** – Proceedings of the London Mathematical Society, 1936 (reçu le 28 mai 1936, lu le 12 novembre 1936), 36 pages. Annexe des chapitres 2 et 5.

## L'idée en bref

Turing définit les **nombres calculables** : les réels dont l'écriture décimale peut être écrite **par une machine** par des moyens finis. Il construit pour cela le modèle de **machine de Turing**, puis montre que le **problème de la décision (Entscheidungsproblem) de Hilbert n'a pas de solution**.

## Plan de l'article

| § | Titre | Contenu |
| --- | --- | --- |
| 1 | Computing machines | Une machine avec un ruban divisé en cases, qui lit et écrit des symboles ; son comportement est déterminé par sa configuration (« m-configuration ») et le symbole lu |
| 2 | Definitions | Machines automatiques ; machines à calculer ; machine *circulaire* / *sans cycle* ; suites calculables ; nombres calculables |
| 3 | Examples of computing machines | Exemples concrets (par ex. une machine qui écrit 0 1 0 1 0 1…) |
| 4 | Abbreviated tables | Notation abrégée pour écrire des tables de transition plus facilement |
| 5 | Enumeration of computable sequences | Chaque machine a une **description standard** puis un **numéro de description** : les suites calculables sont **dénombrables** |
| 6 et 7 | The universal computing machine | Une **machine universelle U** qui, recevant sur son ruban la description d'une machine M, **reproduit son travail** |
| 8 | Application of the diagonal process | Argument diagonal : on ne peut pas décider par machine si une machine donnée est sans cycle |
| 9 | The extent of the computable numbers | Arguments montrant que les nombres calculables englobent tout ce qu'on peut naturellement considérer comme calculable |
| 10 | Examples of large classes of computable numbers | Parties réelles des nombres algébriques, des zéros des fonctions de Bessel, π, e… |
| 11 | Application to the Entscheidungsproblem | Résultat : il n'existe pas de procédé général de décision pour la logique du premier ordre |

L'introduction signale que les nombres calculables forment un ensemble **dénombrable**, qu'ils ne contiennent pas tous les nombres définissables, et que certains arguments apparaissent comme similaires à ceux de Gödel (1931).

## Ce qu'il faut retenir pour le cours

- La **machine de Turing** de la diapo 18 (ruban, tête, registre d'état, table d'actions) vient de cet article.
- La **machine universelle** (§ 6 et 7) est l'idée clé du chapitre 5 : si la table de transition (le **programme**) est écrite **sur le ruban** (dans la **mémoire**), une seule machine peut tout faire. C'est le dialogue imaginaire Turing / Von Neumann.
- Tout n'est pas calculable (§ 8 et 11), ce que le cours rattache à **Gödel** et aux problèmes **indécidables** (voir l'annexe sur le problème de correspondance de Post).