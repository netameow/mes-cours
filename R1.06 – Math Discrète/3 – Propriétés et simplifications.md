> [!note]
> **Version simple – l'essentiel en 2 minutes**
> Simplifier une expression ensembliste, c'est comme simplifier une expression de calcul : on suit des **règles**, sans dessiner de diagramme de Venn.
> 
> - **Distributivité** (comme $x(y+z) = xy + xz$, mais dans les deux sens) :
>     - $(A \cap B) \cup C = (A \cup C) \cap (B \cup C)$
>     - $(A \cup B) \cap C = (A \cap C) \cup (B \cap C)$
> - **Lois de Morgan** : on « casse la barre » et on **change le signe** :
>     - $\overline{A \cup B} = \overline{A} \cap \overline{B}$
>     - $\overline{A \cap B} = \overline{A} \cup \overline{B}$
> - **Toujours mettre des parenthèses** : $(A \cap B) \cup C \neq A \cap (B \cup C)$, donc $A \cap B \cup C$ est ambigu.
> - **Recette en 4 temps** : ① transformer les différences en intersections avec complémentaire ; ② Morgan pour que les barres ne portent que sur des lettres seules ; ③ développer ou factoriser ; ④ appliquer les règles de base ($A \cap \overline{A} = \emptyset$, etc.).

---

L'objectif de ce cours est de **manipuler des expressions ensemblistes** pour les simplifier en **justifiant chaque étape par une propriété**, sans visualiser les ensembles. C'est un entraînement à manipuler un formalisme mathématique.

## 1. Distributivité et lois de Morgan

### 1.1 Distributivité

En algèbre, la multiplication est distributive par rapport à l'addition : $x(y+z) = xy + xz$. Mais l'addition n'est pas distributive par rapport à la multiplication : $2 + (3 \times 4) \neq (2+3)(2+4)$.

Pour les ensembles, la distributivité marche dans **les deux sens** :

> [!note]
> **Distributivité de l'union par rapport à l'intersection**
> $(A \cap B) \cup C = (A \cup C) \cap (B \cup C)$
> 
> **Distributivité de l'intersection par rapport à l'union**
> 
> $(A \cup B) \cap C = (A \cap C) \cup (B \cap C)$

> [!warning]
> **Attention** : $(A \cap B) \cup C \neq A \cap (B \cup C)$. Sans parenthèses, l'expression $A \cap B \cup C$ est **ambiguë**. Sur un diagramme de Venn, $(A \cap B) \cup C$ colorie tout C plus la zone commune à A et B, alors que $A \cap (B \cup C)$ ne colorie que la partie de A qui touche B ou C.

### 1.2 Lois de Morgan

> [!note]
> $\overline{A \cup B} = \overline{A} \cap \overline{B}$
> $\overline{A \cap B} = \overline{A} \cup \overline{B}$

Elles seront revues en logique avec des « et », des « ou » et des négations. En logique : **la négation d'un « et » est un « ou » de négations**, et inversement.

- « Paul est diplômé **et** expérimenté » a pour négation « Paul n'est pas diplômé **ou** il n'est pas expérimenté ».
- « Paul est diplômé **ou** expérimenté » a pour négation « Paul n'est **ni** diplômé, **ni** expérimenté ».

**En programmation**, il est important de bien maîtriser Morgan pour arrêter une boucle sur une condition complexe :

```python
# "on continue tant que ce n'est PAS (a ET b)"
while not (a and b): ...
# équivaut, par Morgan, à :
while (not a) or (not b): ...
```

## 2. Simplifier : la méthode

Comment simplifier une expression ensembliste ?

1. **Isoler les complémentaires** : on fait en sorte que les barres ne portent que sur des ensembles isolés, pas sur des unions ou des intersections. On applique pour cela **Morgan**.
	- Exemple : $A \cap \overline{(\overline{A} \cap \overline{B})} = A \cap (\overline{\overline{A}} \cup \overline{\overline{B}}) = A \cap (A \cup B)$.
2. **Transformer les différences en intersections** : $A - B = A \cap \overline{B}$ (pour pouvoir distribuer ou factoriser).
3. **Distribuer ou factoriser**.
	- Exemple : $A \cap (\overline{A} \cup B) = (A \cap \overline{A}) \cup (A \cap B)$.
4. **Appliquer les règles de base** (tableau ci-dessous).
	- Exemple : $(A \cap \overline{A}) \cup (A \cap B) = \emptyset \cup (A \cap B) = A \cap B$.

### Règles de base à connaître

| Règle | Nom ou idée |
| --- | --- |
| $A \cap \overline{A} = \emptyset$ et $A \cup \overline{A} = E$ | un ensemble et son complémentaire |
| $\overline{\overline{A}} = A$ | double complémentaire |
| $A \cap \emptyset = \emptyset$ et $A \cup \emptyset = A$ | l'ensemble vide |
| $A \cap E = A$ et $A \cup E = E$ | l'ensemble total E |
| $A \cap A = A$ et $A \cup A = A$ | idempotence |
| $A \subset B \Rightarrow A \cap B = A \text{ et } A \cup B = B$ | quand l'un est inclus dans l'autre |
| $A \cap (A \cup B) = A$ et $A \cup (A \cap B) = A$ | absorption, car $A \subset A \cup B$ et $A \cap B \subset A$ |
| commutativité et associativité de $\cap$ et $\cup$ | on peut réordonner et enlever des parenthèses **dans une suite de ∩ seuls** ou de ∪ seuls |

## 3. Exemples rédigés

**Exemple 1**

$A \cap (A \cup B) = A$ car $A \subset (A \cup B)$.

**Exemple 2**

$(A \cup B) \cap (A \cup \overline{B}) = A \cup (B \cap \overline{B}) = A \cup \emptyset = A$

(distributivité de l'union par rapport à l'intersection, puis $B \cap \overline{B} = \emptyset$, puis $A \cup \emptyset = A$).

**Exemple 3** : simplifier $(A \cup B) \cap (C \cap \overline{A})$

| Étape | Propriété utilisée |
| --- | --- |
| $(A \cup B) \cap C \cap \overline{A}$ | associativité de l'intersection (on enlève des parenthèses) |
| $= C \cap [(A \cup B) \cap \overline{A}]$ | commutativité et associativité de l'intersection |
| $= C \cap [(A \cap \overline{A}) \cup (B \cap \overline{A})]$ | distributivité de l'intersection par rapport à l'union |
| $= C \cap [\emptyset \cup (B \cap \overline{A})]$ | $A \cap \overline{A} = \emptyset$ |
| $= C \cap (B \cap \overline{A})$ | $\emptyset \cup X = X$, car $\emptyset \subset X$ |
| $= C \cap B \cap \overline{A}$ | associativité de l'intersection |

## 4. Exercices et conseils de rédaction

> [!note]
> **Rédiger avec soin**, sur le modèle des exemples, en précisant **la propriété utilisée à chaque étape**, même quand la réponse est évidente.
> Pour **montrer une égalité** $X = Y$, on part d'un côté et on transforme jusqu'à l'autre.
> 
> Pour **montrer qu'une propriété est fausse** (par exemple : la différence n'est pas associative), un **contre-exemple** avec des ensembles concrets suffit.
> 
> Dans une assertion du type « égalité **car** justification », il faut que l'égalité **et** la justification soient vraies.

Les exercices du cours : simplifications (6a à 6h), différence ensembliste et associativité (7a à 7f), assertions à justifier (8).

Test d'entraînement 4 (simplifications) : [elearn.univ-pau.fr](https://elearn.univ-pau.fr/mod/quiz/view.php?id=631300)