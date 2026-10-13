> [!note]
> **TP1 – R1.3 Architecture des ordinateurs : Architecture générale** (révisions, 3 pages, par binôme, Internet autorisé). Annexe des chapitres 2 à 6.

> Les énoncés sont résumés ci-dessous. Les « pistes » sont **mes propres réponses de révision** (calculs refaits à la main, ou notions du cours) et ne sont pas une correction officielle : à vérifier avec ton binôme / l'enseignant.

## 1) Architecture générale

- **Q1** : compléter le schéma de la machine de Von Neumann (cases à remplir : flèches entre blocs, bloc du bas relatif aux E/S) → chapitre 3 et chapitre 5 : UC, UT, mémoire, E/S.
- **Q2** : compléter le schéma d'un PC (blocs processeur, mémoire, bus, périphériques) → chapitre 3.
- **Q3** : identifier 8 composants numérotés sur une photo de carte mère (le schéma pointe notamment les barrettes de mémoire, le support du processeur, le ventirad et les slots d'extension) → chapitre 1 (matériel).

## 2) Bus

**Q4 – Bus mémoire** : calculer les taux de transfert (débit = largeur en octets × fréquence).

|   | EDO | SDRAM | SDRAM PC100 | SDRAM PC2100 (DDR) |
| --- | --- | --- | --- | --- |
| Largeur (bits) | 32 | 64 | 64 | 64 |
| Fréquence (MHz) | 66 | 66 | 100 | 133 |
| **Piste : débit (Mo/s)** | 4 × 66 = **264** | 8 × 66 = **528** | 8 × 100 = **800** | 8 × 133 × 2 (double débit) ≈ **2 128** |

**Q5 – Bus périphérique** :

|   | ISA | EISA | PCI | AGP | AGP 4x |
| --- | --- | --- | --- | --- | --- |
| Largeur (bits) | 16 | 32 | 32 | 32 | 32 |
| Fréquence (MHz) | 8,33 | 8,33 | 33,33 | 66,66 | 66,66 |
| **Piste : débit (Mo/s)** | 2 × 8,33 ≈ **16,7** | 4 × 8,33 ≈ **33,3** | 4 × 33,33 ≈ **133,3** | 4 × 66,66 ≈ **266,6** | × 4 transferts par cycle ≈ **1 066** |

## 3) Processeur

- **Q6** : bus d'adresses de 16 bits → espace adressable maximum ? Piste : 2¹⁶ = **65 536 adresses**, soit **64 Kio** (en adressage par octet). Pour adresser plus : **élargir le bus d'adresses**, ou utiliser des **registres de segment / pagination (bank switching)** pour composer des adresses plus larges.
- **Q7** : où sont effectués les calculs ? Piste : dans l'**UT / UAL** du processeur (avec ses registres OP1, OP2, Res, état) → chapitre 3.
- **Q8** : quelle tâche réalise le **séquenceur** ? l'**ordonnanceur** ? Piste : le séquenceur enchaîne les ordres élémentaires (micro-programme) d'une instruction au rythme de l'horloge → chapitre 5 ; l'ordonnanceur (*scheduler*) répartit le temps du processeur entre les tâches/processus (système d'exploitation) et, dans un processeur moderne, l'ordre d'exécution des instructions → chapitres 6 et 7.

## 4) Mémoires

- **Q9** : différences **DRAM / SRAM**, où les utilise-t-on ? Piste (chapitre 4 et 6) : DRAM = dynamique, doit être rafraîchie, dense et peu chère → mémoire principale ; SRAM = statique, pas de rafraîchissement, très rapide mais chère → caches.
- **Q10** : **RAM / ROM**, où utilise-t-on la ROM ? Piste : RAM lue/écrite, volatile ; ROM lecture seule, non volatile → programme de démarrage (BIOS/bootstrap, chapitre 5).
- **Q11** : qu'est-ce que le **shadowing** ? Piste (notion hors diaporama) : copier au démarrage le contenu de la ROM (BIOS, BIOS vidéo) dans la RAM, plus rapide, pour accélérer son exécution.
- **Q12** : classer **RAM, registres, disques durs, cache L1, cache L2, CD-ROM** par taille et par rapidité. Piste (chapitre 4) : rapidité décroissante : registres > L1 > L2 > RAM > disque dur > CD-ROM ; taille croissante : registres < L1 < L2 < RAM < CD-ROM (≈ 700 Mo) < disque dur (le disque dur est en général plus gros que le CD-ROM).
- **Q13** : propriétés des disques **RAID**, comment les obtient-on ? Piste (hors diaporama) : *Redundant Array of Independent Disks*, plusieurs disques regroupés pour la **performance** (répartition des données, *striping*, RAID 0) et/ou la **tolérance aux pannes** (miroir RAID 1, parité RAID 5).
- **Q14** : valeur décimale de `1101 1001 0111 0101` (entier signé en complément à 2 sur 16 bits). Piste : bit de poids fort = 1 → négatif. Inverser : `0010 0110 1000 1010` ; +1 : `0010 0110 1000 1011` = `0x268B` = 9867. Donc **−9867**. (Vérification : `0xD975` = 55 669 ; 55 669 − 65 536 = −9867.)
- **Q15a** : tableau de conversion. Pistes : 121 = `0111 1001` binaire = `$79` hexa ; `%0110 1101` = 109 = `$6D` ; `$D9` = 217 = `%1101 1001`. (Notation du TP : `%` binaire, `$` hexa.)
- **Q15b** : donner le complément à deux de nombres listés dans un tableau du PDF (inverser les bits puis ajouter 1, cf. chapitre 2).
- **Q16** : intérêt des **mémoires cache** ? Piste : réduire le temps d'accès moyen en gardant près du processeur une copie des données/instructions en cours d'utilisation (localité) → chapitre 4.
- **Q17** : que permet de prédire la **loi de Moore** ? Piste : l'évolution du **nombre de transistors par puce**, qui double environ tous les 2 ans → chapitre 6 (aujourd'hui 50 milliards par processeur).