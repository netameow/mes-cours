> [!note]
> **Annexe du chapitre 2** – document de cours (2 pages) : *Le codage des caractères*.

## Résumé

- **1963** : premier code à 7 bits aux États-Unis, le **code ASCII** (*American Standard Code for Information Interchange*).
- Les organismes de normalisation (ISO) publient une version améliorée, l'**ISO-8859**, avec des variantes par pays : pour la France **8859-1 (Latin-1)** puis **8859-15 (Latin-9)** qui intègre de nouveaux symboles. Certains codes inutilisés par l'ISO-8859 ont des variantes selon le système d'exploitation (ex. **Windows-1252**).
- **1992** : la norme **ISO/CEI 10646 (Unicode)** définit plus d'un million de caractères et des représentations **UTF** (*Unicode Transformation Format*) : **UTF-8, UTF-16, UTF-32**, avec des codes de **1 à 4 octets**.
- L'**ASCII standard** correspond aux codes sur **un seul octet** de l'UTF-8 (dont le **premier bit est toujours 0**).

## UTF-8 sur 1 octet (ASCII)

Ligne = 4 bits de poids faible (b3 b2 b1 b0), colonne = 3 bits suivants (b6 b5 b4). `SP` = espace.

| Bits b3-b0 | 000 | 001 | 010 | 011 | 100 | 101 | 110 | 111 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0000 | NUL | DLE | SP | 0 | @ | P | ` | p |
| 0001 | SOH | DC1 | ! | 1 | A | Q | a | q |
| 0010 | STX | DC2 | " | 2 | B | R | b | r |
| 0011 | ETX | DC3 | # | 3 | C | S | c | s |
| 0100 | EOT | DC4 | $ | 4 | D | T | d | t |
| 0101 | ENQ | NAK | % | 5 | E | U | e | u |
| 0110 | ACK | SYN | & | 6 | F | V | f | v |
| 0111 | BEL | ETB | ' | 7 | G | W | g | w |
| 1000 | BS | CAN | ( | 8 | H | X | h | x |
| 1001 | TAB | EM | ) | 9 | I | Y | i | y |
| 1010 | LF | SUB | * | : | J | Z | j | z |
| 1011 | VT | ESC | + | ; | K | [ | k | { |
| 1100 | FF | IS4 | , | < | L | \ | l | | |
| 1101 | CR | IS3 | - | = | M | ] | m | } |
| 1110 | SO | IS2 | . | > | N | ^ | n | ~ |
| 1111 | SI | IS1 | / | ? | O | _ | o | DEL |

Exemple : la lettre `A` est en colonne 100, ligne 0001 → `0100 0001` en binaire, soit `41` en hexadécimal (on retrouve un premier bit à 0).

## Caractères accentués : UTF-8 sur 2 octets

Les caractères accentués (ainsi que les signes de multiplication et de division) sont codés sur **2 octets** dont le **premier est **`**11000011**`. Le second octet (`10xxxxxx`) est donné par la table suivante : les 2 bits suivant `10` donnent la colonne, les 4 bits de poids faible la ligne.

| Bits b3-b0 | `10 00` | `10 01` | `10 10` | `10 11` |
| --- | --- | --- | --- | --- |
| 0000 | À | Ð | à | ð |
| 0001 | Á | Ñ | á | ñ |
| 0010 | Â | Ò | â | ò |
| 0011 | Ã | Ó | ã | ó |
| 0100 | Ä | Ô | ä | ô |
| 0101 | Å | Õ | å | õ |
| 0110 | Æ | Ö | æ | ö |
| 0111 | Ç | × | ç | ÷ |
| 1000 | È | Ø | è | ø |
| 1001 | É | Ù | é | ù |
| 1010 | Ê | Ú | ê | ú |
| 1011 | Ë | Û | ë | û |
| 1100 | Ì | Ü | ì | ü |
| 1101 | Í | Ý | í | ý |
| 1110 | Î | Þ | î | þ |
| 1111 | Ï | ß | ï | ÿ |

Exemple : `é` = `11000011` + `10 10 1001` = `11000011 10101001` (soit `C3 A9`). C'est aussi la cause classique des **mojibakes** : lire ces 2 octets avec un décodage Latin-1 donne `Ã©` au lieu de `é`.

> Voir le chapitre 2 (sections 7 : représentation des caractères).