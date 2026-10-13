> [!note]
> **Ling Zhao, *Tackling Post's Correspondence Problem*** (Department of Computing Science, University of Alberta ; version étendue d'un article de la conférence *Computers and Games* 2002). Annexe du chapitre 2 (machine de Turing, ce qui n'est pas calculable).

## Pourquoi cet article dans le cours ?

Le cours montre qu'une machine de Turing (donc un ordinateur) peut calculer tout ce qui est calculable, mais que **tout n'est pas calculable** (Gödel, problèmes **indécidables**). Le **problème de correspondance de Post (PCP)** est un exemple classique de problème indécidable : **aucun algorithme** ne peut le résoudre pour toutes les instances.

## Le problème

Une **instance** est un ensemble fini de paires de chaînes (gi, hi) sur un alphabet (ici ramené à {0,1}). Une **solution** est une séquence de choix i₁ i₂ … iₙ (n ≥ 1) telle que la concaténation des chaînes du **haut** soit **identique** à celle des chaînes du **bas**.

**Exemple** : instance PCP[3,3] avec les paires (100 / 1), (0 / 100), (1 / 00). On ne peut commencer que par la paire 1 (la seule dont une chaîne est préfixe de l'autre). La séquence **1, 3, 1, 1, 3, 2, 2** donne à la fois en haut et en bas la chaîne `1001100100100` (solution de longueur 7, vérifiée).

Vocabulaire du papier : **taille** (nombre de paires), **largeur** (longueur de la plus longue chaîne), instance **soluble / insoluble**, **solution optimale** (la plus courte ; une instance soluble a une infinité de solutions), instance **difficile** (solution optimale longue par rapport à la taille et à la largeur). Notations : PCP[s] (instances de taille s), PCP[s,w] (taille s et largeur w, ensemble fini).

## État des connaissances cité par l'article

- Problème introduit par **Emil L. Post en 1946**, exemple classique de problème **indécidable**.
- PCP **borné** : **NP-complet**.
- PCP à **2 paires** : décidable ; à **7 paires** : indécidable ; pour **3 à 6 paires** la décidabilité est encore inconnue (au moment de l'article).

## Contributions de l'article

- Un solveur de PCP ne peut jamais être complet (le problème est indécidable) : il résout seulement certaines instances.
- Application de techniques d'IA de **recherche à un agent** (*forward pruning*, *bidirectional probing*) et **quatre méthodes nouvelles** : méthodes du **masque**, de l'**exclusion**, du **groupe** et du **motif** (*mask, exclusion, group, pattern*).
- Stratégies pour créer des **instances difficiles** : 199 instances dont la solution optimale a une longueur d'au moins 100 ; records dans 4 sous-classes non triviales.
- Comparaison avec le problème du **Busy Beaver** (autre problème lié à la machine de Turing).

## Plan de l'article

1. Introduction ; 2. Qu'est-ce que le PCP (définitions, exemples) ; 3. Propriétés du PCP ; 4. Isomorphisme d'instances ; 5. Techniques de recherche d'IA ; 6. Quatre méthodes propres au PCP ; 7. Création d'instances difficiles ; 8. Résultats expérimentaux ; 9. Comparaison avec le Busy Beaver ; 10. Conclusion.

> Remarque : le PDF d'origine a un encodage de police défectueux (texte non extractible) ; ce résumé vient d'une reconnaissance optique des pages 1 à 3 (introduction, définitions, plan) : le reste est présenté d'après le plan et le résumé de l'article.