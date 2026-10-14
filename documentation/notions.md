# Comprendre le projet Tokenizer

> Un guide pour partir de zéro : aucune connaissance en blockchain ou en crypto n'est nécessaire.
> Fil rouge : le token **ycandela-42 (YC42)**, un token ERC-20 sur **Ethereum**, créé pour le projet Tokenizer de 42.

Chaque notion est expliquée d'abord avec une **image de la vie courante**, puis avec les détails techniques.

## Sommaire

1. [La blockchain](#1-la-blockchain)
2. [Les comptes et les wallets](#2-les-comptes-et-les-wallets)
3. [Les transactions et les frais](#3-les-transactions-et-les-frais)
4. [Mainnet, testnet et faucet](#4-mainnet-testnet-et-faucet)
5. [Les smart contracts](#5-les-smart-contracts)
6. [Les tokens](#6-les-tokens)
7. [Créer et détruire des tokens](#7-créer-et-détruire-des-tokens)
8. [Le propriétaire et les permissions](#8-le-propriétaire-et-les-permissions)
9. [Lire un contrat Solidity](#9-lire-un-contrat-solidity)
10. [OpenZeppelin](#10-openzeppelin)
11. [Les outils](#11-les-outils)
12. [Sécurité](#12-sécurité)
13. [Le bonus : le multisig](#13-le-bonus--le-multisig)
14. [Ce que demande le projet](#14-ce-que-demande-le-projet)
15. [Glossaire](#15-glossaire)
16. [Pour aller plus loin](#16-pour-aller-plus-loin)

---

## 1. La blockchain

**L'image : un cahier de comptes partagé.**

Imagine un cahier où l'on note toutes les opérations : « Alice donne 5 à Bob ». Au lieu d'être rangé dans une banque, ce cahier est **copié à l'identique chez des milliers de personnes** à travers le monde. Quand une nouvelle opération arrive, tout le monde l'ajoute dans sa copie.

Conséquences :

- **Personne ne contrôle seul le cahier** : pas de banque ni d'État au milieu. On dit que c'est *décentralisé*.
- **Impossible de tricher discrètement** : si quelqu'un modifie sa copie, elle ne correspond plus à celles des autres et elle est rejetée.
- **On ne peut rien effacer** : on ne fait qu'ajouter des pages. L'historique est *immuable*.

Les ordinateurs qui gardent une copie du cahier s'appellent des **nœuds**.

### Les blocs et la chaîne

Les opérations sont regroupées par paquets appelés **blocs** (les pages du cahier). Chaque bloc contient l'**empreinte** (le *hash*) du bloc précédent, d'où le nom de *chaîne de blocs*.

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Bloc 100   │     │   Bloc 101   │     │   Bloc 102   │
│  opérations  │◄────│  opérations  │◄────│  opérations  │
│              │     │ préc : a3f9… │     │ préc : 7c21… │
│ hash : a3f9… │     │ hash : 7c21… │     │ hash : e04b… │
└──────────────┘     └──────────────┘     └──────────────┘
```

> **Un hash, c'est quoi ?**
> Une fonction qui transforme n'importe quelle donnée en une empreinte de taille fixe (`a3f9…`). Changer une seule lettre de la donnée donne une empreinte complètement différente.
> Si quelqu'un modifie le bloc 100, son hash change, le bloc 101 ne pointe plus dessus, et toute la suite devient invalide. C'est ce qui rend la blockchain infalsifiable.

### Le consensus : qui écrit la page suivante ?

Il faut se mettre d'accord sur qui a le droit d'ajouter le prochain bloc. C'est le **mécanisme de consensus**. Il en existe plusieurs :

| Mécanisme | Utilisé par | Principe |
|---|---|---|
| Proof of Work | Bitcoin | Des machines résolvent un calcul très coûteux, la première qui trouve écrit le bloc |
| Proof of Stake | **Ethereum** (depuis 2022) | Des validateurs bloquent de l'ETH en garantie, et le perdent s'ils trichent |
| Proof of Staked Authority | BNB Smart Chain | Un petit nombre de validateurs, choisis selon l'argent mis en jeu. Plus rapide, mais plus centralisé |

Pour le projet, il suffit de savoir que ça existe et de pouvoir l'expliquer en une phrase.

### Les principales blockchains

| Blockchain | Monnaie | Particularité |
|---|---|---|
| Bitcoin | BTC | La première. Ne sait presque pas exécuter de programmes |
| **Ethereum** | **ETH** | A inventé les smart contracts et la norme de token ERC-20 |
| BNB Smart Chain (BSC) | BNB | Copie compatible d'Ethereum, avec des frais plus bas. Partenaire du sujet |

### Pourquoi Ethereum ?

Le sujet te laisse libre de choisir ta blockchain, à condition d'en **respecter le standard**, et il cite justement « ERC20 pour ETH ». Quelques arguments à reprendre dans ton README :

- **C'est la référence** : Ethereum a inventé les smart contracts et la norme ERC-20. Les autres blockchains, comme BSC, l'ont copiée.
- **C'est l'écosystème le mieux documenté** : outils, tutoriels, bibliothèques (OpenZeppelin), explorateur (Etherscan).
- **Le code est portable** : un contrat écrit pour Ethereum fonctionne tel quel sur les blockchains compatibles.
- **L'inconvénient** : les frais sont élevés sur le vrai réseau. Ici ça ne compte pas, puisqu'on reste sur un réseau de test.

---

## 2. Les comptes et les wallets

**L'image : une boîte aux lettres et sa clé.**

- L'**adresse** (`0x71C7…976F`) est comme l'adresse de ta boîte aux lettres : tu peux la donner à tout le monde pour recevoir.
- La **clé privée** est la clé de la boîte : celui qui l'a peut prendre tout ce qu'il y a dedans.

Techniquement, la clé privée est un très grand nombre secret. On en calcule une adresse publique, mais l'inverse est impossible : connaître l'adresse ne permet pas de retrouver la clé.

### Signer

Pour envoyer quelque chose, tu **signes** l'opération avec ta clé privée. Tout le monde peut vérifier que la signature vient bien de toi, sans jamais voir ta clé. C'est une signature manuscrite impossible à imiter.

### La seed phrase

La **seed phrase** (phrase de récupération) est une liste de 12 ou 24 mots qui permet de recréer toutes tes clés.

- Tu la perds : tu perds l'accès à ton compte, pour toujours.
- Tu la donnes : on peut te voler tout ce que tu possèdes.

### Le wallet

Un **wallet** (portefeuille) est un logiciel qui garde tes clés et signe à ta place. Le plus courant est **MetaMask**, une extension de navigateur.

Attention à l'image trompeuse : un wallet ne « contient » pas d'argent. L'argent est inscrit sur la blockchain ; le wallet garde seulement les clés qui permettent de le dépenser.

### Deux types de comptes

| Type | Contrôlé par | Exemple |
|---|---|---|
| Compte utilisateur (EOA, *Externally Owned Account*) | Une clé privée | Ton compte MetaMask |
| Compte contrat | Son code | Ton token YC42 une fois déployé |

> ⚠️ **Règle d'or** : ne partage *jamais* ta clé privée ni ta seed phrase, et ne les mets jamais dans un dépôt Git.
> Pour ce projet, crée un **wallet dédié aux tests**, séparé de tout wallet personnel.

---

## 3. Les transactions et les frais

Une **transaction** est une demande signée pour modifier la blockchain : envoyer de l'argent, déployer un contrat, appeler une fonction qui change quelque chose…

### Le gas : le prix du travail

**L'image : le timbre sur une lettre.**

Chaque transaction demande du travail aux nœuds du réseau. On le paie en **gas**, réglé en **ETH**.

- Plus l'opération est complexe, plus elle consomme de gas.
- Les frais valent : gas consommé × prix d'une unité de gas.
- Conséquence : il faut **toujours avoir un peu d'ETH** pour agir, même pour envoyer tes propres tokens.

### Les unités de l'ETH

Comme l'euro se divise en centimes, l'ETH se divise en toutes petites unités :

| Unité | Valeur | Usage |
|---|---|---|
| **wei** | la plus petite unité possible | C'est ce que la blockchain stocke vraiment |
| **gwei** | 1 000 000 000 wei (10⁹) | Sert à exprimer le prix du gas |
| **ETH** | 1 000 000 000 000 000 000 wei (10¹⁸) | Ce qu'affichent les wallets |

Retiens ce « 10¹⁸ » : tu le retrouveras avec les tokens ([section 6](#6-les-tokens)).

### Lire est gratuit, écrire est payant

| Action | Transaction ? | Coût |
|---|---|---|
| Consulter un solde | Non | Gratuit |
| Envoyer des tokens | Oui | Du gas |
| Déployer un contrat | Oui | Du gas (plus cher) |

### Suivre une transaction

Chaque transaction a un identifiant unique, son **hash** (`0x5e3a…`). On la retrouve sur un **explorateur de blocs**, un site qui affiche tout le contenu de la blockchain. Pour Ethereum, c'est **Etherscan**.

Tout y est public : qui a envoyé quoi, à qui et quand.

> Le **nonce** est un compteur de transactions propre à chaque compte (0, 1, 2…). Il empêche qu'une même transaction soit rejouée deux fois.

---

## 4. Mainnet, testnet et faucet

**L'image : l'argent du Monopoly.**

- Le **mainnet** est la vraie blockchain : sa monnaie a une vraie valeur.
- Un **testnet** fonctionne exactement pareil, mais sa monnaie ne vaut rien. Il sert à s'entraîner et à tester.

Le sujet est clair : **on ne te demandera jamais d'utiliser de l'argent réel**. On travaille donc sur **Sepolia**, le testnet de référence d'Ethereum pour les applications :

| | Sepolia |
|---|---|
| Identifiant du réseau (*chainId*) | `11155111` |
| Monnaie | SepoliaETH (de l'ETH de test) |
| Explorateur | https://sepolia.etherscan.io |

Sepolia est déjà intégré à MetaMask : il suffit d'activer l'affichage des réseaux de test.

### Le faucet

Un **faucet** (« robinet ») est un site qui distribue gratuitement de la monnaie de test : tu donnes ton adresse, tu reçois des SepoliaETH.

⚠️ Sur Sepolia, c'est souvent **l'étape la plus pénible du projet**. Pour éviter les abus, beaucoup de faucets demandent un compte (Google, Alchemy…) ou un petit solde de vrais ETH sur le mainnet. Ceux qui restent accessibles :

- le **faucet Google Cloud Web3** : il suffit d'un compte Google ;
- le **PoW faucet** (pk910) : ton navigateur fait un petit calcul pendant quelques minutes pour « gagner » des SepoliaETH, sans aucune condition.

Les liens sont dans la [section 16](#16-pour-aller-plus-loin). Récupère tes SepoliaETH **dès le début**, sans attendre d'avoir fini le code. Déployer un token ne coûte qu'une petite fraction de SepoliaETH.

---

## 5. Les smart contracts

**L'image : un distributeur automatique.**

Tu mets une pièce, tu appuies sur un bouton et tu reçois ta canette. Pas besoin de vendeur : les règles sont dans la machine, elles s'appliquent toutes seules et pareil pour tout le monde.

Un **smart contract** (contrat intelligent), c'est ça : un programme **installé sur la blockchain**, à sa propre adresse. Il possède :

- un **état** : des données qu'il garde en mémoire, par exemple le solde de chaque personne ;
- des **fonctions** que n'importe qui peut appeler, par exemple `transfer` pour envoyer des tokens.

### Ce qu'il faut retenir

- **Le code est public** : tout le monde peut le lire.
- **Le code est définitif** : une fois déployé, on ne peut plus le modifier. Si on trouve un bug, il faut déployer un nouveau contrat, à une nouvelle adresse. D'où l'importance de **tester avant**.
- **Il s'exécute tout seul et pareil pour tous** : personne ne peut tricher ni faire d'exception.

### Du code au contrat déployé

```
   YC42.sol                                ┌─► bytecode ──► déployé sur la blockchain
  (Solidity,     ───── compilation ────────┤
   lisible)                                └─► ABI ──────► mode d'emploi pour les outils
```

| Terme | Signification |
|---|---|
| **Solidity** | Le langage dans lequel on écrit le contrat. Il ressemble un peu au C et au JavaScript |
| **Bytecode** | La version compilée du contrat, que la machine exécute |
| **ABI** | Un fichier JSON qui liste les fonctions du contrat et leurs paramètres. C'est le « mode d'emploi » qu'utilisent MetaMask, Etherscan ou un site web pour parler au contrat |
| **EVM** (*Ethereum Virtual Machine*) | La machine virtuelle qui exécute le bytecode sur chaque nœud Ethereum |

### Vérifier et publier le contrat

Sur la blockchain, seul le bytecode est stocké, et il est illisible pour un humain. **Vérifier** un contrat, c'est publier son code source sur Etherscan, qui confirme qu'il correspond bien au bytecode.

Ensuite, tout le monde peut lire le code et appeler les fonctions directement depuis le site (onglets *Read Contract* et *Write Contract*). C'est très pratique pour la soutenance.

Sur Etherscan, l'outil s'appelle d'ailleurs *Verify & Publish* : c'est ce que le sujet appelle « publier le token sur un explorateur ».

---

## 6. Les tokens

### Coin ou token ?

**L'image : les euros et les jetons de casino.**

- Le **coin** est la monnaie officielle de la blockchain (ETH), comme l'euro. C'est avec lui qu'on paie le gas.
- Un **token** est une monnaie **créée par un smart contract**, qui vit sur une blockchain existante. Comme les jetons d'un casino : ils ont leurs propres règles, mais l'entrée se paie toujours en euros.

Créer un token ne demande donc pas de créer une blockchain : il suffit d'écrire un contrat. C'est exactement le but du projet.

### Un token, concrètement

Un token n'est qu'un **tableau tenu par un contrat** : « telle adresse possède tant de tokens ».

```
Contrat YC42
┌────────────────────────┬──────────────┐
│ Adresse                │ Solde (YC42) │
├────────────────────────┼──────────────┤
│ 0x71C7…976F (toi)      │    4 199 900 │
│ 0x2B5A…10E4 (un ami)   │          100 │
└────────────────────────┴──────────────┘
```

Envoyer des tokens, c'est demander au contrat de diminuer une ligne et d'augmenter une autre.

### Fongible ou pas ?

- **Fongible** : chaque unité est identique et interchangeable, comme un billet de 10 € en vaut un autre. C'est le cas de YC42.
- **Non fongible** (NFT) : chaque unité est unique, comme un tableau de maître. Ce n'est pas le sujet du projet.

### Le standard ERC-20

**L'image : une prise électrique standard.** N'importe quel appareil se branche sur n'importe quelle prise, parce que tout le monde respecte la même norme.

**ERC-20** est la norme qui fixe les fonctions qu'un token doit avoir sur Ethereum. Si ton token la respecte, **tous les wallets, explorateurs et plateformes savent l'utiliser**, sans rien faire de spécial.

> Le sujet l'exige : quel que soit le langage, ton token doit **respecter le standard de la blockchain choisie**. Pour Ethereum, c'est ERC-20.
> (Tu croiseras aussi **BEP-20** : c'est la même norme, sur BNB Smart Chain.)

Les fonctions de la norme :

| Fonction | En français | Exemple avec YC42 |
|---|---|---|
| `name()` | Nom du token | `"ycandela-42"` |
| `symbol()` | Symbole court, aussi appelé **ticker** | `"YC42"` |
| `decimals()` | Nombre de décimales | `18` |
| `totalSupply()` | Nombre total de tokens existants | `4 200 000` |
| `balanceOf(adresse)` | Solde d'une adresse | `balanceOf(toi)` → `4 199 900` |
| `transfer(destinataire, montant)` | J'envoie mes tokens | `transfer(ami, 100)` |
| `approve(dépenseur, montant)` | J'autorise quelqu'un à dépenser une partie de mes tokens | `approve(boutique, 50)` |
| `allowance(propriétaire, dépenseur)` | Ce qu'il reste à dépenser sur cette autorisation | `allowance(toi, boutique)` → `50` |
| `transferFrom(de, vers, montant)` | Le dépenseur utilise son autorisation | la boutique prend 50 YC42 chez toi |

La norme impose aussi deux **événements**, `Transfer` et `Approval` : des messages enregistrés sur la blockchain à chaque action. Les wallets et Etherscan les lisent pour afficher l'historique.

### Piège n°1 : les décimales

La blockchain **ne connaît pas les nombres à virgule**, seulement les entiers. L'astuce consiste à compter en toutes petites unités, exactement comme l'ETH et ses wei ([section 3](#3-les-transactions-et-les-frais)).

**L'image : les centimes.** Une banque ne stocke pas « 12,50 € », elle stocke « 1250 centimes ». C'est comme si elle avait `decimals = 2`.

Avec `decimals = 18` (la valeur standard, la même que l'ETH), **1 YC42 est stocké comme 1 000 000 000 000 000 000 unités**, soit 10¹⁸ (un 1 suivi de 18 zéros).

| Ce que tu vois | Ce qui est stocké |
|---|---|
| 1 YC42 | `1000000000000000000` |
| 0,5 YC42 | `500000000000000000` |
| 4 200 000 YC42 | `4200000000000000000000000` |

`decimals` ne change rien au fonctionnement du contrat : c'est juste une indication pour que les wallets placent la virgule au bon endroit. C'est pour ça qu'on voit `* 10 ** 18` dans le code.

### Piège n°2 : approve, puis transferFrom

**L'image : un mandat de prélèvement.** Tu autorises ton opérateur téléphonique à prélever jusqu'à X € sur ton compte. Ensuite, c'est lui qui déclenche le prélèvement, sans te redemander.

Pourquoi deux étapes ? Parce qu'un contrat (un site d'échange, une boutique…) **ne peut pas prendre tes tokens tout seul**. Il faut d'abord ton autorisation.

```
    Toi                       Contrat YC42                      Boutique
     │                             │                                │
     │ 1. approve(boutique, 50)    │                                │
     │────────────────────────────►│ note : la boutique peut        │
     │                             │ prendre 50 YC42 chez toi       │
     │                             │                                │
     │                             │ 2. transferFrom(toi, boutique, 50)
     │                             │◄───────────────────────────────│
     │                             │ vérifie l'autorisation,        │
     │                             │ déplace les 50 YC42            │
```

C'est le mécanisme de base de toute la finance décentralisée (DeFi), et il tombe souvent en soutenance.

### Ce que représente ton token

Le sujet demande d'avoir une idée claire de **ce que ton token représente et de la façon dont il sera utilisé**. C'est un choix libre, à expliquer dans la documentation. Par exemple : une monnaie de récompense entre étudiants de 42, des points de fidélité, des droits de vote…

Le document qui présente tout ça s'appelle un **whitepaper** : à quoi sert le token, combien il en existe, qui peut en créer, comment l'utiliser.

---

## 7. Créer et détruire des tokens

**L'image : une banque centrale qui imprime ou détruit des billets.**

| Terme | Signification |
|---|---|
| **Mint** (« frapper ») | Créer de nouveaux tokens et les donner à une adresse. Le total augmente |
| **Burn** (« brûler ») | Détruire des tokens. Le total diminue |
| **Supply initiale** | Ce qui est créé au moment du déploiement, en général donné au créateur |
| **Supply maximale** (*cap*) | Une limite écrite dans le code, qu'on ne pourra jamais dépasser. Elle est optionnelle, mais rassure les utilisateurs : personne ne pourra créer des tokens à l'infini |

> Sur la blockchain, un mint apparaît comme un `Transfer` **depuis** l'adresse `0x000…000` (« depuis nulle part »), et un burn comme un `Transfer` **vers** cette adresse.

Ces chiffres sont des **choix** à justifier dans le README. Par exemple : 4 200 000 tokens au départ et 42 000 000 au maximum, en clin d'œil à 42.

---

## 8. Le propriétaire et les permissions

Certaines fonctions ne doivent pas être accessibles à tout le monde. Si `mint` était ouverte à tous, n'importe qui pourrait se créer des tokens gratuitement.

On donne donc au contrat un **propriétaire** (*owner*), qui est par défaut l'adresse qui l'a déployé.

| Notion | Rôle |
|---|---|
| `owner()` | Renvoie l'adresse du propriétaire |
| `onlyOwner` | Étiquette posée sur une fonction : seul le propriétaire peut l'appeler, sinon la transaction est refusée |
| `transferOwnership(nouvelle_adresse)` | Donne la propriété à quelqu'un d'autre |
| `renounceOwnership()` | Abandonne la propriété **définitivement** : plus personne ne pourra utiliser les fonctions réservées |

Le sujet insiste : il faut penser à **tous les aspects de la sécurité, comme la propriété et les privilèges**. Pour chaque fonction, demande-toi « qui a le droit de l'appeler, et pourquoi ? ».

> **Le problème de confiance** : si l'owner peut créer des tokens quand il veut, les utilisateurs doivent lui faire confiance. Et si sa clé privée est volée, le voleur peut tout faire.
> C'est ce que le bonus multisig cherche à résoudre (voir la [section 13](#13-le-bonus--le-multisig)).

---

## 9. Lire un contrat Solidity

Voici à quoi peut ressembler un token YC42 minimal :

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract YC42 is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 42_000_000 * 10 ** 18;

    error MaxSupplyExceeded();

    constructor() ERC20("ycandela-42", "YC42") Ownable(msg.sender) {
        _mint(msg.sender, 4_200_000 * 10 ** 18);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        if (totalSupply() + amount > MAX_SUPPLY) revert MaxSupplyExceeded();
        _mint(to, amount);
    }
}
```

### Ligne par ligne

| Ligne | Ce qu'elle fait |
|---|---|
| `// SPDX-License-Identifier: MIT` | Indique la licence du code. Le compilateur la réclame |
| `pragma solidity ^0.8.24;` | Version du compilateur à utiliser : 0.8.24 ou plus récente, mais toujours en 0.8.x |
| `import {ERC20} …` | Récupère le token standard d'OpenZeppelin |
| `import {Ownable} …` | Récupère la gestion du propriétaire |
| `contract YC42 is ERC20, Ownable` | Crée le contrat YC42, qui **hérite** de tout ce que font `ERC20` et `Ownable` |
| `uint256 public constant MAX_SUPPLY = …` | Supply maximale de 42 millions, exprimée en petites unités (`* 10 ** 18`). `constant` : ne changera jamais. `public` : lisible par tous |
| `error MaxSupplyExceeded();` | Déclare une erreur avec un nom clair |
| `constructor() …` | Fonction exécutée **une seule fois**, au moment du déploiement |
| `ERC20("ycandela-42", "YC42")` | Donne le nom et le ticker du token |
| `Ownable(msg.sender)` | Désigne comme propriétaire celui qui déploie |
| `_mint(msg.sender, 4_200_000 * 10 ** 18);` | Crée 4,2 millions de tokens pour le déployeur |
| `function mint(address to, uint256 amount)` | Fonction qui crée de nouveaux tokens pour l'adresse `to` |
| `external onlyOwner` | Appelable depuis l'extérieur, mais seulement par le propriétaire |
| `if (… > MAX_SUPPLY) revert …` | Si le maximum est dépassé, toute la transaction est annulée |
| `_mint(to, amount);` | Sinon, les tokens sont créés |

Tout le reste (`transfer`, `balanceOf`, `approve`…) vient de `ERC20` : pas besoin de le réécrire. Pour permettre aux utilisateurs de brûler leurs tokens, il suffit d'hériter en plus de l'extension `ERC20Burnable`.

> ⚠️ Cet exemple est volontairement dépouillé pour rester lisible. Le sujet exige un code **commenté**, avec des **noms de variables et de fonctions lisibles et explicites**, car il y aura une **revue de code** en soutenance. En Solidity, on documente avec des commentaires au format **NatSpec** (`/// @notice …`).

### Le vocabulaire Solidity utile

| Notion | Signification |
|---|---|
| `uint256` | Nombre entier positif, qui peut être gigantesque |
| `address` | Une adresse (`0x…`) |
| `mapping(address => uint256)` | Tableau associatif adresse → nombre. C'est comme ça que les soldes sont stockés |
| `public` / `external` | Fonction appelable depuis l'extérieur du contrat |
| `internal` / `private` | Fonction utilisable seulement à l'intérieur du contrat. Le `_` devant `_mint` est une convention pour ça |
| `view` | Fonction qui lit sans modifier, donc gratuite à appeler depuis l'extérieur |
| `msg.sender` | L'adresse de celui qui appelle la fonction |
| `require` / `revert` | Annule toute la transaction si une condition n'est pas remplie. Le gas déjà consommé reste payé |
| `event` / `emit` | Déclarer et écrire un message dans les logs de la blockchain |
| `modifier` | Code exécuté avant une fonction, comme `onlyOwner` |
| `/// @notice …` | Commentaire NatSpec : le format standard pour documenter un contrat et ses fonctions |

> Depuis Solidity 0.8, un calcul qui dépasse la capacité d'un nombre (*overflow*) annule automatiquement la transaction. Avant, c'était une source de failles célèbres.

---

## 10. OpenZeppelin

**L'image : utiliser une serrure certifiée plutôt que d'en fabriquer une soi-même.**

OpenZeppelin est une bibliothèque de contrats **gratuite, open source et auditée** (relue par des experts en sécurité), utilisée par la plupart des projets Ethereum. Plutôt que de recoder un ERC-20 à la main au risque d'y laisser une faille, on **hérite** de leur version : `contract YC42 is ERC20, Ownable` récupère d'un coup toutes les fonctions du standard et la gestion du propriétaire.

C'est un choix tout à fait légitime à expliquer dans le README, à condition de **savoir ce que fait chaque fonction héritée**, car on te le demandera.

---

## 11. Les outils

| Outil | À quoi il sert | Quand l'utiliser |
|---|---|---|
| **Remix** (remix.ethereum.org) | Éditeur en ligne : écrire, compiler et déployer un contrat sans rien installer | Idéal pour débuter |
| **MetaMask** | Wallet dans le navigateur, qui signe les transactions | Indispensable |
| **Etherscan** (sepolia.etherscan.io) | Explorer la blockchain, vérifier et publier le contrat, l'utiliser | Indispensable |
| **Hardhat** / **Foundry** | Outils professionnels : tests automatiques, scripts de déploiement | Pour aller plus loin |

> Le sujet cite aussi **Truffle** : son éditeur (Consensys) a arrêté ce projet en 2023. Mieux vaut utiliser Remix ou Hardhat.

### Le parcours type

1. Installer MetaMask et créer un wallet de test.
2. Dans MetaMask, activer l'affichage des réseaux de test et choisir **Sepolia**.
3. Récupérer des SepoliaETH sur un faucet.
4. Écrire et compiler le contrat (avec Remix ou Hardhat).
5. Le tester.
6. Le déployer sur Sepolia : MetaMask demande de signer et paie le gas.
7. Le vérifier et le publier sur Etherscan.
8. Importer le token dans MetaMask (avec l'adresse du contrat) pour voir son solde.
9. Noter l'adresse du contrat et le réseau dans le dépôt.

---

## 12. Sécurité

| ❌ À ne pas faire | ✅ À faire |
|---|---|
| Mettre sa clé privée ou sa seed phrase dans le code ou sur GitHub. Des robots scannent GitHub en permanence et vident les wallets en quelques minutes | La mettre dans un fichier `.env`, listé dans le `.gitignore` |
| Utiliser son wallet personnel | Utiliser un wallet dédié au projet |
| Déployer sans tester | Tester chaque fonction avant, puisque le code ne se modifie plus ensuite |
| Laisser `mint` accessible à tout le monde | La protéger avec `onlyOwner` |

---

## 13. Le bonus : le multisig

**L'image : un coffre-fort à plusieurs clés**, ou le compte d'une association qui exige deux signatures pour chaque chèque.

Un **multisig** (multi-signature) est un contrat qui n'agit que si **M personnes sur N** sont d'accord, par exemple 2 sur 3.

Appliqué au projet : on transfère la propriété du token au contrat multisig. À partir de là, pour créer des tokens :

1. Un des propriétaires **propose** l'action : « mint 1 000 YC42 pour Alice ».
2. Les autres propriétaires **confirment**.
3. Quand le seuil est atteint (2 confirmations sur 3), l'action est **exécutée**.

Résultat : une seule clé volée ne suffit plus pour faire n'importe quoi.

Ce que précise le sujet :

- il faut **créer un smart contract** qui exige plusieurs signatures, et l'**adapter au token** : ce n'est pas un contrat isolé, il doit contrôler YC42 ;
- c'est à toi de **décider combien de signatures** sont nécessaires et **qui a le droit de signer**, et de le justifier ;
- ⚠️ le bonus n'est évalué **que si la partie obligatoire est parfaite**, c'est-à-dire entièrement faite et sans aucun dysfonctionnement. Commence donc par la partie obligatoire.

---

## 14. Ce que demande le projet

Résumé du sujet (version 1.1).

### Partie obligatoire

- [ ] Le nom du token contient **42** et n'est pas insultant (✅ `ycandela-42`)
- [ ] Le token **respecte le standard** de la blockchain choisie : ERC-20 pour Ethereum
- [ ] Un `README.md` à la racine, qui explique **les choix faits et pourquoi** : blockchain, langage, outils, supply, permissions…
- [ ] Un dossier `code/` à la racine, avec un code **commenté** et des noms de variables et de fonctions **lisibles et explicites**
- [ ] Un second dossier avec tout ce qu'il faut pour **déployer** le token. Son nom est libre ; l'exemple du sujet l'appelle `deployment`
- [ ] Le token est **déployé sur une blockchain publique** (Sepolia : jamais d'argent réel)
- [ ] Le **ticker** est défini (`YC42`) et le contrat est **publié sur un explorateur** (Etherscan)
- [ ] L'**adresse du contrat** et le **réseau** utilisé sont indiqués dans le dépôt
- [ ] Un dossier `documentation/` à la racine, **clair et explicite**, qui explique comment le token fonctionne, ce qu'il faut pour l'utiliser et ce qu'il représente (par exemple sous forme de whitepaper)
- [ ] La **sécurité** est pensée : qui est propriétaire, qui a quels privilèges

Structure attendue (exemple du sujet) :

```
.
├── README.md
├── code/
├── deployment/
└── documentation/
```

### Optionnel

- Une **vidéo de démo** : un simple lien dans le dépôt suffit. Elle ne rapporte **aucun point**.

### Bonus

- Un **multisig** adapté au token (voir la [section 13](#13-le-bonus--le-multisig)), évalué **uniquement si la partie obligatoire est parfaite**.

### Ce qui t'attend en soutenance

Le sujet annonce trois choses :

1. **Une revue de code** : il faut pouvoir expliquer chaque ligne.
2. **Une démonstration** : quelques actions simples qui prouvent que le token fonctionne.
3. **Une relecture de la documentation**.

Concrètement, prépare-toi à :

- montrer le contrat et ses transactions sur Etherscan ;
- faire un `transfer` en direct ;
- montrer qu'une adresse qui n'est pas owner ne peut pas `mint` ;
- expliquer `decimals`, `approve` / `transferFrom` et la différence entre coin et token ;
- justifier chaque choix du README.

> En plus du sujet, une règle de bon sens : **aucune clé privée dans le dépôt**. Le sujet recommande même de partager le projet sur ton GitHub personnel une fois validé : tout ce qui est dans le dépôt deviendra public.

---

## 15. Glossaire

| Terme | Définition courte |
|---|---|
| **ABI** | Le « mode d'emploi » JSON d'un contrat : la liste de ses fonctions et paramètres |
| **Adresse** | Identifiant public d'un compte (`0x…`), qu'on peut partager pour recevoir |
| **BEP-20** | L'équivalent d'ERC-20 sur BNB Smart Chain |
| **Bloc** | Paquet de transactions ajouté à la blockchain |
| **Blockchain** | Registre partagé entre des milliers d'ordinateurs, où l'on ne peut qu'ajouter |
| **Burn** | Détruire des tokens |
| **chainId** | Numéro qui identifie un réseau (`1` = Ethereum mainnet, `11155111` = Sepolia) |
| **Clé privée** | Secret qui permet de signer les transactions d'un compte |
| **Coin** | Monnaie native d'une blockchain (ETH pour Ethereum) |
| **Consensus** | Méthode par laquelle le réseau se met d'accord sur le bloc suivant |
| **Decimals** | Nombre de décimales d'affichage d'un token (18 en général) |
| **DeFi** | Finance décentralisée : services financiers gérés par des smart contracts |
| **Déploiement** | Mise en ligne d'un contrat sur la blockchain |
| **EOA** | Compte contrôlé par une clé privée (un humain) |
| **ERC-20** | Norme des tokens fongibles sur Ethereum |
| **Etherscan** | Explorateur de blocs d'Ethereum |
| **EVM** | Machine virtuelle qui exécute les smart contracts |
| **Explorateur** | Site qui affiche le contenu de la blockchain |
| **Faucet** | Site qui distribue de la monnaie de test |
| **Fongible** | Dont les unités sont identiques et interchangeables |
| **Gas** | Unité de coût d'une transaction, payée en ETH |
| **Gwei** | 10⁹ wei, l'unité utilisée pour le prix du gas |
| **Hash** | Empreinte unique d'une donnée ; sert aussi d'identifiant de transaction |
| **Mainnet** | La vraie blockchain, avec de l'argent réel |
| **MetaMask** | Wallet sous forme d'extension de navigateur |
| **Mint** | Créer des tokens |
| **Multisig** | Contrat qui exige plusieurs signatures pour agir |
| **NatSpec** | Format standard des commentaires en Solidity (`/// @notice`) |
| **NFT** | Token non fongible : chaque unité est unique |
| **Nœud** | Ordinateur qui garde une copie de la blockchain |
| **Owner** | Propriétaire d'un contrat, qui a des droits spéciaux |
| **Seed phrase** | 12 ou 24 mots qui permettent de recréer toutes ses clés |
| **Sepolia** | Le testnet de référence d'Ethereum |
| **Smart contract** | Programme installé sur la blockchain |
| **Solidity** | Langage de programmation des smart contracts |
| **Supply** | Quantité de tokens en circulation |
| **Testnet** | Copie de la blockchain avec une monnaie sans valeur, pour tester |
| **Ticker** | Symbole court d'un token (`YC42`) |
| **Token** | Monnaie créée par un smart contract |
| **Transaction** | Opération signée qui modifie la blockchain |
| **Wallet** | Logiciel qui garde les clés et signe les transactions |
| **Wei** | Plus petite unité de l'ETH : 1 ETH = 10¹⁸ wei |
| **Whitepaper** | Document qui présente un token : ce qu'il représente, à quoi il sert, comment il fonctionne |

---

## 16. Pour aller plus loin

- [ethereum.org, documentation développeurs (en français)](https://ethereum.org/fr/developers/docs/) : les bases, très bien expliquées
- [ethereum.org, les réseaux de test](https://ethereum.org/fr/developers/docs/networks/) : Sepolia et une liste de faucets
- [Faucet Google Cloud Web3 (Sepolia)](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
- [PoW faucet Sepolia (pk910)](https://sepolia-faucet.pk910.de)
- [Etherscan Sepolia](https://sepolia.etherscan.io) : l'explorateur du testnet
- [La norme ERC-20 (EIP-20)](https://eips.ethereum.org/EIPS/eip-20) : le texte officiel
- [OpenZeppelin, documentation ERC-20](https://docs.openzeppelin.com/contracts/5.x/erc20)
- [Documentation Solidity](https://docs.soliditylang.org)
- [Solidity by Example](https://solidity-by-example.org) : des petits exemples commentés
- [CryptoZombies](https://cryptozombies.io/fr) : un cours interactif de Solidity, en français
- [Remix](https://remix.ethereum.org) : l'éditeur en ligne
