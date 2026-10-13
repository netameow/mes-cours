> [!note]
> **Version simple – l'essentiel en 2 minutes**
> - Une **matrice** $(n,p)$ est un tableau de nombres à $n$ lignes et $p$ colonnes. $a_{ij}$ = coefficient ligne $i$, colonne $j$.
> - On **additionne** deux matrices de **même taille** terme à terme, et on **multiplie par un réel** terme à terme.
> - **Produit** $AB$ : possible seulement si **nb de colonnes de $A$ = nb de lignes de $B$**. Le coefficient $(i,j)$ est « ligne $i$ de $A$ » × « colonne $j$ de $B$ ».
> - Le produit n'est **pas commutatif** : en général $AB\neq BA$.
> - $I_n$ est le **neutre** : $MI_n=I_nM=M$.
> - **Transposée** $M^T$ : on échange lignes et colonnes ; $(AB)^T=B^TA^T$.
> - **Inverse** : $M^{-1}$ vérifie $MM^{-1}=M^{-1}M=I_n$. Toutes les matrices carrées ne sont pas inversibles. En ordre 2 : $\det M=ad-bc\neq0$ et $M^{-1}=\frac1{ad-bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix}$.
> - Si $M$ est inversible : $MX=V\iff X=M^{-1}V$.

> [!warning]
> **Pièges** : (1) $AB\neq BA$ en général ; (2) $AB=O$ n'implique **pas** $A=O$ ou $B=O$ ; (3) on ne « divise » pas par une matrice : on multiplie **à gauche** par $M^{-1}$ ; (4) $(A+B)^2\neq A^2+2AB+B^2$ (cela exigerait $AB=BA$).

---

## 1. Vocabulaire et notations

Une **matrice de taille $(n,p)$** (ou $n\times p$) a $n$ **lignes** et $p$ **colonnes**. On note $A=(a_{ij})$ où $a_{ij}$ est le coefficient de la ligne $i$ et de la colonne $j$ (la ligne d'abord).

$$
A=\begin{pmatrix}1&0&2\\-1&3&1\end{pmatrix}\ \text{est de taille }(2,3),\qquad a_{12}=0,\ a_{23}=1
$$

- **Matrice carrée** d'ordre $n$ : $n$ lignes et $n$ colonnes. On note $\mathcal{M}_n(\mathbb{R})$ leur ensemble.
- **Vecteur colonne** : matrice à une seule colonne $(n,1)$, comme $X=\begin{pmatrix}x\\y\end{pmatrix}$. **Vecteur ligne** : $(1,p)$.
- **Égalité** : deux matrices sont égales si elles ont la **même taille** et les mêmes coefficients.

## 2. Matrices particulières

| Matrice | Définition | Exemple |
| --- | --- | --- |
| **Nulle** $O$ | tous les coefficients valent $0$ | $\begin{pmatrix}0&0\\0&0\end{pmatrix}$ |
| **Identité** $I_n$ | carrée, $1$ sur la diagonale, $0$ ailleurs | $I_2=\begin{pmatrix}1&0\\0&1\end{pmatrix}$ |
| **Diagonale** | carrée, $a_{ij}=0$ si $i\neq j$ | $\begin{pmatrix}2&0&0\\0&3&0\\0&0&4\end{pmatrix}$ |
| **Triangulaire supérieure** | carrée, $a_{ij}=0$ si $i>j$ (zéros sous la diagonale) | $\begin{pmatrix}1&-2&2\\0&1&-4\\0&0&-2\end{pmatrix}$ |
| **Triangulaire inférieure** | carrée, $a_{ij}=0$ si $i<j$ | $\begin{pmatrix}1&0&0\\1&1&0\\-1&0&1\end{pmatrix}$ |
| **Symétrique** | carrée, $a_{ij}=a_{ji}$ ($M=M^T$) | $\begin{pmatrix}1&5\\5&2\end{pmatrix}$ |

> [!tip]
> Les matrices **triangulaires** sont celles que produit la méthode du pivot (voir [[3 – Méthode du pivot de Gauss]]).

## 3. Addition et multiplication par un réel

Ces deux opérations se font **terme à terme**.

- **Somme** : seulement pour deux matrices de **même taille**. $(A+B)_{ij}=a_{ij}+b_{ij}$.
- **Produit par un réel** $\lambda$ : $(\lambda A)_{ij}=\lambda a_{ij}$.

Avec $A=\begin{pmatrix}1&2\\3&4\end{pmatrix}$ et $B=\begin{pmatrix}5&6\\7&8\end{pmatrix}$ :

$$
A+B=\begin{pmatrix}6&8\\10&12\end{pmatrix},\qquad 2A=\begin{pmatrix}2&4\\6&8\end{pmatrix},\qquad 2A+3B=\begin{pmatrix}17&22\\27&32\end{pmatrix}
$$

Une expression comme $2A+3B$ est une **combinaison linéaire** de $A$ et $B$. L'addition est commutative et associative, $O$ est son neutre, et $\lambda(A+B)=\lambda A+\lambda B$.

## 4. Produit de deux matrices

### 4.1 Condition et taille

$AB$ n'existe que si **le nombre de colonnes de $A$ est égal au nombre de lignes de $B$**.

$$
A\ (n,p)\ \times\ B\ (p,q)\ =\ AB\ (n,q)
$$

### 4.2 Calcul

Le coefficient $(i,j)$ de $AB$ est la **ligne $i$ de $A$ multipliée terme à terme par la colonne $j$ de $B$**, puis sommée :

$$
(AB)_{ij}=\sum_{k=1}^{p}a_{ik}\,b_{kj}
$$

**Exemple** (matrices $(2,3)$ et $(3,2)$, résultat $(2,2)$) :

$$
\begin{pmatrix}1&0&2\\-1&3&1\end{pmatrix}\begin{pmatrix}3&1\\2&1\\1&0\end{pmatrix}
=\begin{pmatrix}1\cdot3+0\cdot2+2\cdot1&1\cdot1+0\cdot1+2\cdot0\\-1\cdot3+3\cdot2+1\cdot1&-1\cdot1+3\cdot1+1\cdot0\end{pmatrix}
=\begin{pmatrix}5&1\\4&2\end{pmatrix}
$$

**Cas particulier utile** : matrice × vecteur colonne. C'est ce qui permet d'écrire un système :

$$
\begin{pmatrix}1&2\\3&4\end{pmatrix}\begin{pmatrix}x\\y\end{pmatrix}=\begin{pmatrix}x+2y\\3x+4y\end{pmatrix}
$$

### 4.3 Le produit n'est pas commutatif

Avec $A$ et $B$ ci-dessus :

$$
AB=\begin{pmatrix}19&22\\43&50\end{pmatrix}\qquad BA=\begin{pmatrix}23&34\\31&46\end{pmatrix}\qquad AB\neq BA
$$

Même quand $AB$ et $BA$ existent toutes les deux, elles sont en général **différentes** (et peuvent même avoir des tailles différentes).

> [!warning]
> **Conséquences** : on distingue multiplier **à gauche** et **à droite** ; $(A+B)^2=A^2+AB+BA+B^2$ (pas $A^2+2AB+B^2$) ; et $AB=O$ n'implique pas $A=O$ ou $B=O$, par exemple $\begin{pmatrix}1&0\\0&0\end{pmatrix}\begin{pmatrix}0&0\\0&1\end{pmatrix}=O_2$.

### 4.4 Propriétés qui restent vraies

- **Associativité** : $(AB)C=A(BC)$.
- **Distributivité** : $A(B+C)=AB+AC$ et $(A+B)C=AC+BC$.
- **Neutre** : $MI_n=I_nM=M$ pour $M\in\mathcal{M}_n(\mathbb{R})$.
- $\lambda(AB)=(\lambda A)B=A(\lambda B)$.

### 4.5 Ce que fait la multiplication par une matrice particulière

À **gauche**, elle agit sur les **lignes** ; à **droite**, sur les **colonnes**. Par exemple, $J=\begin{pmatrix}0&1\\1&0\end{pmatrix}$ :

$$
JA=\begin{pmatrix}3&4\\1&2\end{pmatrix}\ (\text{lignes échangées}),\qquad AJ=\begin{pmatrix}2&1\\4&3\end{pmatrix}\ (\text{colonnes échangées})
$$

Multiplier à gauche par une matrice diagonale multiplie chaque ligne par un coefficient. C'est le point de départ de [[4 – Méthode de Gauss-Jordan]].

## 5. Puissances

Pour une matrice **carrée**, $A^2=AA$, $A^3=AAA$, etc., avec $A^0=I_n$.

- **Matrice diagonale** : on élève chaque terme de la diagonale : $\begin{pmatrix}2&0\\0&3\end{pmatrix}^n=\begin{pmatrix}2^n&0\\0&3^n\end{pmatrix}$.
- **Autre exemple** : $\begin{pmatrix}1&1\\0&1\end{pmatrix}^n=\begin{pmatrix}1&n\\0&1\end{pmatrix}$ (se montre par récurrence).

> [!warning]
> Pour une matrice quelconque, on **n'élève pas** les coefficients au carré : $\begin{pmatrix}1&2\\3&4\end{pmatrix}^2=\begin{pmatrix}7&10\\15&22\end{pmatrix}$, et non $\begin{pmatrix}1&4\\9&16\end{pmatrix}$.

## 6. Transposée

La **transposée** $M^T$ s'obtient en échangeant lignes et colonnes : $(M^T)_{ij}=m_{ji}$. Si $M$ est $(n,p)$, alors $M^T$ est $(p,n)$.

$$
\begin{pmatrix}1&0&2\\-1&3&1\end{pmatrix}^T=\begin{pmatrix}1&-1\\0&3\\2&1\end{pmatrix}
$$

Propriétés : $(A+B)^T=A^T+B^T$, $(\lambda A)^T=\lambda A^T$, $(M^T)^T=M$ et, attention à l'**ordre inversé** :

$$
(AB)^T=B^TA^T
$$

Vérification avec $A$ et $B$ de la section 3 : $(AB)^T=\begin{pmatrix}19&43\\22&50\end{pmatrix}=\begin{pmatrix}5&7\\6&8\end{pmatrix}\begin{pmatrix}1&3\\2&4\end{pmatrix}=B^TA^T$ ✅

## 7. Inverse : le principe

Deux éléments sont inverses l'un de l'autre si leur produit est l'élément neutre.

- Dans $\mathbb{R}$ : $1$ est neutre pour la multiplication, et $0{,}5=\frac12=2^{-1}$ est l'inverse de $2$ car $0{,}5\times2=2\times0{,}5=1$.
- Dans les matrices d'ordre 2 : $I_2=\begin{pmatrix}1&0\\0&1\end{pmatrix}$ est neutre ($MI_2=I_2M=M$), et

$$
\begin{pmatrix}1&1\\-1&1\end{pmatrix}\begin{pmatrix}1&-1\\1&1\end{pmatrix}
=\begin{pmatrix}1&-1\\1&1\end{pmatrix}\begin{pmatrix}1&1\\-1&1\end{pmatrix}
=\begin{pmatrix}1&0\\0&1\end{pmatrix}
$$

donc $\begin{pmatrix}1&1\\-1&1\end{pmatrix}$ est la matrice inverse de $\begin{pmatrix}1&-1\\1&1\end{pmatrix}$.

**Définition** : $M$ étant une matrice carrée d'ordre $n$, sa **matrice inverse** (si elle existe) est la matrice carrée d'ordre $n$, notée $M^{-1}$, telle que

$$
MM^{-1}=M^{-1}M=I_n
$$

## 8. Toutes les matrices ne sont pas inversibles

Dans $\mathbb{R}$, tout élément non nul est inversible (c'est ce qui permet de diviser). Dans l'ensemble $\mathcal{M}_n(\mathbb{R})$ des matrices carrées, il existe des **matrices non nulles non inversibles**, et il n'y a pas de division.

Pour déterminer si une matrice est inversible, et calculer son inverse, il existe des méthodes systématiques :

| Méthode | Remarque |
| --- | --- |
| **Cofacteurs / déterminant** | formule simple en ordre 2, vite lourde ensuite |
| **Gauss-Jordan** (retenue dans ce cours) | s'appuie sur le pivot, fonctionne en tout ordre, programmable |

## 9. Formule en ordre 2

$$
M=\begin{pmatrix}a&b\\c&d\end{pmatrix},\quad
\det M=ad-bc,\quad
M^{-1}=\frac{1}{ad-bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix}\ \ (\text{si }ad-bc\neq0)
$$

**Exemple** : $M=\begin{pmatrix}3&-2\\2&1\end{pmatrix}$, $\det M=3+4=7$, $M^{-1}=\frac17\begin{pmatrix}1&2\\-2&3\end{pmatrix}$.

> [!tip]
> **Réflexe de vérification** : calculer $MM^{-1}$ et retrouver $I_2$. C'est rapide en ordre 2.

## 10. Lien avec les systèmes

Un système de $n$ équations à $n$ inconnues s'écrit $MX=V$. Quand $M$ est inversible (ce qui n'est pas toujours le cas), le système a une **solution unique** :

$$
MX=V\implies M^{-1}(MX)=M^{-1}V\implies X=M^{-1}V
$$

**Résoudre un système $n\times n$ revient donc à inverser une matrice d'ordre $n$.** Mais que faire quand la matrice n'est pas inversible, ou quand $n>2$ ? C'est le but de [[3 – Méthode du pivot de Gauss]] et [[4 – Méthode de Gauss-Jordan]].

## 11. Quand l'inverse tombe « par chance »

Parfois, une relation propre à la matrice donne directement l'inverse par factorisation.

> [!example]
> **Exercice** : $A=\begin{pmatrix}-1&-2\\3&4\end{pmatrix}$.
>
> **a.** Vérifier $A^2-3A+2I_2=O_2$.
> $A^2=\begin{pmatrix}-5&-6\\9&10\end{pmatrix}$, $3A=\begin{pmatrix}-3&-6\\9&12\end{pmatrix}$, donc $A^2-3A+2I_2=\begin{pmatrix}-5+3+2&-6+6\\9-9&10-12+2\end{pmatrix}=O_2$ ✅
>
> **b.** En déduire que $A$ est inversible. $A^2-3A=-2I_2\Rightarrow A\cdot\frac{(3I_2-A)}{2}=I_2$, donc $A$ est inversible et $A^{-1}=\frac12(3I_2-A)=\begin{pmatrix}2&1\\-\frac32&-\frac12\end{pmatrix}$.
>
> **c.** Vérification par la formule : $\det A=-4+6=2$, $A^{-1}=\frac12\begin{pmatrix}4&2\\-3&-1\end{pmatrix}$ ✅ (même matrice).
>
> **d.** $AX=\begin{pmatrix}4\\2\end{pmatrix}\Rightarrow X=A^{-1}\begin{pmatrix}4\\2\end{pmatrix}=\begin{pmatrix}10\\-7\end{pmatrix}$.

## 12. Exercice récapitulatif (partie 1) corrigé

Soit $M=\begin{pmatrix}0&1&-1\\-3&4&-3\\-1&1&0\end{pmatrix}$.

1. **Calculer $M^2$** : $M^2=\begin{pmatrix}-2&3&-3\\-9&10&-9\\-3&3&-2\end{pmatrix}$.
2. **En déduire $M^2-3M$** : $M^2-3M=\begin{pmatrix}-2&0&0\\0&-2&0\\0&0&-2\end{pmatrix}=-2I_3$.
3. **Inversibilité** : $M^2-3M=-2I_3\Rightarrow M\cdot\left(-\tfrac12(M-3I_3)\right)=I_3$. Donc $M$ est inversible et

$$
M^{-1}=\frac12(3I_3-M)=\frac12\begin{pmatrix}3&-1&1\\3&-1&3\\1&-1&3\end{pmatrix}
$$

4. **Système** $(S_1)\begin{cases}y-z=2\\-3x+4y-3z=1\\-x+y=-1\end{cases}$
   - **a.** $MX=V$ avec $X=\begin{pmatrix}x\\y\\z\end{pmatrix}$ et $V=\begin{pmatrix}2\\1\\-1\end{pmatrix}$.
   - **b.** $X=M^{-1}V=\frac12\begin{pmatrix}3&-1&1\\3&-1&3\\1&-1&3\end{pmatrix}\begin{pmatrix}2\\1\\-1\end{pmatrix}=\frac12\begin{pmatrix}4\\2\\-2\end{pmatrix}=\begin{pmatrix}2\\1\\-1\end{pmatrix}$

     Vérification : $y-z=1+1=2$ ✅, $-6+4+3=1$ ✅, $-2+1=-1$ ✅.
