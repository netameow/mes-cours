> [!note]
> **Version simple – l'essentiel en 2 minutes**
> Le **cardinal** d'un ensemble, c'est **son nombre d'éléments** : $card(E)$, $|E|$ ou $\#E$. Et $card(\emptyset) = 0$.
> 
> - **Union** : on additionne, puis on **retire ce qu'on a compté deux fois** (l'intersection).
>     $card(A \cup B) = card(A) + card(B) - card(A \cap B)$
> - Si A et B sont **disjoints** : on additionne simplement, $card(A \cup B) = card(A) + card(B)$.
> - **Différence** : on enlève de A ce qui est aussi dans B.
>     $card(A - B) = card(A) - card(A \cap B)$
> - **Complémentaire** : tout moins A.
>     $card(\overline{A}) = card(E) - card(A)$
> - **Trois ensembles** : on additionne les 3, on retire les 3 paires, on rajoute le triple.
>     $card(A \cup B \cup C) = card(A)+card(B)+card(C) - card(A \cap B) - card(A \cap C) - card(B \cap C) + card(A \cap B \cap C)$

> [!tip]
> **Pour retrouver une formule sans l'apprendre** : transformer l'expression avec les règles du cours 3 (différence en intersection, Morgan…) jusqu'à obtenir des unions, des différences et des intersections simples, puis appliquer les trois formules ci-dessus.

---

## 1. Définitions et exemple fil rouge

**Cardinal** : le nombre d'éléments d'un ensemble s'appelle son cardinal, noté $card(E)$, $|E|$ ou $\#E$. On a $card(\emptyset) = |\emptyset| = 0$.

**Exemple** : S1 est l'ensemble des étudiants de semestre 1 d'un IUT, répartis en trois groupes G1, G2, G3. F est l'ensemble des filles.

- Effectifs des groupes : $card(G1) = 25$, $card(G2) = 26$, $card(G3) = 13$.
- Il y a 9 filles : 5 dans G1, 4 dans G2, aucune dans G3.
	- $card(F) = 9$, $card(G1 \cap F) = 5$, $card(G2 \cap F) = 4$, $card(G3 \cap F) = 0$.

### Question 1 : combien de garçons dans G1 ?

On dénombre les étudiants de G1 qui ne sont pas des filles : $25 - 5 = 20$.

En langage ensembliste, les garçons de G1 forment la différence $G1 - F = G1 \cap \overline{F}$, et :

$card(G1 - F) = card(G1) - card(G1 \cap F)$

**En général** : $card(A - B) = card(A) - card(A \cap B)$.

### Question 2 : combien d'étudiants sont soit des filles, soit dans G1 ?

On ajoute à G1 les filles qui ne sont pas dans G1 : $25 + 4 = 29$.

$25 + 4 = card(G1) + card(F - G1) = card(G1) + card(F) - card(F \cap G1)$

**En général** : $card(A \cup B) = card(A) + card(B) - card(A \cap B)$.

### Question 3 : combien sont soit dans G1, soit dans G2 ?

G1 et G2 sont disjoints : $25 + 26 = 51$.

**En général** : si $A \cap B = \emptyset$ alors $card(A \cup B) = card(A) + card(B)$.

## 2. Propriétés à retenir

Soient A et B deux sous-ensembles de E.

> [!note]
> $card(\overline{A}) = card(E) - card(A)$
> $card(A \cup B) = card(A) + card(B) - card(A \cap B)$ (si A et B sont disjoints : $card(A) + card(B)$)
> 
> $card(A - B) = card(A) - card(A \cap B)$

## 3. Exercice corrigé important : trois ensembles

Soient A, B, C trois ensembles. On veut exprimer en fonction des cardinaux de A, B, C et de leurs intersections :

### 3.1 $card(A \cup B \cup C)$

On applique $card(E \cup F) = card(E) + card(F) - card(E \cap F)$ avec $E = A \cup B$ et $F = C$ :

$card((A \cup B) \cup C) = card(A \cup B) + card(C) - card((A \cup B) \cap C)$

L'expression $(A \cup B) \cap C$ bloque un peu, mais par distributivité : $(A \cup B) \cap C = (A \cap C) \cup (B \cap C)$. On réapplique la formule à $A \cap C$ et $B \cap C$, dont l'intersection est $A \cap B \cap C$ :

$card((A \cap C) \cup (B \cap C)) = card(A \cap C) + card(B \cap C) - card(A \cap B \cap C)$

En rassemblant, avec $card(A \cup B) = card(A) + card(B) - card(A \cap B)$ :

$$
card(A \cup B \cup C) = card(A)+card(B)+card(C) - card(A \cap B) - card(A \cap C) - card(B \cap C) + card(A \cap B \cap C)
$$

### 3.2 $card(A \cap \overline{B} \cap C)$

Indication du cours : $A \cap \overline{B} \cap C = (A \cap C) \cap \overline{B} = (A \cap C) - B$. Avec $card(X - B) = card(X) - card(X \cap B)$ pour $X = A \cap C$ :

$$
card(A \cap \overline{B} \cap C) = card(A \cap C) - card(A \cap B \cap C)
$$

### 3.3 $card(\overline{A} \cap \overline{B} \cap C)$

Indication du cours : $\overline{A} \cap \overline{B} \cap C = C \cap (\overline{A} \cap \overline{B}) = C \cap \overline{A \cup B} = C - (A \cup B)$ (Morgan).

$card(C - (A \cup B)) = card(C) - card(C \cap (A \cup B))$, puis $C \cap (A \cup B) = (A \cap C) \cup (B \cap C)$ par distributivité, d'où :

$$
card(\overline{A} \cap \overline{B} \cap C) = card(C) - card(A \cap C) - card(B \cap C) + card(A \cap B \cap C)
$$

## 4. Les 8 zones d'un diagramme de Venn à trois ensembles

Tableau de synthèse (dans E) : combien d'éléments dans chaque zone ?

| Zone | Expression | Cardinal |
| --- | --- | --- |
| dans les trois | $A \cap B \cap C$ | $card(A \cap B \cap C)$ |
| A et B seulement | $A \cap B \cap \overline{C}$ | $card(A \cap B) - card(A \cap B \cap C)$ |
| A et C seulement | $A \cap \overline{B} \cap C$ | $card(A \cap C) - card(A \cap B \cap C)$ |
| B et C seulement | $\overline{A} \cap B \cap C$ | $card(B \cap C) - card(A \cap B \cap C)$ |
| A seulement | $A \cap \overline{B} \cap \overline{C}$ | $card(A) - card(A \cap B) - card(A \cap C) + card(A \cap B \cap C)$ |
| B seulement | $\overline{A} \cap B \cap \overline{C}$ | $card(B) - card(A \cap B) - card(B \cap C) + card(A \cap B \cap C)$ |
| C seulement | $\overline{A} \cap \overline{B} \cap C$ | $card(C) - card(A \cap C) - card(B \cap C) + card(A \cap B \cap C)$ |
| aucun des trois | $\overline{A \cup B \cup C}$ | $card(E) - card(A \cup B \cup C)$ |

Ces 8 zones forment une **partition de E** (cours 2) : on peut donc retrouver le cardinal de n'importe quelle expression en additionnant les zones concernées.

## 5. Méthode pour les exercices de dénombrement

1. **Nommer les ensembles** (A, B, F, G…) et **traduire chaque nombre de l'énoncé par un cardinal**, par exemple « 12 sont back end et chefs de projet » devient $card(B \cap G) = 12$.
2. **Écrire l'ensemble demandé avec ∩, ∪, − et complémentaire**. « au plus un », « aucun », « seulement » se traduisent avec des complémentaires.
3. **Simplifier** (cours 3) pour obtenir des unions, différences, intersections simples.
4. **Appliquer les formules de cardinal**, en justifiant chaque formule utilisée. Les calculs numériques passent après la justification.
5. **Utiliser les hypothèses d'inclusion** : si $A \subset B$ alors $A \cap B = A$ et $A \cup B = B$, ce qui simplifie fortement les cardinaux (par exemple si tous ceux qui ont réussi l'anglais ont réussi l'orthographe).

Les exercices du cours portent sur : trois cours à la faculté (F, M, I, E), la Journée des Anciens (60 participants, back end / front end / chef de projet web), 80 élèves de CM1/CM2 avec trois tests, et des expressions de $card(A \cap \overline{B} \cap C)$ à reconnaître.

Test d'entraînement 6 (cardinaux) : [elearn.univ-pau.fr](https://elearn.univ-pau.fr/mod/quiz/view.php?id=631334)