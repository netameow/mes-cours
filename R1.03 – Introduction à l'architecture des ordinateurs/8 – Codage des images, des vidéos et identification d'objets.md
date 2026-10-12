> [!note]
> **Version simple**
> Une **image** est une grille de **pixels** ; chaque pixel est codé sur 1 bit (noir/blanc), 8 bits (gris) ou 24 bits (couleurs vraies). Pour que les fichiers restent légers, on les **compresse**, **sans perte** (on retrouve exactement l'original) ou **avec perte** (on jette ce que l'œil/l'oreille remarque à peine, comme le JPEG). Une **vidéo** = une suite d'images (+ compression temporelle, MPEG). Pour identifier des objets : code-barres, QR code, RFID.

---

# Version détaillée

## 1. Codage des images

- **Formats matriciels** (composés de pixels, abusivement appelés *bitmap*, propriétaires) ; **formats vectoriels** (formes géométriques décrites par des équations mathématiques).
- Exemple : une image de **1024 × 768** = 786 432 pixels.

| Codage | Bits par pixel | Taille |
| --- | --- | --- |
| Monochrome (noir et blanc) | 1 | 786 432 bits (≈ 98 Ko) |
| Niveaux de gris | 8 | ≈ 770 Ko |
| Couleurs indexées | 8 | ≈ 770 Kio |
| Couleurs vraies | 24 | 2,25 Mio |

Une couleur vraie en RVB = 3 composantes de 8 bits (rouge, vert, bleu) concaténées en un mot de 24 bits, souvent écrite en hexadécimal (ex. `#A42E14`). Voir l'annexe **TP2 – Couleurs**.

## 2. Techniques de compression

- **Sans perte** (documents, exécutables…) : exemple **RLE** (*Run Length Encoding*) : `SSYYYYYYYYPHHHHHHHERRRRRRRRRR` devient `SS@9YP@7HE@10R` (un caractère spécial suivi du nombre de répétitions).
- **Avec perte** (exemple **JPEG**) : l'image est décomposée en carrés de **8 × 8 pixels** ; on supprime les fréquences auxquelles l'œil (ou l'oreille) est peu sensible et les redondances spatiales.

## 3. Codage des vidéos

- Nombre d'images par seconde : 24, 25, 50, 60, 120…
- Sans compression : 22 500 images de 2,25 Mo = **50,625 Go**.
- **M-JPEG** : JPEG sur chaque image de la vidéo.
- Avec suppression des **redondances temporelles** (entre images successives) : **MPEG-1, MPEG-2, MPEG-4**.

## 4. Identification des objets

- **Code-barres**, **code QR**.
- **RFID** : ondes radio, visibilité inutile.