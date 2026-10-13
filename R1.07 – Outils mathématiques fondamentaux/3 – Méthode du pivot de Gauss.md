> [!note]
> **Version simple – l'essentiel en 2 minutes**
> - **But** : transformer un système en un système **triangulaire équivalent**, facile à résoudre de bas en haut.
> - **Étape 1** : choisir comme **pivot** un coefficient non nul de la première inconnue (on permute des lignes si besoin ; un pivot égal à $1$ simplifie les calculs).
> - **Étape 2** : avec le pivot, **éliminer** cette inconnue dans toutes les lignes en dessous ($L_i\leftarrow L_i-\frac{a_{i}}{\text{pivot}}L_k$).
> - On **recommence** sur le sous-système (une inconnue en moins), jusqu'à la forme triangulaire.
> - **Remontée** : la dernière équation donne la dernière inconnue, on remplace dans l'avant-dernière, etc.
> - Selon ce qui apparaît : **solution unique**, **infinité de solutions** (une équation devient $0=0$) ou **aucune solution** (une équation devient $0=\text{nombre non nul}$).

> [!warning]
> **Pièges** : (1) ne pas oublier de **modifier le second membre** en même temps que la ligne ; (2) pour éliminer, on utilise la **ligne du pivot**, jamais une ligne déjà modifiée par erreur ; (3) $0=0$ n'est pas une erreur, c'est le signe d'une infinité de solutions.

---

## 1. Systèmes triangulaires

Un système est **triangulaire** si chaque équation a une inconnue de moins que la précédente. Sa matrice est elle aussi triangulaire :

$$
\begin{cases}x-2y+2z=4\\y-4z=3\\-2z=-1\end{cases}
\iff
\begin{pmatrix}1&-2&2\\0&1&-4\\0&0&-2\end{pmatrix}\begin{pmatrix}x\\y\\z\end{pmatrix}=\begin{pmatrix}4\\3\\-1\end{pmatrix}
$$

Il se résout de bas en haut (**remontée**) :

$$
z=\frac{-1}{-2}=\frac12,\qquad y=3+4z=5,\qquad x=4+2y-2z=4+10-1=13
$$

La méthode du pivot permet de **se ramener à un tel système** avec les opérations sur les lignes (voir [[1 – Systèmes linéaires]]), qui ne changent pas les solutions.

## 2. Une méthode itérative

À l'étape $k$, on utilise dans la $k$-ième équation un coefficient (le **pivot**) pour supprimer la $k$-ième inconnue dans les équations du dessous.

**Exemple** : $\begin{cases}2y+z=4\\3x-y-4z=3\\6x+2y-2z=1\end{cases}$

1. **Choix du pivot** : $L_1$ n'a pas de $x$, on permute $L_1\leftrightarrow L_2$. Le pivot est $3$.
2. **Élimination de $x$** : $L_3\leftarrow L_3-2L_1$.

$$
\begin{cases}3x-y-4z=3 & L_1\\2y+z=4 & L_2\\4y+6z=-5 & L_3\leftarrow L_3-2L_1\end{cases}
$$

3. **Sous-système** : nouveau pivot $2$ (dans $L_2$), on élimine $y$ : $L_3\leftarrow L_3-2L_2$.

$$
\begin{cases}3x-y-4z=3\\2y+z=4\\4z=-13\end{cases}
$$

4. **Remontée** : $z=-\frac{13}{4}$, $y=\frac12(4-z)=\frac{29}{8}$, $x=\frac13(3+y+4z)=\frac13\left(3+\frac{29}{8}-13\right)=-\frac{17}{8}$.

**Vérification dans $L_3$ initiale** : $6\left(-\frac{17}{8}\right)+2\cdot\frac{29}{8}-2\left(-\frac{13}{4}\right)=-\frac{51}{4}+\frac{29}{4}+\frac{26}{4}=1$ ✅

## 3. Un exemple concret : trois produits, trois ateliers

Une usine fabrique $P_1,P_2,P_3$ qui passent dans trois ateliers $A,B,C$ :

| | Atelier A | Atelier B | Atelier C |
| --- | --- | --- | --- |
| $P_1$ | 2 h | 1 h | 3 h |
| $P_2$ | 5 h | 3 h | 2 h |
| $P_3$ | 3 h | 2 h | 2 h |

Charges horaires : $104$ h pour A, $64$ h pour B, $55$ h pour C. Quelles quantités $n_1,n_2,n_3$ ?

$$
\begin{cases}2n_1+5n_2+3n_3=104\\n_1+3n_2+2n_3=64\\3n_1+2n_2+2n_3=55\end{cases}
$$

**Étape A : supprimer $n_1$.** On permute $L_1\leftrightarrow L_2$ pour avoir un pivot égal à $1$, puis $L_2\leftarrow L_2-2L_1$ et $L_3\leftarrow L_3-3L_1$ :

$$
\begin{cases}n_1+3n_2+2n_3=64\\-n_2-n_3=-24\\-7n_2-4n_3=-137\end{cases}
$$

**Étape B : supprimer $n_2$.** Pivot $-1$ (dans $L_2$), $L_3\leftarrow L_3-7L_2$ :

$$
\begin{cases}n_1+3n_2+2n_3=64\\-n_2-n_3=-24\\3n_3=31\end{cases}
$$

**Remontée** : $n_3=\frac{31}{3}$, $n_2=24-n_3=\frac{41}{3}$, $n_1=64-3n_2-2n_3=\frac73$.

> [!warning]
> Dans la dernière élimination, il faut bien utiliser **$L_2$** (la ligne du pivot) : $L_3\leftarrow L_3-7L_2$, et non $L_1$.

## 4. Les trois issues possibles

### 4.1 Solution unique (S1 et S2)

$(S_1)\begin{cases}x+3y+2z=-1\\2x-y+z=6\\3x+2y+z=1\end{cases}$

$$
\iff\begin{cases}x+3y+2z=-1\\-7y-3z=8 & L_2\leftarrow L_2-2L_1\\-7y-5z=4 & L_3\leftarrow L_3-3L_1\end{cases}
\iff\begin{cases}x+3y+2z=-1\\-7y-3z=8\\-2z=-4 & L_3\leftarrow L_3-L_2\end{cases}
$$

Remontée : $z=2$, $-7y=8+3z=14\Rightarrow y=-2$, $x=-1-3y-2z=1$. Solution : $(1,-2,2)$.

$(S_2)\begin{cases}10x+4y+10z=4200\\2x+y+z=800\\10x+6y+12z=5000\end{cases}$ : après $L_1\leftrightarrow L_2$, $L_2\leftarrow L_2-5L_1$, $L_3\leftarrow L_3-5L_1$, puis $L_3\leftarrow L_3+L_2$ :

$$
\begin{cases}2x+y+z=800\\-y+5z=200\\12z=1200\end{cases}
\Rightarrow z=100,\ y=5z-200=300,\ x=\tfrac12(800-y-z)=200
$$

### 4.2 Aucune solution (S3)

$(S_3)\begin{cases}x-y+z=2\\2x+y-4z=7\\x+2y-5z=-1\end{cases}\iff\begin{cases}x-y+z=2\\3y-6z=3 & L_2\leftarrow L_2-2L_1\\3y-6z=-3 & L_3\leftarrow L_3-L_1\end{cases}\iff\begin{cases}x-y+z=2\\3y-6z=3\\0=-6 & L_3\leftarrow L_3-L_2\end{cases}$

$0=-6$ est **impossible** : le système n'a pas de solution.

### 4.3 Une infinité de solutions (S4)

$(S_4)\begin{cases}-x+y+z=1\\-x+2y+6z=5\\2x-y+3z=2\end{cases}\iff\begin{cases}-x+y+z=1\\y+5z=4 & L_2\leftarrow L_2-L_1\\y+5z=4 & L_3\leftarrow L_3+2L_1\end{cases}$

La dernière équation est identique à la précédente (elle disparaît, $0=0$) : il reste **2 équations pour 3 inconnues**. On prend $z$ comme paramètre :

$$
y=4-5z,\qquad x=y+z-1=3-4z\qquad\Rightarrow\qquad \begin{pmatrix}x\\y\\z\end{pmatrix}=\begin{pmatrix}3-4z\\4-5z\\z\end{pmatrix},\ z\in\mathbb{R}
$$

## 5. Aspect géométrique

Dans l'espace, **chaque équation linéaire est un plan**.

| Situation | Géométrie |
| --- | --- |
| Solution unique | les 3 plans se coupent en **un point** (deux plans sécants selon une droite, non parallèle au troisième plan) |
| Aucune solution | plans **parallèles** distincts, **ou** plans non parallèles dont les intersections deux à deux sont des **droites parallèles** (cas de $S_3$) |
| Infinité de solutions | les 3 plans se coupent selon **une même droite** (cas de $S_4$) |

## 6. Systèmes paramétriques

Dans un système **paramétrique**, un ou plusieurs **paramètres** apparaissent dans les coefficients. On exprime la solution en fonction du paramètre, en **discutant les cas** (le pivot peut s'annuler pour certaines valeurs).

$$
(S)\begin{cases}x+y=2\\x+py=4\end{cases}\iff\begin{cases}x+y=2\\(p-1)y=2 & L_2\leftarrow L_2-L_1\end{cases}
$$

- $p=1$ : $L_2$ devient $0y=2$, impossible : **pas de solution**.
- $p\neq1$ : $y=\frac{2}{p-1}$ et $x=2-y=\frac{2p-4}{p-1}$ : **solution unique** $\left(\frac{2p-4}{p-1},\frac{2}{p-1}\right)$.

> [!tip]
> **Méthode** : on avance avec le pivot comme d'habitude, et dès qu'on devrait **diviser par une expression contenant le paramètre**, on sépare le cas où elle vaut $0$ du cas où elle est non nulle.

## 7. Exercices (avec réponses)

**Systèmes numériques**

| Système | Réponse |
| --- | --- |
| $\begin{cases}x+2y+3z=4\\x-y+4z=6\\x+2y+z=6\end{cases}$ | $(9,-1,-1)$ |
| $\begin{cases}x+y-2z=5\\4x-y+2z=0\\2x-3y+3z=5\end{cases}$ | $(1,-6,-5)$ |

**Systèmes paramétriques**

| Système | Discussion |
| --- | --- |
| $\begin{cases}x+2y+3z=4\\x+my+4z=6\\x+2y+(m+2)z=6\end{cases}$ | $m=1$ : aucune solution ; $m=2$ : infinité $\{(-2y-2,\,y,\,2)\}$ ; sinon solution unique $\left(\frac{4m-14}{m-1},\frac{2}{m-1},\frac{2}{m-1}\right)$ |
| $\begin{cases}x+my=-3\\mx+4y=6\end{cases}$ | $m=2$ : aucune solution ; $m=-2$ : infinité $\{(2y-3,\,y)\}$ ; sinon solution unique $\left(\frac{6}{m-2},\frac{-3}{m-2}\right)$ |
| $\begin{cases}x+y+(1-m)z=m+2\\(1+m)x-y+2z=0\\2x-my+3z=m+2\end{cases}$ | $m=2$ : aucune solution ; $m=-2$ : infinité $\{(-y,\,y,\,0)\}$ ; $m=0$ : infinité $\{(4-3y,\,y,\,2y-2)\}$ ; sinon solution unique $\left(\frac{1}{m-2},\frac{m+3}{2-m},\frac{m+2}{2-m}\right)$ |
| $\begin{cases}x+y+mz=m\\x+my-z=1\\x+y-z=1\end{cases}$ | $m=-1$ : aucune solution ; $m=1$ : infinité $\{(1-y,\,y,\,0)\}$ ; sinon solution unique $\left(\frac{2m}{m+1},0,\frac{m-1}{m+1}\right)$ |

Pour la suite : [[4 – Méthode de Gauss-Jordan]], qui reprend exactement ces opérations pour **inverser une matrice**.
