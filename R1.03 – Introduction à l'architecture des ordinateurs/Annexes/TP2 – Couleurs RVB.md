> [!note] 📎
> **TP2 – Représentation des couleurs en RVB (RGB)**. Annexe des chapitres 2 et 8.

## Notions du TP

Modes de représentation des couleurs en informatique : **RVB** (RGB), **TSL** (HSL : teinte, saturation, lumière) ; le codage **YUV** (YCrCb, YPrPb, YDbDr…) est plutôt utilisé en télévision.

|   | Synthèse **additive** | Synthèse **soustractive** |
| --- | --- | --- |
| On part de | du **noir** (écran éteint) et on **ajoute** des couleurs | du **blanc** (feuille) et on **enlève** des couleurs |
| Exemples | écrans (LED, plasma) | imprimantes, peinture |
| Primaires | Rouge, Vert, Bleu | Magenta, Jaune, Cyan |
| Les 3 ensemble | blanc | noir |
| Aucune | noir | blanc |

Mélanges 2 à 2 en additif : R+B = magenta, R+V = jaune, B+V = cyan (les primaires du soustractif, qui sont les complémentaires de celles de l'additif).

- **Codage RVB** : chaque composante est un **entier naturel sur 8 bits**, et les 3 composantes sont concaténées dans l'ordre R, V, B pour former un **mot de 24 bits**. En HTML on l'écrit en **hexadécimal** précédé de `#`.
- **Niveaux de gris** : un gris a ses 3 composantes **identiques** (plus la valeur est élevée, plus c'est clair ; au maximum, blanc). Passage couleur → gris :

$$
G = \text{arrondi}(0{,}2125\,R + 0{,}7154\,V + 0{,}0721\,B)
$$

## Exercices

### 1° Transformer `A42E14` en niveaux de gris

- `A4` = 164, `2E` = 46, `14` = 20.
- G = 0,2125 × 164 + 0,7154 × 46 + 0,0721 × 20 = 34,85 + 32,9084 + 1,442 = 69,2004 → **69** = `0x45`.
- Résultat : gris `#454545` (les 3 composantes valent 69).

### 2° Programme C : saisie de 3 entiers (0-255) et affichage du code HTML du gris

```c
#include <stdio.h>

int main(void) {
    int r, v, b;
    printf("R V B (0-255) : ");
    if (scanf("%d %d %d", &r, &v, &b) != 3) return 1;
    int g = (int)(0.2125 * r + 0.7154 * v + 0.0721 * b + 0.5); /* arrondi */
    printf("#%02X%02X%02X\n", g, g, g);
    return 0;
}
```

### 3° Variante : saisie en hexadécimal

```c
#include <stdio.h>

int main(void) {
    unsigned int r, v, b;
    printf("Couleur en hexa (ex. A42E14) : ");
    if (scanf("%2x%2x%2x", &r, &v, &b) != 3) return 1;
    int g = (int)(0.2125 * r + 0.7154 * v + 0.0721 * b + 0.5);
    printf("#%02X%02X%02X\n", g, g, g);
    return 0;
}
```

> Ces programmes sont mes propositions (test mental sur `A42E14` : sortie `#454545`). Le calcul de l'arrondi par `+ 0.5` fonctionne car les valeurs sont positives.