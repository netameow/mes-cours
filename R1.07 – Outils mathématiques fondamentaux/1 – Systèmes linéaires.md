> [!note]
> **Version simple – l'essentiel en 2 minutes**
> - Une **équation linéaire** est une somme d'inconnues multipliées par des constantes, égale à une constante : $2x+3y-4z=7$. Pas de $x^2$, pas de $yz$.
> - Un **système linéaire** est un ensemble d'équations linéaires. Il a **0, 1 ou une infinité** de solutions.
> - Il s'écrit sous forme matricielle $MX=V$ (matrice des coefficients × colonne des inconnues = colonne des seconds membres).
> - Si $M$ est **carrée et inversible**, la solution est unique : $X = M^{-1}V$.
> - **3 opérations sur les lignes** ne changent pas les solutions : permuter deux lignes, multiplier une ligne par un réel **non nul**, ajouter à une ligne un multiple d'une autre. Chacune est **réversible**.
> - En dimension 2, une équation = une **droite** ; en dimension 3, une équation = un **plan**.

> [!warning]
> **Piège** : multiplier une ligne par $0$ n'est **pas** une opération autorisée (on perdrait de l'information, elle ne serait pas réversible).

---

## 1. Vocabulaire

- **Combinaison linéaire** : de deux réels $x$ et $y$, c'est une expression $ax+by$ avec $a,b$ constants. Exemple : $2x+3y$. Pour des matrices, $2M+3N$ est une combinaison linéaire de $M$ et $N$.
- **Équation linéaire** en $x_1,\dots,x_n$ : $\text{combinaison linéaire}(x_1,\dots,x_n)=\text{constante}$.
  - $2x+3y-4z=7$ est linéaire en $x,y,z$.
  - $x^2+yz=9$ **n'est pas** linéaire.
- **Système d'équations linéaires** : un ensemble d'équations linéaires, par exemple

$$
\begin{cases} x-2y+2z=4\\ 3x-y-4z=3\\ x+2y-2z=1 \end{cases}
$$

> [!tip]
> Souvent il y a autant d'équations que d'inconnues, mais ce n'est pas obligatoire. Avoir **au moins autant d'équations que d'inconnues** est une condition *nécessaire* (pas suffisante) pour une solution unique.

## 2. Écriture matricielle

Un système de $n$ équations à $p$ inconnues se représente par une matrice de taille $(n,p)$ et un vecteur colonne. Exemple :

$$
\begin{cases} x+2y=5\\ 3x+4y=6 \end{cases}
\iff
\underbrace{\begin{pmatrix}1&2\\3&4\end{pmatrix}}_{M}
\underbrace{\begin{pmatrix}x\\y\end{pmatrix}}_{X}
=
\underbrace{\begin{pmatrix}5\\6\end{pmatrix}}_{V}
$$

**Bilan** : résoudre un système de $n$ équations à $n$ inconnues revient à **inverser la matrice carrée** (ou du moins à savoir si c'est possible). Si $M$ est inversible :

$$
MX=V \iff X=M^{-1}V
$$

## 3. Trois systèmes, trois comportements

$$
S_1:\begin{cases}3x-2y=9\\2x+y=13\end{cases}
\qquad
S_2:\begin{cases}x+3y=5\\-2x-6y=-10\end{cases}
\qquad
S_3:\begin{cases}x+3y=5\\-2x-6y=8\end{cases}
$$

### 3.1 Résolution matricielle (ordre 2)

- **$S_1$** : $A=\begin{pmatrix}3&-2\\2&1\end{pmatrix}$, $\det A = 3\times1-(-2)\times2=7\neq0$, donc $A^{-1}=\frac17\begin{pmatrix}1&2\\-2&3\end{pmatrix}$ et

$$
X=A^{-1}B=\frac17\begin{pmatrix}1&2\\-2&3\end{pmatrix}\begin{pmatrix}9\\13\end{pmatrix}=\begin{pmatrix}5\\3\end{pmatrix}
$$

- **$S_2$ et $S_3$** : $A=\begin{pmatrix}1&3\\-2&-6\end{pmatrix}$, $\det A = 1\times(-6)-3\times(-2)=0$. $A$ **n'est pas inversible** : pas de solution unique. Mais le déterminant ne dit pas *s'il y a 0 ou une infinité* de solutions : il faut regarder le second membre.

### 3.2 Résolution graphique (2 inconnues seulement)

Une équation à deux inconnues est une **droite** du plan. Résoudre le système = trouver les points communs aux droites.

| Système | Droites | Solutions |
| --- | --- | --- |
| $S_1$ | **sécantes** en $(5,3)$ | une seule : $(5,3)$ |
| $S_2$ | **confondues** ($L_2=-2L_1$) | une infinité : $\{(5-3y,\,y)\mid y\in\mathbb{R}\}$ |
| $S_3$ | **parallèles** distinctes | aucune |

> [!tip]
> Côté matrice, des droites parallèles ou confondues correspondent à un **déterminant nul**. La méthode graphique est surtout utile pour *visualiser* les cas ; elle devient approximative dès que les coordonnées ne sont pas entières, et inapplicable au-delà de 2 inconnues.

### 3.3 Résolution par substitution

On isole une inconnue dans une équation, on la remplace dans les autres, et ainsi de suite.

- **$S_1$** : $y=13-2x$, donc $3x-2(13-2x)=9$, soit $7x=35$, $x=5$ et $y=3$.
- **$S_2$** : $x=5-3y$, donc $-2(5-3y)-6y=-10$, soit $-10=-10$ : toujours vrai, **infinité de solutions**.
- **$S_3$** : $x=5-3y$, donc $-10=8$ : **contradiction**, pas de solution.

## 4. Opérations sur les lignes

L'idée : transformer le système en un système **équivalent** (mêmes solutions) mais plus simple, en général avec une seule inconnue par équation.

**Exemple sur $S_1$** (on veut faire disparaître $y$) :

$$
\begin{cases}3x-2y=9 & L_1\\2x+y=13 & L_2\end{cases}
\iff
\begin{cases}3x-2y=9 & L_1\\4x+2y=26 & L_2\leftarrow 2L_2\end{cases}
\iff
\begin{cases}3x-2y=9 & L_1\\7x=35 & L_2\leftarrow L_2+L_1\end{cases}
$$

$L_2$ donne $x=5$, puis $L_1$ donne $y=3$.

### Les 3 opérations élémentaires

| Opération | Exemple | Opération réciproque |
| --- | --- | --- |
| **Permuter** deux équations | $L_2 \leftrightarrow L_3$ | la même (elle se défait elle-même) |
| **Multiplier** une équation par un nombre **non nul** | $L_2\leftarrow 2L_2$ | $L_2\leftarrow\frac12L_2$ |
| **Ajouter** à une ligne le multiple d'une autre | $L_1\leftarrow L_1+2L_2$ | $L_1\leftarrow L_1-2L_2$ |

Comme chaque opération a une réciproque, le nouveau système a **exactement les mêmes solutions** que l'ancien.

> [!tip]
> **Pour la suite** : ces opérations seront traduites par des **produits de matrices** (voir [[4 – Méthode de Gauss-Jordan]]) et organisées de façon systématique dans [[3 – Méthode du pivot de Gauss]].

## 5. Exercice corrigé

Résoudre $\begin{cases}-x-2y=4\\3x+4y=2\end{cases}$ de deux façons.

**Matriciellement** : $A=\begin{pmatrix}-1&-2\\3&4\end{pmatrix}$, $\det A=-4+6=2$, $A^{-1}=\frac12\begin{pmatrix}4&2\\-3&-1\end{pmatrix}$, donc

$$
X=A^{-1}\begin{pmatrix}4\\2\end{pmatrix}=\frac12\begin{pmatrix}20\\-14\end{pmatrix}=\begin{pmatrix}10\\-7\end{pmatrix}
$$

**Par opérations sur les lignes** : $L_2\leftarrow L_2+3L_1$ donne $-2y=14$, donc $y=-7$, puis $-x+14=4$, donc $x=10$. ✅ Même résultat.
