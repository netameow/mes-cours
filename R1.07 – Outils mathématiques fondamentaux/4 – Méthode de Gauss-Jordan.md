> [!note]
> **Version simple – l'essentiel en 2 minutes**
> - **Idée** : les opérations du pivot qui transforment $M$ en $I$ transforment aussi $I$ en $M^{-1}$.
> - **Méthode** : on écrit la matrice augmentée $(M\mid I)$ et on fait des opérations sur les lignes **des deux côtés à la fois**, jusqu'à obtenir $(I\mid M^{-1})$.
> - **Triangularisation** (de haut en bas) : des $0$ sous la diagonale, avec le pivot.
> - **Remontée** (de bas en haut) : des $0$ au-dessus de la diagonale, puis des $1$ sur la diagonale.
> - Chaque opération sur les lignes = **multiplication à gauche** par une matrice. Au final : $(T_k\cdots T_1)M=I$, donc $M^{-1}=T_k\cdots T_1$, **sans jamais calculer ces produits**.
> - Si on ne peut pas obtenir $I$ à gauche (une ligne de zéros apparaît), $M$ **n'est pas inversible**.

> [!warning]
> **Pièges** : (1) toute opération faite à gauche doit être faite à droite ; (2) l'inverse se lit **à droite** à la fin ; (3) vérifie toujours avec $MM^{-1}=I$.

---

## 1. Opérations sur les lignes = produit matriciel

Pour passer des opérations sur un système à un calcul d'inverse, il faut traduire chaque opération par une multiplication **à gauche** par une matrice.

### 1.1 Permutation de deux lignes

Avec $J=\begin{pmatrix}0&1\\1&0\end{pmatrix}$ et $M=\begin{pmatrix}1&2\\3&4\end{pmatrix}$ :

$$
JM=\begin{pmatrix}3&4\\1&2\end{pmatrix}\ (\text{lignes échangées}),\qquad
MJ=\begin{pmatrix}2&1\\4&3\end{pmatrix}\ (\text{colonnes échangées})
$$

**À gauche → lignes ; à droite → colonnes.** Donc $\begin{cases}3x+4y=6\\x+2y=5\end{cases}$ s'écrit $JMX=JV$.

En ordre 3, pour échanger les lignes 1 et 3 : $P=\begin{pmatrix}0&0&1\\0&1&0\\1&0&0\end{pmatrix}$.

**En général**, pour échanger les lignes $k_1$ et $k_2$ : on part de $I$, on met $1$ en $(k,k)$ pour $k\neq k_1,k_2$, et $1$ en $(k_1,k_2)$ et $(k_2,k_1)$.

### 1.2 Multiplication d'une ligne par un réel

On multiplie à gauche par une **matrice diagonale**. Pour multiplier $L_1$ par $2$ et $L_2$ par $\frac13$ :

$$
\begin{pmatrix}2&0\\0&\frac13\end{pmatrix}\begin{pmatrix}1&2\\3&4\end{pmatrix}=\begin{pmatrix}2&4\\1&\frac43\end{pmatrix}
$$

En ordre 3, pour multiplier les lignes par $2$, $3$ et $4$ : $D=\begin{pmatrix}2&0&0\\0&3&0\\0&0&4\end{pmatrix}$. On peut multiplier toutes les lignes par $\lambda_1,\dots,\lambda_n$ en une seule fois avec $D=\mathrm{diag}(\lambda_1,\dots,\lambda_n)$.

### 1.3 Ajouter à une ligne le multiple d'une autre

Pour $L_2\leftarrow L_2-3L_1$ :

$$
T=\begin{pmatrix}1&0\\-3&1\end{pmatrix},\qquad
TM=\begin{pmatrix}1&2\\3-3\times1&4-3\times2\end{pmatrix}=\begin{pmatrix}1&2\\0&-2\end{pmatrix}
$$

**En général**, pour $L_{k_1}\leftarrow L_{k_1}+\lambda L_{k_2}$ : $T=I$ avec en plus le coefficient $\lambda$ en position $(k_1,k_2)$.

En ordre 3, pour « ajouter à $L_2$ deux fois $L_1$ et retrancher $L_1$ à $L_3$ » : $P=\begin{pmatrix}1&0&0\\2&1&0\\-1&0&1\end{pmatrix}$.

> [!tip]
> **Bilan** : chaque opération sur les lignes d'un système est un produit à gauche par une matrice (une matrice **élémentaire**).

## 2. Pourquoi ça donne l'inverse

Système $\begin{cases}x+2y=5\\3x+4y=6\end{cases}\iff MX=V$, avec $M=\begin{pmatrix}1&2\\3&4\end{pmatrix}$.

1. **Triangularisation** : $L_2\leftarrow L_2-3L_1$, soit $T_1MX=T_1V$ avec $T_1=\begin{pmatrix}1&0\\-3&1\end{pmatrix}$.
2. **Remontée** : $L_2\leftarrow-\frac12L_2$, soit $DT_1MX=DT_1V$ avec $D=\begin{pmatrix}1&0\\0&-\frac12\end{pmatrix}$.
3. **Remontée** : $L_1\leftarrow L_1-2L_2$, soit $T_2DT_1MX=T_2DT_1V$ avec $T_2=\begin{pmatrix}1&-2\\0&1\end{pmatrix}$.

À la fin, le système est $X=\ldots$, c'est-à-dire $T_2DT_1MX=X$ :

$$
T_2DT_1M=I_2\implies M^{-1}=T_2DT_1=T_2DT_1I_2
$$

Donc :
- les opérations qui **transforment $M$ en $I$** ...
- ... **transforment $I$ en $M^{-1}$**.

On n'a pas besoin de calculer les produits de matrices : il suffit d'appliquer **les mêmes opérations sur les lignes** à $I$.

## 3. La méthode

> [!tip]
> **Algorithme**
> 1. Écrire $(M\mid I_n)$.
> 2. **Triangulariser** (de haut en bas) : pivot sur chaque colonne, des $0$ en dessous.
> 3. **Remonter** (de bas en haut) : des $0$ au-dessus de chaque pivot.
> 4. **Normaliser** : diviser chaque ligne par son coefficient diagonal pour avoir des $1$.
> 5. Lire $M^{-1}$ à droite : $(I_n\mid M^{-1})$.

## 4. Exemples détaillés

### 4.1 Ordre 2 : $M=\begin{pmatrix}1&2\\3&4\end{pmatrix}$

$$
\left(\begin{array}{cc|cc}1&2&1&0\\3&4&0&1\end{array}\right)
\xrightarrow{L_2\leftarrow L_2-3L_1}
\left(\begin{array}{cc|cc}1&2&1&0\\0&-2&-3&1\end{array}\right)
\xrightarrow{L_2\leftarrow-\frac12L_2}
\left(\begin{array}{cc|cc}1&2&1&0\\0&1&\frac32&-\frac12\end{array}\right)
$$

$$
\xrightarrow{L_1\leftarrow L_1-2L_2}
\left(\begin{array}{cc|cc}1&0&-2&1\\0&1&\frac32&-\frac12\end{array}\right)
\qquad\Rightarrow\qquad
M^{-1}=\begin{pmatrix}-2&1\\\frac32&-\frac12\end{pmatrix}
$$

Contrôle avec la formule d'ordre 2 : $\det M=-2$, $M^{-1}=\frac{1}{-2}\begin{pmatrix}4&-2\\-3&1\end{pmatrix}$ ✅

### 4.2 Ordre 2 avec pivot différent de 1 : $M=\begin{pmatrix}2&3\\4&5\end{pmatrix}$

$$
\left(\begin{array}{cc|cc}2&3&1&0\\4&5&0&1\end{array}\right)
\xrightarrow{L_2\leftarrow L_2-2L_1}
\left(\begin{array}{cc|cc}2&3&1&0\\0&-1&-2&1\end{array}\right)
\xrightarrow{L_2\leftarrow-L_2}
\left(\begin{array}{cc|cc}2&3&1&0\\0&1&2&-1\end{array}\right)
$$

$$
\xrightarrow{L_1\leftarrow L_1-3L_2}
\left(\begin{array}{cc|cc}2&0&-5&3\\0&1&2&-1\end{array}\right)
\xrightarrow{L_1\leftarrow L_1/2}
\left(\begin{array}{cc|cc}1&0&-\frac52&\frac32\\0&1&2&-1\end{array}\right)
$$

$$
M^{-1}=\begin{pmatrix}-\frac52&\frac32\\2&-1\end{pmatrix}
$$

### 4.3 Ordre 3 : $M=\begin{pmatrix}1&1&1\\-1&-2&-2\\1&-2&-1\end{pmatrix}$

**Point de départ**

$$
\left(\begin{array}{ccc|ccc}1&1&1&1&0&0\\-1&-2&-2&0&1&0\\1&-2&-1&0&0&1\end{array}\right)
$$

**Triangularisation.** Pivot $1$ (colonne 1) : $L_2\leftarrow L_2+L_1$, $L_3\leftarrow L_3-L_1$.

$$
\left(\begin{array}{ccc|ccc}1&1&1&1&0&0\\0&-1&-1&1&1&0\\0&-3&-2&-1&0&1\end{array}\right)
$$

Pivot $-1$ (colonne 2) : $L_3\leftarrow L_3-3L_2$.

$$
\left(\begin{array}{ccc|ccc}1&1&1&1&0&0\\0&-1&-1&1&1&0\\0&0&1&-4&-3&1\end{array}\right)
$$

**Remontée.** Avec $L_3$ : $L_1\leftarrow L_1-L_3$ et $L_2\leftarrow L_2+L_3$.

$$
\left(\begin{array}{ccc|ccc}1&1&0&5&3&-1\\0&-1&0&-3&-2&1\\0&0&1&-4&-3&1\end{array}\right)
$$

Avec $L_2$ : $L_1\leftarrow L_1+L_2$.

$$
\left(\begin{array}{ccc|ccc}1&0&0&2&1&0\\0&-1&0&-3&-2&1\\0&0&1&-4&-3&1\end{array}\right)
$$

**Normalisation** : $L_2\leftarrow-L_2$.

$$
\left(\begin{array}{ccc|ccc}1&0&0&2&1&0\\0&1&0&3&2&-1\\0&0&1&-4&-3&1\end{array}\right)
\qquad\Rightarrow\qquad
M^{-1}=\begin{pmatrix}2&1&0\\3&2&-1\\-4&-3&1\end{pmatrix}
$$

### 4.4 Les matrices de chaque étape (justification)

On note $N$ la matrice de droite. À chaque étape, $N$ est le produit des matrices d'opérations déjà appliquées.

| Opération | Matrice associée | $N$ après l'étape |
| --- | --- | --- |
| $L_2\leftarrow L_2+L_1$, $L_3\leftarrow L_3-L_1$ | $T_1=\begin{pmatrix}1&0&0\\1&1&0\\-1&0&1\end{pmatrix}$ | $T_1$ |
| $L_3\leftarrow L_3-3L_2$ | $T_2=\begin{pmatrix}1&0&0\\0&1&0\\0&-3&1\end{pmatrix}$ | $T_2T_1$ |
| $L_1\leftarrow L_1-L_3$, $L_2\leftarrow L_2+L_3$ | $T_3=\begin{pmatrix}1&0&-1\\0&1&1\\0&0&1\end{pmatrix}$ | $T_3T_2T_1$ |
| $L_1\leftarrow L_1+L_2$ | $T_4=\begin{pmatrix}1&1&0\\0&1&0\\0&0&1\end{pmatrix}$ | $T_4T_3T_2T_1$ |
| $L_2\leftarrow-L_2$ | $D=\begin{pmatrix}1&0&0\\0&-1&0\\0&0&1\end{pmatrix}$ | $DT_4T_3T_2T_1=M^{-1}$ |

$$
M\to T_1M\to T_2T_1M\to T_3T_2T_1M\to T_4T_3T_2T_1M\to DT_4T_3T_2T_1M=I_3
\implies M^{-1}=DT_4T_3T_2T_1
$$

### 4.5 Un autre ordre 3 : $M=\begin{pmatrix}1&2&3\\2&5&3\\1&0&8\end{pmatrix}$

$$
\left(\begin{array}{ccc|ccc}1&2&3&1&0&0\\2&5&3&0&1&0\\1&0&8&0&0&1\end{array}\right)
\xrightarrow[L_3\leftarrow L_3-L_1]{L_2\leftarrow L_2-2L_1}
\left(\begin{array}{ccc|ccc}1&2&3&1&0&0\\0&1&-3&-2&1&0\\0&-2&5&-1&0&1\end{array}\right)
$$

$$
\xrightarrow{L_3\leftarrow L_3+2L_2}
\left(\begin{array}{ccc|ccc}1&2&3&1&0&0\\0&1&-3&-2&1&0\\0&0&-1&-5&2&1\end{array}\right)
\xrightarrow{L_3\leftarrow-L_3}
\left(\begin{array}{ccc|ccc}1&2&3&1&0&0\\0&1&-3&-2&1&0\\0&0&1&5&-2&-1\end{array}\right)
$$

$$
\xrightarrow[L_2\leftarrow L_2+3L_3]{L_1\leftarrow L_1-3L_3}
\left(\begin{array}{ccc|ccc}1&2&0&-14&6&3\\0&1&0&13&-5&-3\\0&0&1&5&-2&-1\end{array}\right)
\xrightarrow{L_1\leftarrow L_1-2L_2}
\left(\begin{array}{ccc|ccc}1&0&0&-40&16&9\\0&1&0&13&-5&-3\\0&0&1&5&-2&-1\end{array}\right)
$$

$$
M^{-1}=\begin{pmatrix}-40&16&9\\13&-5&-3\\5&-2&-1\end{pmatrix}
$$

### 4.6 Pivot différent de 1 : $M=\begin{pmatrix}1&-2&3\\3&2&5\\2&1&-1\end{pmatrix}$

Après $L_2\leftarrow L_2-3L_1$ et $L_3\leftarrow L_3-2L_1$, le pivot suivant est $8$ ; on fait $L_3\leftarrow L_3-\frac58L_2$, puis on normalise ($L_2\leftarrow L_2/8$, $L_3\leftarrow L_3/(-\frac92)$) et on remonte. Résultat :

$$
M^{-1}=\frac1{36}\begin{pmatrix}7&-1&16\\-13&7&-4\\1&5&-8\end{pmatrix}
$$

## 5. Quand la matrice n'est pas inversible

Si, au cours de la triangularisation, **une ligne de la partie gauche devient entièrement nulle**, on ne pourra jamais obtenir $I$ : la matrice **n'est pas inversible** (cela correspond à un système sans solution unique, voir [[3 – Méthode du pivot de Gauss]]).

## 6. Exercices

Inverser par Gauss-Jordan (puis vérifier $MM^{-1}=I$) :

| Matrice $M$ | Réponse $M^{-1}$ |
| --- | --- |
| $\begin{pmatrix}1&0&1\\1&1&0\\-3&-1&-1\end{pmatrix}$ | $\begin{pmatrix}-1&-1&-1\\1&2&1\\2&1&1\end{pmatrix}$ |
| $\begin{pmatrix}1&1&1\\-1&-2&-2\\1&-1&-2\end{pmatrix}$ | $\begin{pmatrix}2&1&0\\-4&-3&1\\3&2&-1\end{pmatrix}$ |
| $\begin{pmatrix}1&1&1\\3&2&0\\1&4&3\end{pmatrix}$ | $\frac17\begin{pmatrix}6&1&-2\\-9&2&3\\10&-3&-1\end{pmatrix}$ |
| $\begin{pmatrix}1&3&2\\2&-1&1\\3&2&1\end{pmatrix}$ | $\frac1{14}\begin{pmatrix}-3&1&5\\1&-5&3\\7&7&-7\end{pmatrix}$ |
| $\begin{pmatrix}10&4&10\\2&1&1\\10&6&12\end{pmatrix}$ | $\frac1{12}\begin{pmatrix}3&6&-3\\-7&10&5\\1&-10&1\end{pmatrix}$ |

### Exercice récapitulatif (parties 2 et 3)

Soit $N=\begin{pmatrix}-1&1&0\\-3&4&-3\\0&1&-1\end{pmatrix}$ et $M=\begin{pmatrix}0&1&-1\\-3&4&-3\\-1&1&0\end{pmatrix}$ (voir [[2 – Inverse matriciel]]).

$N$ s'obtient de $M$ en **échangeant les lignes 1 et 3**, donc $N=PM$ avec $P=\begin{pmatrix}0&0&1\\0&1&0\\1&0&0\end{pmatrix}$.

**Pourquoi $P=P^{-1}$ (sans calcul)** : échanger deux fois les mêmes lignes ramène à la situation initiale, donc $PP=I_3$.

$$
N=PM\implies N^{-1}=M^{-1}P^{-1}=M^{-1}P=\frac12\begin{pmatrix}1&-1&3\\3&-1&3\\3&-1&1\end{pmatrix}
$$

(multiplier à droite par $P$ échange les **colonnes** 1 et 3 de $M^{-1}$).

### Transformations réversibles

Soit $P=\begin{pmatrix}1&0&0\\-1&1&0\\2&0&1\end{pmatrix}$. Multiplier à gauche par $P$ réalise : $L_2\leftarrow L_2-L_1$ et $L_3\leftarrow L_3+2L_1$. Pour revenir en arrière, on fait $L_2\leftarrow L_2+L_1$ et $L_3\leftarrow L_3-2L_1$, donc $P$ est inversible et

$$
P^{-1}=\begin{pmatrix}1&0&0\\1&1&0\\-2&0&1\end{pmatrix}
$$

### Vrai ou faux ?

| Affirmation (matrice $M$ d'ordre 3) | Réponse |
| --- | --- |
| Pour échanger les lignes 1 et 2, on multiplie à gauche par $\begin{pmatrix}1&1&0\\1&1&0\\0&0&1\end{pmatrix}$ | ❌ Faux : il faut $\begin{pmatrix}0&1&0\\1&0&0\\0&0&1\end{pmatrix}$ |
| Pour multiplier la ligne 2 par $3$, on multiplie à gauche par $\begin{pmatrix}1&0&0\\3&1&0\\0&0&1\end{pmatrix}$ | ❌ Faux : il faut $\begin{pmatrix}1&0&0\\0&3&0\\0&0&1\end{pmatrix}$ (la matrice donnée fait $L_2\leftarrow L_2+3L_1$) |
| Pour soustraire la ligne 1 à la ligne 3, on multiplie à gauche par $\begin{pmatrix}1&0&0\\0&1&0\\-1&0&1\end{pmatrix}$ | ✅ Vrai |
