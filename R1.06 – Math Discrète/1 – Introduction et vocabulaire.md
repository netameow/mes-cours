> [!note]
> **Version simple – l'essentiel en 2 minutes**
> - Un **ensemble** est comme un **sac d'objets tous différents** : l'ordre ne compte pas et les doublons n'existent pas. $\{2,6,1\} = \{6,1,2\}$ mais la liste $(2,6,1) \neq (1,6,2)$.
> - **∈ (appartient)** relie un **objet** à un **ensemble** : $2 \in E$.
> - **⊂ (inclus)** relie **deux ensembles** : $\{2\} \subset E$ (le petit sac est contenu dans le grand).
> - **Règle d'or** : $x \in E \iff \{x\} \subset E$. Si on met des accolades autour de l'objet, on passe de ∈ à ⊂.
> - $P(E)$ = **l'ensemble de toutes les façons de piocher dans E** (y compris ne rien piocher, $\emptyset$, et tout piocher, $E$). Ses éléments sont eux-mêmes des ensembles : $A \subset E \iff A \in P(E)$.
> - Les 4 opérations : **∩ = « et »**, **∪ = « ou »**, **− = « sans »**, **complémentaire = « tout sauf »**.

> [!warning]
> **Le piège n°1 du chapitre** : un ensemble peut être **élément** d'un autre ensemble. Avec $S = \{1,2,3\}$ : $2 \in S$ mais $2 \notin P(S)$ (2 n'est pas un ensemble) ; en revanche $\{2\} \in P(S)$ et $\{2\} \subset S$.

---

## 1. Logique, bit et mathématiques discrètes

Le mot **logique** vient du grec *logos* (raison, raisonnement). Au XIXᵉ siècle, **George Boole** et **Gottlob Frege** donnent à la logique une forme mathématique : un langage formel, manipulable comme des équations, donc automatisable.

Boole associe aux valeurs de vérité des nombres (vrai = 1, faux = 0) et définit trois opérations : **ET (∧)**, **OU (∨)**, **NON (¬)**.

| A | B | A ∧ B | A ∨ B | ¬A |
| --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 1 | 0 |
| 1 | 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 1 | 1 |
| 0 | 0 | 0 | 0 | 1 |

**Le bit** (*binary digit*) est la plus petite unité d'information : 0 ou 1. Il a été choisi pour sa proximité avec l'algèbre de Boole, mais aussi parce qu'en électronique deux états sont faciles à distinguer (un transistor est un interrupteur bloqué / passant).

- Une suite de $n$ bits peut prendre $2^n$ valeurs distinctes.
- Un ordinateur ne manipule jamais une suite infinie de bits : il ne représente qu'un **nombre fini** de possibilités.
- Donc réels, sons et images sont des **approximations discrètes** : nombres flottants (précision finie), signaux audio échantillonnés et quantifiés, images en nombre fini de pixels.

Les mathématiques de l'information codée (logique, arithmétique, ensembles finis, graphes, combinatoire…) sont les **mathématiques discrètes**. Cela ne rend pas le continu inutile : analyse, optimisation et probabilités continues sont essentielles, par exemple en IA.

> **Parenthèse** : un ensemble est *discret* (ou *dénombrable*) si ses éléments peuvent être numérotés. Les ensembles finis et $\mathbb{N}$ le sont ; $[0,1]$ et $\mathbb{R}$ ne le sont pas.

## 2. Vocabulaire et notations

**Définition** : un ensemble est une collection d'objets distincts, appelés **éléments**.

> [!tip]
> **Accolades vs parenthèses**
> - $\{\ \}$ : pas d'ordre (ensemble). $\{2,6,1\} = \{6,1,2\}$
> - $(\ )$ : ordre important (liste, suite). $(2,6,1) \neq (1,6,2)$

**Deux façons de définir un ensemble**, par exemple les entiers pairs de 0 à 20 :

- **En extension** (on liste tout) : $E = \{0,2,4,6,8,10,12,14,16,18,20\}$
- **En compréhension** (on donne une propriété) : $E = \{n \text{ entier} \mid n \text{ est pair et } n \leq 20\}$

| Notation | Lecture | Signification |
| --- | --- | --- |
| $x \in E$ | x appartient à E | x est un **élément** de E |
| $x \notin E$ | x n'appartient pas à E | x n'est pas un élément de E |
| $A \subset B$ | A inclus dans B, sous-ensemble de B, partie de B | **tout élément de A est aussi élément de B** |
| $A = B$ | A égal à B | mêmes éléments, c'est-à-dire $A \subset B$ et $B \subset A$ |

Exemple avec $E$ ci-dessus : $2 \in E$, $10 \in E$, $7 \notin E$ et $\{2,10\} \subset E$.

## 3. Ensembles particuliers

- **Ensemble vide** $\emptyset$ : ne contient aucun élément.
- **Singleton** : un seul élément. $\{2\}$ est un singleton de E.
- **Paire** : deux éléments. $\{2,10\}$ est une paire de E.
- $P(E)$ : ensemble des sous-ensembles (ou parties) de E, avec $A \in P(E) \iff A \subset E$.
- **Ensembles de nombres** : $\mathbb{N}$ (entiers naturels), $\mathbb{Z}$ (entiers relatifs), $\mathbb{R}$ (réels).

## 4. L'ensemble des parties $P(E)$

- $E = \{1,2\} \Rightarrow P(E) = \{\emptyset, \{1\}, \{2\}, E\}$
- $E = \{1,2,3\} \Rightarrow P(E) = \{\emptyset, \{1\}, \{2\}, \{3\}, \{1,2\}, \{2,3\}, \{1,3\}, E\}$

Donc $\emptyset \in P(E)$, $\{1\} \in P(E)$, $\{1,3\} \in P(E)$, $E \in P(E)$… Tous ces éléments de $P(E)$ sont des **ensembles**.

> [!warning]
> **Un ensemble peut être élément d'un autre ensemble.** Un ensemble n'est pas obligatoirement *inclus* dans un autre : il peut *appartenir* à un ensemble d'ensembles, comme $P(E)$ ou une partition.

**Deux équivalences à connaître par cœur :**

<!-- Column 1 -->

$x \in E \iff \{x\} \subset E \iff \{x\} \in P(E)$

<!-- Column 2 -->

$A \subset E \text{ et } B \subset E \iff A \in P(E) \text{ et } B \in P(E) \iff \{A,B\} \subset P(E)$

## 5. QCM corrigé

Soit $S = \{1,2,3,4,5,6\}$, $A = \{1,2,3\}$, $B = \{4,6\}$.

| Affirmation | Réponse | Justification |
| --- | --- | --- |
| $\{2\} \subset S$ | ✅ Vrai | $2 \in S$ donc $\{2\} \subset S$ |
| $B \subset P(S)$ | ❌ Faux | $4,6 \in S$ donc $\{4,6\} \subset S$, donc $B \in P(S)$ (appartient, pas inclus) |
| $A \in S$ | ❌ Faux | $\{1,2,3\} \subset S$, donc $A \subset S$ ; A n'est pas un élément de S |
| $\{2\} \subset P(S)$ | ❌ Faux | $2 \in S$ donc $\{2\} \subset S$ et donc $\{2\} \in P(S)$ |
| $2 \in P(S)$ | ❌ Faux | 2 n'est pas un ensemble, il ne peut pas appartenir à $P(S)$ |
| $\{A,B\} \subset P(S)$ | ✅ Vrai | $A \subset S \Rightarrow A \in P(S)$ et $B \subset S \Rightarrow B \in P(S)$ |

**Astuce de lecture** : avant de répondre, demande-toi « à gauche, est-ce un objet ou un ensemble ? » puis « à droite, est-ce un ensemble d'objets ou un ensemble d'ensembles ? ». Ensuite choisis ∈ ou ⊂.

## 6. Opérations sur les ensembles

| Opération | Notation | Définition | Se lit |
| --- | --- | --- | --- |
| Intersection | $A \cap B$ | $\{x \in E \mid x \in A \text{ et } x \in B\}$ | dans A **et** dans B |
| Union (réunion) | $A \cup B$ | $\{x \in E \mid x \in A \text{ ou } x \in B\}$ | dans A **ou** dans B (ou les deux) |
| Différence | $A - B$ | $\{x \in E \mid x \in A \text{ et } x \notin B\}$ | dans A **sans** être dans B |
| Complémentaire | $\overline{A}$ | $\{x \in E \mid x \notin A\} = E - A$ | **tout sauf** A (dans E) |

Si $A \cap B = \emptyset$, on dit que A et B sont **disjoints**.

**Propriétés de l'intersection**

- $A \cap B \subset A$ et $A \cap B \subset B$
- $A \subset B \iff A \cap B = A$
- $A \cap \emptyset = \emptyset$, $A \cap A = A$
- commutative : $A \cap B = B \cap A$
- associative : $(A \cap B) \cap C = A \cap (B \cap C)$

**Propriétés de l'union**

- $A \subset A \cup B$ et $B \subset A \cup B$
- $A \subset B \iff A \cup B = B$
- $A \cup \emptyset = A$, $A \cup A = A$
- commutative : $A \cup B = B \cup A$
- associative : $(A \cup B) \cup C = A \cup (B \cup C)$

**Propriétés de la différence**

- $A - B \subset A$ et $B - A \subset B$
- **ni commutative, ni associative**
- **Remarque importante** : $A - B = A \cap \overline{B}$ (très utile pour simplifier, voir cours 3)

**Les 4 zones d'un diagramme de Venn à deux ensembles** (dans E) :

| Zone | Expression |
| --- | --- |
| seulement A | $A - B = A \cap \overline{B}$ |
| seulement B | $B - A = B \cap \overline{A}$ |
| les deux | $A \cap B$ |
| ni A ni B | $\overline{A \cup B}$ |

## 7. Parenthèse informatique : abstraction et Python

Décrire des données et les opérations possibles **indépendamment de leur implémentation** s'appelle un **type de données abstrait (ADT)**. L'ADT **Set** décrit : ajout, suppression, test d'appartenance, union, intersection, différence… sans dire comment c'est stocké.

Python fournit le type `set`, C++ fournit `std::set` et `std::unordered_set` : ce sont des implémentations différentes de la même abstraction.

```python
A = {0,2,4,6,8,10,12,14,16,18,20}
AA = {2*i for i in range(11)}     # définition en compréhension
print(A == AA)                    # True

B = {1, 2, 3, 4, 5}
C = {2, 4, 6}

print(2 in A)                     # True  (appartenance)
print(C <= A)                     # True  (inclusion)

# L'ordre et les doublons n'ont pas d'importance
print({1, 2, 3} == {3, 1, 2})     # True
print({1, 2, 3} == {1, 3, 2, 3})  # True

print(A | B)   # union
print(A & B)   # intersection -> {2, 4}
print(A - B)   # différence   -> {0, 6, 8, 10, 12, 14, 16, 18, 20}
print(B - A)   # différence   -> {1, 3, 5}
```

**Et les ensembles d'ensembles ?** `set` et `dict` utilisent une **table de hachage** : chaque élément doit être **hashable**, donc **immuable**.

- Un objet **mutable** (list, dict, set) peut être modifié après sa création ; un `tuple` est immuable.
- Un `set` est mutable, donc **on ne peut pas faire un **`**set**`** de **`**set**`.
- Solution : `frozenset`, la version immuable du `set` (hashable), utilisable comme élément d'un `set` ou clé de dictionnaire.

```python
s = {frozenset({1, 2, 3}), frozenset({4, 5})}   # OK

1 in s                          # False
{1, 2, 3} in s                  # True  (set et frozenset se mélangent dans les opérations)
{1, 2, 3} < s                   # False
frozenset({1, 2, 3}) < s        # False
{frozenset({1, 2, 3})} < s      # True
```

La notion de hash sera revue en crypto en S3.

## 8. Exercices

Les exercices 1 à 7 du cours portent sur : les opérations (groupes G1/G2/G3), les diagrammes de Venn, l'appartenance et l'inclusion, et le récapitulatif du royaume du Gondor.

Test d'entraînement 1 (appartenance, inclusion, opérations) : [elearn.univ-pau.fr](https://elearn.univ-pau.fr/mod/quiz/view.php?id=631272)