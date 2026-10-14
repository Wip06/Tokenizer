# ycandela-42 (YC42)

> ⚽ *« Une correction, une partie. »*

**YC42** est le jeton de babyfoot de 42 : un token **ERC-20** déployé sur **Ethereum Sepolia**. Chaque correction de projet rapporte **1 YC42**, et chaque partie de babyfoot en consomme un.

Projet **Tokenizer** de l'école 42. Projet pédagogique sur un réseau de test : le token n'a **aucune valeur réelle**.

---

## Le contrat déployé

| | |
|---|---|
| **Réseau** | Ethereum **Sepolia** (testnet, chainId `11155111`) |
| **Adresse du contrat** | [`0xee8224DC19837cf266684b2fd4cfdEa4835b2323`](https://sepolia.etherscan.io/address/0xee8224DC19837cf266684b2fd4cfdEa4835b2323#code) |
| **Nom** | `ycandela-42` |
| **Ticker** | `YC42` |
| **Décimales** | `18` |
| **Supply initiale** | 4 200 000 YC42 |
| **Supply maximale** | 42 000 000 YC42 |
| **Propriétaire** | `0x29e55047e0f421a99F5fD76a465F28F767DE5007` |
| **Transaction de déploiement** | [`0x4dd67282…1eaa6`](https://sepolia.etherscan.io/tx/0x4dd672829433c8fda2874b6b0df9df9f9333c9f5aa7ced0be9fd3ed45261eaa6) (bloc 11 916 251) |

Le code source est **vérifié et publié** sur trois explorateurs :
[Etherscan](https://sepolia.etherscan.io/address/0xee8224DC19837cf266684b2fd4cfdEa4835b2323#code) ·
[Blockscout](https://eth-sepolia.blockscout.com/address/0xee8224DC19837cf266684b2fd4cfdEa4835b2323#code) ·
[Sourcify](https://sourcify.dev/server/repo-ui/11155111/0xee8224DC19837cf266684b2fd4cfdEa4835b2323)

---

## Structure du dépôt

```
.
├── README.md                     ← ce fichier : les choix et leurs raisons
├── code/
│   ├── contracts/YC42.sol        ← le smart contract du token
│   └── test/YC42.ts              ← les tests automatisés (13 tests)
├── deployment/
│   ├── README.md                 ← la procédure de déploiement, étape par étape
│   ├── check.ts                  ← vérifie la configuration sans rien envoyer
│   └── deploy.ts                 ← déploie le token
├── documentation/
│   ├── whitepaper.md             ← ce que représente YC42 et ses règles
│   ├── guide-utilisation.md      ← comment utiliser le token
│   └── notions.md                ← les notions de blockchain, expliquées depuis zéro
├── hardhat.config.ts             ← configuration de Hardhat (compilation, réseau, vérification)
├── .env.example                  ← modèle du fichier de secrets (le vrai .env n'est jamais commit)
└── package.json                  ← dépendances et commandes du projet
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

- **Hardhat** compile, teste, déploie et vérifie le contrat avec un seul outil.
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
| `mint` | **Le propriétaire uniquement**, dans la limite du plafond |
| `transferOwnership`, `renounceOwnership` | **Le propriétaire uniquement** |

Le propriétaire **ne peut pas** prendre les jetons de quelqu'un, bloquer les transferts, ni brûler les jetons d'un autre sans son autorisation. Le risque qui reste est le vol de sa clé privée. C'est l'objet du bonus multisig : confier la propriété au « Conseil du Babyfoot », où 2 signatures sur 3 sont nécessaires.

### La sécurité

- **Les secrets sont hors du dépôt** : la clé privée et la clé API sont dans `.env`, ignoré par Git. Seul le modèle vide [`.env.example`](.env.example) est commit.
- **Un wallet dédié aux tests** sert au déploiement, jamais un wallet personnel.
- **13 tests automatisés** vérifient chaque règle avant le déploiement (le code d'un contrat ne se modifie plus une fois en ligne) : le refus du `mint` à un non-propriétaire, le plafond, la propriété…
- **Deux garde-fous dans les scripts** : `npm run check` contrôle la configuration sans rien envoyer, et le script de déploiement s'arrête si le wallet est vide.
- **Le code source est publié** sur trois explorateurs : chacun peut vérifier que le contrat déployé est bien celui de ce dépôt.

---

## Démarrage rapide

Il faut **Node.js 24** (fichier [`.nvmrc`](.nvmrc)).

```bash
nvm use          # passe sur Node 24
npm install      # installe les dépendances
npm run build    # compile le contrat
npm test         # lance les 13 tests
```

Pour déployer votre propre exemplaire du token, suivez [`deployment/README.md`](deployment/README.md).

---

## Documentation

| Document | Contenu |
|---|---|
| [Whitepaper](documentation/whitepaper.md) | Ce que représente YC42, ses règles et sa gouvernance |
| [Guide d'utilisation](documentation/guide-utilisation.md) | Ajouter le token à MetaMask, envoyer, brûler, minter, les erreurs possibles |
| [Notions de base](documentation/notions.md) | La blockchain, les wallets, le gas, les smart contracts et l'ERC-20, expliqués depuis zéro |
| [Déploiement](deployment/README.md) | Configurer, vérifier, déployer et publier le contrat |
