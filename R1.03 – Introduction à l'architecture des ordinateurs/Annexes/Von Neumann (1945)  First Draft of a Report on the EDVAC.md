> [!note]
> **John von Neumann, *First Draft of a Report on the EDVAC*** – 30 juin 1945, contrat W-670-ORD-4926 entre l'Ordnance Department de l'armée américaine et l'École d'électrotechnique de l'Université de Pennsylvanie (216 pages scannées, texte OCRé de qualité moyenne). Annexe des chapitres 1, 3 et 5 : c'est le document fondateur de l'architecture de Von Neumann**.

## Objet

Le rapport traite de la **structure d'un système de calcul automatique numérique très rapide** et en particulier de son **contrôle logique**. Un tel système doit exécuter, **sans intervention humaine intelligente**, des instructions à un niveau de détail absolument exhaustif (valeurs initiales, constantes, tables de fonctions), fournies sous une forme que la machine peut lire (cartes perforées, bande, fil magnétique, film, tableaux de câblage…), puis enregistrer ses résultats. Il note aussi que la machine produit beaucoup plus de données intermédiaires que de résultats finaux, et que des **pannes** doivent être détectées (et si possible corrigées) automatiquement.

## Les organes de la machine (section 2)

| Sigle du rapport | Organe | Équivalent dans le cours |
| --- | --- | --- |
| **CA** | *Central Arithmetical part* : organes spécialisés pour + − × ÷ | Unité de traitement / UAL |
| **CC** | *Central Control* : séquencement des opérations. Il faut distinguer les instructions propres au problème (à stocker) des organes de contrôle généraux qui les font exécuter | Unité de contrôle |
| **M** | *Memory* : nécessaire pour les résultats partiels des opérations, **les instructions**, les tables de fonctions, les conditions initiales/aux limites des équations aux dérivées partielles, les résultats intermédiaires… | Mémoire (programme + données) |
| **I** | *Input* : transfert de l'information du support externe vers la machine | Unité d'E/S |
| **O** | *Output* : transfert des résultats vers l'extérieur | Unité d'E/S |
| **R** | *Outside Recording medium* : support externe (cartes, bande…) | Périphériques de stockage |

Le rapport réalise ainsi l'idée centrale du cours : **un seul organe M contient aussi bien les nombres que les ordres (instructions)**.

## Plan du rapport (15 sections)

1. Définitions – 2. Subdivision principale du système (CA, CC, M, I, O, R) – 3. Méthode de discussion (dont vérification automatique des erreurs) – 4. Éléments, synchronisme et **analogie avec le neurone** (synapses excitatrices et inhibitrices ; lampes à vide) – 5. Principes des opérations arithmétiques (système **binaire vs décimal**, durée de la multiplication binaire, vitesse des lampes) – 6. **Éléments E** (éléments électroniques simples inspirés du neurone) – 7. Circuits pour l'addition et la multiplication – 8. Circuits pour la soustraction et la division – 9 et 10. Racine carrée, position de la virgule binaire – 11. Organisation de CA, liste complète des opérations – 12. **Capacité de la mémoire M** (mémoire cyclique à retard « *delay memory* » ; mémoire à iconoscope) – 13. Organisation de M – 14. CC et M : les ordres, temps d'attente, cycles mineurs/majeurs – 15. **Le code** : contenu de M (nombres standards, ordres), formulation du code.

## Ce qu'il faut retenir pour le cours

- **Programme enregistré** dans la même mémoire que les données.
- Un petit nombre d'unités : calcul, contrôle, mémoire, entrées/sorties.
- Travail en **binaire**, justifié par la simplicité des circuits.
- Un **jeu d'instructions** (les « ordres ») codé en mémoire.
- Le diaporama (diapos 6-7) cite 1945 et Von Neumann ; ce rapport en est la source directe.