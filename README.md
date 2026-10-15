# ycandela-42 (YC42)

> ⚽ *« Une correction, une partie. »*

**YC42** est le jeton de babyfoot de 42 : un token **ERC-20** déployé sur **Ethereum Sepolia**. Chaque correction de projet rapporte **1 YC42**, et chaque partie de babyfoot en consomme un. Les jetons ne peuvent être créés que par le **Conseil du Babyfoot**, un multisig où 2 membres sur 3 doivent voter.

Projet **Tokenizer** de l'école 42. Projet pédagogique sur un réseau de test : le token n'a **aucune valeur réelle**.

---

## Les contrats déployés

Réseau : Ethereum **Sepolia** (testnet, chainId `11155111`).

### Le token YC42

| | |
|---|---|
| **Adresse** | [`0xee8224DC19837cf266684b2fd4cfdEa4835b2323`](https://sepolia.etherscan.io/address/0xee8224DC19837cf266684b2fd4cfdEa4835b2323#code) |
| **Nom** | `ycandela-42` |
| **Ticker** | `YC42` |
| **Décimales** | `18` |
| **Supply initiale** | 4 200 000 YC42 |
| **Supply maximale** | 42 000 000 YC42 |
| **Propriétaire** | Le Conseil du Babyfoot (voir ci-dessous) |
| **Transaction de déploiement** | [`0x4dd67282…1eaa6`](https://sepolia.etherscan.io/tx/0x4dd672829433c8fda2874b6b0df9df9f9333c9f5aa7ced0be9fd3ed45261eaa6) (bloc 11 916 251) |

Code source vérifié et publié :
[Etherscan](https://sepolia.etherscan.io/address/0xee8224DC19837cf266684b2fd4cfdEa4835b2323#code) ·
[Blockscout](https://eth-sepolia.blockscout.com/address/0xee8224DC19837cf266684b2fd4cfdEa4835b2323#code) ·
[Sourcify](https://sourcify.dev/server/repo-ui/11155111/0xee8224DC19837cf266684b2fd4cfdEa4835b2323)

### Le Conseil du Babyfoot (bonus multisig)

| | |
|---|---|
| **Adresse** | [`0x425a39BCC9e7436A5aC1ad2a9B65B1C3f207F36B`](https://sepolia.etherscan.io/address/0x425a39BCC9e7436A5aC1ad2a9B65B1C3f207F36B#code) |
| **Rôle** | Propriétaire de YC42 depuis la [passation](https://sepolia.etherscan.io/tx/0xc709ca95b30e3f31a5968bd3a98044d0a7131d52a584b76828d961fd7fbf4c76) (bloc 11 918 869) |
| **Membres** | `0x29e55047e0f421a99F5fD76a465F28F767DE5007`<br>`0x3dBA7D94089Ccc464e9d8E403bC6B468d4353460`<br>`0xe9d9812535f6a93C44281A24251c74E5f686738a` |
| **Confirmations requises** | 2 sur 3 |
| **Transaction de déploiement** | [`0x65ab6fa4…7b622`](https://sepolia.etherscan.io/tx/0x65ab6fa48c7217a24c3fe102d8a4d648f5f1f06cc9267152939e08ed13e7b622) (bloc 11 918 777) |
| **Premier mint voté** | [`0xfe35df99…50537`](https://sepolia.etherscan.io/tx/0xfe35df99d2a28eead1fb951b64f4da236a58ee988028503eb12751b504950537) : 1 YC42 pour le 3e membre (bloc 11 918 885) |

Code source vérifié et publié :
[Etherscan](https://sepolia.etherscan.io/address/0x425a39BCC9e7436A5aC1ad2a9B65B1C3f207F36B#code) ·
[Blockscout](https://eth-sepolia.blockscout.com/address/0x425a39BCC9e7436A5aC1ad2a9B65B1C3f207F36B#code) ·
[Sourcify](https://sourcify.dev/server/repo-ui/11155111/0x425a39BCC9e7436A5aC1ad2a9B65B1C3f207F36B)

---

## Structure du dépôt

```
.
├── README.md                       ← ce fichier : les choix et leurs raisons
├── code/
│   ├── contracts/
│   │   ├── YC42.sol                ← le smart contract du token
│   │   └── BabyfootCouncil.sol     ← le Conseil du Babyfoot (multisig, bonus)
│   └── test/
│       ├── YC42.ts                 ← 13 tests du token
│       └── BabyfootCouncil.ts      ← 6 tests du Conseil
├── deployment/
│   ├── README.md                   ← la procédure de déploiement, étape par étape
│   ├── deploy.ts                   ← déploie le token
│   ├── council_args.ts             ← les paramètres du Conseil (token et membres)
│   └── deploy_council.ts           ← déploie le Conseil
├── documentation/
│   ├── whitepaper.md               ← ce que représente YC42 et ses règles
│   ├── guide_utilisation.md        ← comment utiliser le token et voter au Conseil
│   └── notions.md                  ← les notions de blockchain, expliquées depuis zéro
├── hardhat.config.ts               ← configuration de Hardhat (compilation, réseau, vérification)
├── .env.example                    ← modèle du fichier de secrets (le vrai .env n'est jamais commit)
└── package.json                    ← dépendances et commandes du projet
```

---

## Les choix et leurs raisons

### Le nom : `ycandela-42`, ticker `YC42`

Le sujet impose seulement que le nom contienne **42**. **YC** sont les initiales du créateur, et le ticker reprend les deux.

### La blockchain : Ethereum

Le sujet laisse le choix de la blockchain, à condition d'en respecter le standard.

- **C'est la référence** : Ethereum a inventé les smart contracts et la norme ERC-20. Les autres chaînes compatibles, comme BNB Chain, l'ont reprise.
- **C'est l'écosystème le mieux documenté** : outils, bibliothèques auditées, explorateurs.
- **Le code est portable** : le contrat fonctionnerait tel quel sur toute blockchain compatible avec l'EVM.
- **L'inconvénient** : les frais sont élevés sur le vrai réseau. Ça ne compte pas ici, puisque le projet reste sur un réseau de test.

### Le réseau : Sepolia

Le sujet interdit d'utiliser de l'argent réel. **Sepolia** est le réseau de test officiel d'Ethereum pour les applications :
- il fonctionne exactement comme le vrai réseau, mais sa monnaie est gratuite et sans valeur ;
- il est intégré à MetaMask ;
- il est pris en charge par Etherscan.

### Le standard : ERC-20

Le sujet demande de respecter le standard de la blockchain choisie. Sur Ethereum, c'est **ERC-20**, la norme des tokens **fongibles** : chaque jeton vaut exactement un autre jeton, comme deux jetons de babyfoot. Grâce à elle, YC42 est reconnu sans configuration par tous les wallets et explorateurs.

### Le langage : Solidity 0.8.34

**Solidity** est le langage principal des smart contracts sur Ethereum. Depuis la version 0.8, il annule automatiquement toute opération qui dépasse la capacité d'un nombre (*overflow*), ce qui supprime une source classique de failles.

### La bibliothèque : OpenZeppelin 5.6.1

Plutôt que de réécrire le standard à la main, avec le risque d'y laisser une faille, le contrat **hérite** des briques **auditées** d'OpenZeppelin, la référence du domaine :

| Brique | Ce qu'elle apporte |
|---|---|
| `ERC20` | Le standard : soldes, `transfer`, `approve`, `transferFrom` |
| `ERC20Burnable` | `burn` et `burnFrom` : détruire des jetons |
| `Ownable` | Un propriétaire, la protection `onlyOwner`, `transferOwnership`, `renounceOwnership` |

Le fichier [`YC42.sol`](code/contracts/YC42.sol) n'ajoute que les règles propres au projet : la supply initiale, le plafond et le `mint` réservé au propriétaire.

### Les outils : Hardhat 3, TypeScript, ethers.js

- **Hardhat** compile, teste, déploie et vérifie les contrats avec un seul outil.
- **Les scripts de [`deployment/`](deployment/)** rendent le déploiement **reproductible** : la même commande donne le même résultat, contrairement à une suite de clics dans une interface.
- **TypeScript** détecte les erreurs de type avant l'exécution.
- **Remix** est très pratique pour découvrir, mais un projet versionné y est moins facile à rejouer. **Truffle**, cité par le sujet, a été abandonné par son éditeur en 2023.

### Les règles du token (tokenomics)

| Règle | Valeur | Pourquoi |
|---|---|---|
| Supply initiale | 4 200 000 YC42, donnés au déployeur | 10 % du plafond, pour lancer les premières parties et faire les démonstrations tout de suite |
| Supply maximale | 42 000 000 YC42 | Personne, même le propriétaire, ne peut créer des jetons à l'infini. Et 42 est la réponse à la grande question sur la vie, l'univers et le reste |
| Décimales | 18 | La valeur standard, la même que l'ETH. 0,5 YC42 = une mi-temps |
| Plafond sur la circulation | Les jetons brûlés libèrent de la place | Comme au vrai babyfoot : le gérant vide la machine et remet en circulation les jetons joués |

### Les permissions : qui peut faire quoi ?

| Action | Qui peut la faire |
|---|---|
| `transfer`, `approve` | Tout détenteur, avec **ses propres** jetons |
| `transferFrom`, `burnFrom` | Une adresse **autorisée au préalable** par le détenteur, avec `approve` |
| `burn` | Tout détenteur, avec **ses propres** jetons |
| `mint` | **Le Conseil uniquement**, après un vote de 2 membres sur 3, dans la limite du plafond |
| `transferOwnership` | **Le Conseil uniquement**, après un vote de 2 membres sur 3 |
| `renounceOwnership` | **Personne** : le Conseil n'a pas de fonction pour renoncer à la propriété |

Le propriétaire **ne peut pas** prendre les jetons de quelqu'un, bloquer les transferts, ni brûler les jetons d'un autre sans son autorisation.

### Le bonus : le Conseil du Babyfoot (multisig)

**Le problème** : avec un propriétaire unique, tout repose sur une seule clé privée. Si elle est volée, le voleur peut créer des jetons. Et comme la blockchain ne voit pas les corrections, un gérant malhonnête pourrait se récompenser sans rien avoir corrigé.

**La solution** : la propriété de YC42 a été confiée à [`BabyfootCouncil.sol`](code/contracts/BabyfootCouncil.sol). Un membre propose, un autre confirme, et l'action ne s'exécute qu'à la deuxième confirmation.

| Choix | Pourquoi |
|---|---|
| **Un Conseil spécialisé**, et non un multisig générique comme Safe | Le sujet demande d'adapter le multisig au token. Les fonctions sont lisibles (`proposeMint(to, amount)`) au lieu de données d'appel encodées, et moins de code veut dire moins de risques |
| **2 membres sur 3** | Un seul membre ne peut rien faire seul, et une clé perdue ne bloque pas le Conseil : les deux autres peuvent encore voter |
| **Proposer compte comme une confirmation**, et l'action s'exécute à la 2e | Le moins d'étapes possible : une proposition, puis une confirmation |
| **La propriété peut être transmise** (`proposeOwnershipTransfer`) | Le choix reste réversible : à 2 sur 3, le Conseil peut rendre YC42 ou le confier à un nouveau Conseil |
| **YC42 n'a pas été modifié** | Grâce à `Ownable`, la propriété d'un contrat peut être donnée à un autre contrat : aucun redéploiement du token |

**Les limites** : les membres sont fixés au déploiement. Pour en changer, il faut déployer un nouveau Conseil, puis lui transmettre la propriété par un vote. Pour le projet, les trois membres sont trois comptes de la même personne ; dans la réalité, ce seraient trois personnes différentes.

### La sécurité

- **Les secrets sont hors du dépôt** : la clé privée et la clé API sont dans `.env`, ignoré par Git. Seul le modèle vide [`.env.example`](.env.example) est commit.
- **Un wallet dédié aux tests** sert au déploiement, jamais un wallet personnel.
- **19 tests automatisés** (13 pour YC42, 6 pour le Conseil) vérifient chaque règle avant le déploiement, puisque le code d'un contrat ne se modifie plus une fois en ligne : le plafond, la propriété, les votes…
- **Aucun compte seul ne peut créer de jetons** : il faut un vote de 2 membres sur 3 du Conseil.
- **Un garde-fou dans le script de déploiement** : il affiche l'adresse et le solde du déployeur avant d'agir, et s'arrête si le wallet est vide.
- **Le code source est publié** sur trois explorateurs : chacun peut vérifier que les contrats déployés sont bien ceux de ce dépôt.

---

## Démarrage rapide

Il faut **Node.js 24** (fichier [`.nvmrc`](.nvmrc)).

```bash
nvm use          # passe sur Node 24
npm install      # installe les dépendances
npm run build    # compile les contrats
npm test         # lance les 19 tests
```

Pour déployer votre propre exemplaire du token et du Conseil, suivez [`deployment/README.md`](deployment/README.md).

---

## Documentation

| Document | Contenu |
|---|---|
| [Whitepaper](documentation/whitepaper.md) | Ce que représente YC42, ses règles et sa gouvernance |
| [Guide d'utilisation](documentation/guide_utilisation.md) | Ajouter le token à MetaMask, envoyer, brûler, **voter un mint au Conseil**, les erreurs possibles |
| [Notions de base](documentation/notions.md) | La blockchain, les wallets, le gas, les smart contracts et l'ERC-20, expliqués depuis zéro |
| [Déploiement](deployment/README.md) | Configurer, déployer et publier le token et le Conseil |
