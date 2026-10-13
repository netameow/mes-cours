> [!note]
> **Version simple – l'essentiel en 2 minutes**
> - Deux éléments sont **inverses** si leur produit donne l'**élément neutre**. Dans $\mathbb{R}$ : $2\times0{,}5=1$. Pour les matrices, le neutre est la matrice identité $I_n$.
> - $M^{-1}$ est la matrice telle que $MM^{-1}=M^{-1}M=I_n$.
> - **Toutes les matrices non nulles ne sont pas inversibles** (contrairement aux réels non nuls). Il n'y a donc pas de « division » de matrices.
> - **Ordre 2** : si $M=\begin{pmatrix}a&b\\c&d\end{pmatrix}$ et $\det M=ad-bc\neq0$, alors $M^{-1}=\dfrac{1}{ad-bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix}$.
> - $\det M=0\Rightarrow M$ **non inversible**.
> - Si $M$ est inversible : $MX=V\iff X=M^{-1}V$.

> [!warning]
> **Piège** : on ne sait pas « diviser » par une matrice. On multiplie **à gauche** par $M^{-1}$ : $M^{-1}(MX)=M^{-1}V$. L'ordre compte, car le produit matriciel n'est pas commutatif.

---

## 1. Inverse : le principe

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

## 2. Toutes les matrices ne sont pas inversibles

Dans $\mathbb{R}$, tout élément non nul est inversible (c'est ce qui permet de diviser). Dans l'ensemble $\mathcal{M}_n(\mathbb{R})$ des matrices carrées, il existe des **matrices non nulles non inversibles**, et il n'y a pas de division.

Pour déterminer si une matrice est inversible, et calculer son inverse, il existe des méthodes systématiques :

| Méthode | Remarque |
| --- | --- |
| **Cofacteurs / déterminant** | formule simple en ordre 2, vite lourde ensuite |
| **Gauss-Jordan** (retenue dans ce cours) | s'appuie sur le pivot, fonctionne en tout ordre, programmable |

## 3. Formule en ordre 2

$$
M=\begin{pmatrix}a&b\\c&d\end{pmatrix},\quad
\det M=ad-bc,\quad
M^{-1}=\frac{1}{ad-bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix}\ \ (\text{si }ad-bc\neq0)
$$

**Exemple** : $M=\begin{pmatrix}3&-2\\2&1\end{pmatrix}$, $\det M=3+4=7$, $M^{-1}=\frac17\begin{pmatrix}1&2\\-2&3\end{pmatrix}$.

> [!tip]
> **Réflexe de vérification** : calculer $MM^{-1}$ et retrouver $I_2$. C'est rapide en ordre 2.

## 4. Lien avec les systèmes

Un système de $n$ équations à $n$ inconnues s'écrit $MX=V$. Quand $M$ est inversible (ce qui n'est pas toujours le cas), le système a une **solution unique** :

$$
MX=V\implies M^{-1}(MX)=M^{-1}V\implies X=M^{-1}V
$$

**Résoudre un système $n\times n$ revient donc à inverser une matrice d'ordre $n$.** Mais que faire quand la matrice n'est pas inversible, ou quand $n>2$ ? C'est le but de [[3 – Méthode du pivot de Gauss]] et [[4 – Méthode de Gauss-Jordan]].

## 5. Quand l'inverse tombe « par chance »

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

## 6. Exercice récapitulatif (partie 1) corrigé

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
