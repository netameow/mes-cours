> [!note]
> **Version simple**
> L'architecture de Von Neumann rêve d'une machine à **mémoire infinie** et **vitesse infinie**. En vrai, on s'en approche : mémoires immenses, temps de l'ordre de la nanoseconde. Quand une seule puce ne suffit plus, on **multiplie les cœurs** (plusieurs processeurs sur la même puce), et pour les problèmes gigantesques (météo, simulation) on construit des **supercalculateurs** : des milliers de processeurs reliés par un réseau ultra-rapide.
> 
> Limite majeure : la **chaleur** (consommation ∝ carré de la fréquence).

---

# Version détaillée

## 1. Objectif et contexte

- Objectif : se rapprocher le plus possible de la machine de Turing, c'est-à-dire **mémoire infinie** et **vitesse de traitement infinie**.
- En réalité : la mémoire peut être grande (des Go, voire des To sur les supercalculateurs) ; les temps de traitement et d'accès mémoire peuvent être très courts (inférieurs à la ns) ; les temps de l'UE/S sont moins cruciaux (il suffit qu'ils soient compatibles avec l'utilisateur, sauf stockage et réseaux).
- Certains programmes demandent de **grandes quantités de calculs** (simulations, météo), d'autres des **temps courts** (temps réel), d'autres les deux (éclairage de scènes 3D dans les jeux).
- Pour conserver l'architecture de Von Neumann, il faut améliorer les **3 unités : mémoire, UT et UC**.

## 2. Améliorer l'unité de traitement

- Ajouter des opérations à l'UT ne sert pas à grand-chose (CISC) ; il vaut mieux **accélérer les opérations** (RISC).
- Exemple : une addition se fait chiffre par chiffre en reportant la retenue ; on ne peut pas ajouter les centaines avant les dizaines puisqu'on ne connaît pas la retenue. Des astuces existent (prédiction de retenue) mais c'est limité.
- Solution : modifier l'architecture de l'UT : **pipeline** et **parallélisme** (voir chapitre 6).
- **Résultat** : tout ce qui pouvait être parallélisé l'a été. Pendant l'exécution d'une instruction on prépare les suivantes, les opérandes, et on range les résultats ; traitements en parallèle dans l'UT et en pipeline dans les unités de calcul. On a jusqu'à **10 instructions en cours** en même temps (en recouvrement), donc **plus d'une instruction par cycle**. Impossible de savoir combien d'instructions par seconde : cela dépend de la prédiction, du remplissage des files, des remplacements de cache, de l'occupation des unités de calcul…

## 3. Peut-on faire mieux ?

| Unité | Piste | Verdict |
| --- | --- | --- |
| Mémoire | Plus de niveaux de cache | Inutile (on ne gagne rien) |
| Mémoire | Caches plus grands, plus rapides | Trop cher |
| Mémoire | Disques plus rapides | Peu utile : le disque est 100 000 fois plus lent que la mémoire |
| UT | Plus d'unités | On ne parvient pas à les occuper |
| UC | Meilleure prédiction / plus d'instructions en parallèle | Plutôt un problème de **compilateurs** (optimiser le code généré, ordre des instructions, anticipation) |
| UC (séquenceur) | Accélérer l'horloge | Puissance ∝ carré de la vitesse → la température augmente. On peut accélérer **temporairement** (mode **turbo**) puis revenir à la normale si ça chauffe ou si la charge baisse |

**Alors on fait quoi ?** → les multi-cœurs.

## 4. Multi-cœurs et multi-threading

- La solution : mettre **plusieurs processeurs (UC + UT)** sur la même puce. Chacun exécute plus d'une instruction par cycle, donc avec N cœurs on peut exécuter N fois plus d'instructions par cycle.
- Mettre N cœurs, c'est : **N UC+UT**, **N caches L1**, **N caches L2**, en général **un seul cache L3**, **une seule mémoire** et **une seule unité d'E/S**.
- Le parallélisme n'est plus dans l'exécution des instructions mais dans l'**exécution des programmes** (plusieurs programmes en même temps) : c'est un problème de **système d'exploitation** (répartir les tâches au mieux sur les cœurs).
- Chaque cœur est lui-même **multi-thread** et peut se faire passer pour 2 cœurs.
- Combien de cœurs ? C'est un problème d'intégration mais surtout de **consommation électrique, donc de température**. On trouve des processeurs à 4 cœurs mais aussi à 64 cœurs ou plus. Un système de refroidissement plus cher que l'ordinateur n'est pas viable ; le problème est différent sur les serveurs en salles climatisées. Du point de vue écologique, les serveurs consomment plus en climatisation que par leur fonctionnement propre.

## 5. Supercalculateurs

- But : puissance de calcul élevée pour des problèmes spécifiques (simulation, météorologie, médical…). Un seul processeur, même multicœur, ne suffit pas : il faut en mettre **plusieurs qui travaillent ensemble**, soit en partageant une **mémoire commune** (peu utilisé, limité), soit en communiquant par des **réseaux ultra-rapides**.
- Peu nombreux, limités à des usages très spécifiques (militaire, industrie, recherche).
- **Mesure de la puissance** : calcul intensif, on ne compte pas les instructions mais les **opérations sur des réels par seconde**. Unité : le **TFlop/s** = 1000 milliards d'opérations sur des réels par seconde, mesuré par des programmes utilisant simultanément tous les cœurs.
- **Architecture** : des **cartes** avec un ou plusieurs processeurs multicœurs et de la mémoire ; la mémoire totale = somme de celle de chaque carte ; les cartes sont reliées par un **réseau local ultra-rapide**.

### Le plus puissant du cours : Fugaku (Fujitsu, RIKEN, Kobe, Japon)

| Caractéristique | Valeur |
| --- | --- |
| Cœurs | 7 299 072 (152 064 processeurs A64FX 48 cœurs à 2 GHz, turbo 2,2 GHz) |
| Mémoire | 4 866 048 Go (32 Go par processeur) |
| Interconnexion | Tofu interconnect D (28 Gb/s) |
| Performance | max théorique 513 855 TFlop/s ; mesurée 415 530 TFlop/s |
| Système | Red Hat Enterprise Linux 8 |
| Architecture physique | 396 armoires de 384 processeurs ; consommation 28 334 kW (un TGV au démarrage : 8 800 kW) |
| Processeur | Armv8.2-A SVE (64 bits, calcul vectoriel sur 128 bits) ; 48 cœurs de calcul + 2 pour le SE ; L1 : 2×64 Ko ; L2 : 8 Mo ; **pas de L3** car RAM rapide |

### En France

- **Adastra** (Cray, modèle HPE Cray EX) au Cines de Montpellier : modélisation environnementale, médicale, astrophysique ; 319 072 cœurs, CPU AMD EPYC ; 338 nœuds GPU de 4 cartes graphiques = 1 352 cartes interconnectées à 200 Gb/s ; refroidissement liquide à eau chaude (97 % de la chaleur), PUE de 1,10, consommation soutenue max 1,59 MW ; 11ᵉ au TOP 500, 3ᵉ meilleur rapport puissance/consommation ; 8 m × 2 m, 2 tonnes, 30 M€.
- **Tera-1000-2** (CEA) : 294 916 cœurs (4 337 Intel Xeon Phi 7250, 68 cœurs à 1,4 GHz), 589 824 Go, mesuré à 11 965 TFlop/s.
- **Belenos** (Météo France) : 561 408 cœurs (8 772 AMD EPYC 7742, 64 cœurs à 2,25 GHz), 1 585 152 Go, mesuré à 7 683 TFlop/s.

> Annexe liée : **The Computer and the Brain** (Von Neumann) compare calculateur et cerveau (vitesse, taille des composants, énergie, parallélisme).