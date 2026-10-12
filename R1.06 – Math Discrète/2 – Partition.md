> [!note]
> **Version simple – l'essentiel en 2 minutes**
> Une **partition**, c'est **découper un ensemble comme on découpe un gâteau en parts** :
> 
> - aucune part n'est **vide** ;
> - les parts ne se **chevauchent pas** (deux à deux disjointes) ;
> - en les recollant toutes, on retrouve **tout le gâteau** (leur union = E).
> 
> Exemples du quotidien : distribuer 52 cartes en 4 mains, répartir une promo en groupes de TD, classer les entiers en pairs / impairs.
> 
> **Test rapide en 3 questions** : (1) Y a-t-il une part vide ? (2) Deux parts ont-elles un élément en commun ? (3) Manque-t-il quelque chose ? Si la réponse est « non » trois fois, c'est une partition.

> [!warning]
> **Une partition est un ensemble de parties.** Si $P = \{A,B,C\}$ est une partition de E, alors $A \in P$ (A est un **élément** de P) mais $A \subset E$ (A est une **partie** de E). Un élément $a$ de A n'est pas un élément de P.

---

## 1. Introduction et définition

De nombreuses situations conduisent à « découper » un ensemble en sous-ensembles qui n'empiètent pas les uns sur les autres, tout en couvrant la totalité des éléments. Ce découpage s'appelle une **partition**.

**Exemples**

- Répartir un jeu de 52 cartes entre 4 joueurs (mains de 13 cartes) : {Main du Joueur1, …, Main du Joueur4} est une partition du jeu de cartes.
- Répartir les étudiants de S1 en trois groupes de TD : {TD1, TD2, TD3} est une partition de S1.
- Répartir les mêmes étudiants en cinq groupes de TP : {TP1, …, TP5} est une *autre* partition de S1. Un même ensemble a donc plusieurs partitions possibles.
- Classer les entiers selon leur parité : P (pairs) et I (impairs), {P, I} est une partition de $\mathbb{N}$.
- Exercice 7 du cours 1 (Gondor) : {T, L, E} est une partition de G, car un représentant ne peut pas participer à plusieurs disciplines.

> [!note]
> **Définition.** Une partition d'un ensemble E est un ensemble de sous-ensembles **non vides** de E, **deux à deux disjoints** et dont la **réunion** constitue l'ensemble E.

**De façon plus mathématique** : soient $A_1, \dots, A_n$ des sous-ensembles non vides de E. $\{A_1, \dots, A_n\}$ est une partition de E si :

- $A_1 \cup A_2 \cup \dots \cup A_n = E$ (on couvre tout)
- $\forall\, i \neq j,\ A_i \cap A_j = \emptyset$ (deux à deux disjoints)

## 2. Comment vérifier qu'un ensemble est une partition ?

| Étape | À vérifier | Si ça échoue, on rédige |
| --- | --- | --- |
| 1 | Aucun élément n'est vide | « $A_i = \emptyset$ » |
| 2 | Les éléments sont deux à deux disjoints | « $A_i \cap A_j \neq \emptyset$ » |
| 3 | L'union est égale à E | « il manque une zone de E » |

**Reprère utile** : dans un diagramme de Venn à deux ensembles A et B, les quatre zones $A \cap B$, $A \cap \overline{B}$, $\overline{A} \cap B$ et $\overline{A \cup B}$ forment toujours une partition de E.

## 3. QCM corrigé

Dans un ensemble E, avec deux parties A et B qui se **chevauchent** ($A \cap B \neq \emptyset$), lesquels sont des partitions de E ?

| Ensemble | Partition ? | Justification |
| --- | --- | --- |
| $\{A, \overline{A}\}$ | ✅ Oui | A et son complémentaire sont disjoints et leur union est E |
| $\{A \cup B, \overline{A \cup B}\}$ | ✅ Oui | même raisonnement avec l'ensemble $A \cup B$ |
| $\{A \cap B,\ A \cap \overline{B},\ \overline{A} \cap B,\ \overline{A \cup B}\}$ | ✅ Oui | les 4 zones du diagramme de Venn |
| $\{A, B, \overline{A \cup B}\}$ | ❌ Non | $A \cap B \neq \emptyset$ : A et B se chevauchent |
| $\{A, \overline{A}, B, \overline{B}\}$ | ❌ Non | $A \cap B \neq \emptyset$ (et aussi $A \cap \overline{B}$ non vide en général : A recoupe à la fois B et son complémentaire) |

## 4. Partition, appartenance et inclusion : les réflexes

Soit E un ensemble, $P = \{A,B,C\}$ une partition de E, $a$ un élément de A.

- $A \in P$ : A est un **élément** de P. Ses éléments à elle sont les parties A, B, C.
- $A \subset E$ donc $A \in P(E)$ : A est aussi un **élément** de $P(E)$.
- $P \subset P(E)$ : P est un ensemble de parties de E, donc une **partie de **$P(E)$.
- $a \in A$ mais $a \notin P$ : $a$ est un objet, pas une partie.
- $\{A\}$ est un ensemble qui **contient** A : $\{A\} \subset P$ (inclusion), alors que $A \in P$ (appartenance).

**Exemple type avec les groupes de TD.** Avec $Q = \{TD1, TD2, TD3\}$ partition de S1 et Claire dans TD1 :

- $Claire \in TD1$ et $\{Claire\} \subset TD1$ ;
- $TD1 \in P(S1)$ car TD1 est une partie de S1 ;
- $Q \subset P(S1)$ car chaque groupe est une partie de S1 ;
- $TD1 \in Q$, donc on écrit ∈ et non ⊂ entre TD1 et Q.

## 5. Exercices

Les exercices du cours portent sur : reconnaître des partitions avec A, B, C ; les partitions du Gondor ({O−L, L−O, T, E}, {T, L−M, M−O, O, E−M}…) ; appartenance et inclusion avec une partition ; groupes de TD ; Journée du cinéma.

Test d'entraînement 2 (partitions) : [elearn.univ-pau.fr](https://elearn.univ-pau.fr/mod/quiz/view.php?id=631276)

Test d'entraînement 3 (récapitulatif) : [elearn.univ-pau.fr](https://elearn.univ-pau.fr/mod/quiz/view.php?id=631289)