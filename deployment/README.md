# Déploiement de YC42

Ce dossier contient tout ce qu'il faut pour déployer le token sur Sepolia, le réseau de test d'Ethereum, puis publier son code source sur Etherscan.

| Fichier | Rôle |
|---|---|
| [`check.ts`](check.ts) | Vérifie la configuration (connexion, clé privée, solde) **sans rien envoyer** |
| [`deploy.ts`](deploy.ts) | Déploie le contrat YC42 et affiche son adresse |

Ces scripts s'appuient sur [`hardhat.config.ts`](../hardhat.config.ts), à la racine, qui déclare le réseau Sepolia et la vérification Etherscan.

---

## Prérequis

- **Node.js 24** : lance `nvm use` à la racine du projet, qui lit le fichier `.nvmrc`.
- **Les dépendances** : `npm install`.
- **Un wallet MetaMask dédié aux tests**, avec quelques SepoliaETH venant d'un faucet. Compte environ 0,01 SepoliaETH pour le déploiement.
- **Une clé API Etherscan**, gratuite : sur etherscan.io, menu du compte → *API Keys*.

---

## 1. Configurer les secrets

```bash
cp .env.example .env
```

Puis remplis le fichier `.env`. **Il ne doit jamais être commit** : il est déjà dans le `.gitignore`.

| Variable | Valeur |
|---|---|
| `SEPOLIA_RPC_URL` | L'adresse d'un nœud Sepolia. Celle du modèle est publique et gratuite |
| `SEPOLIA_PRIVATE_KEY` | La clé privée du wallet de test. Dans MetaMask : détails du compte → *Afficher la clé privée* |
| `ETHERSCAN_API_KEY` | La clé API Etherscan |

## 2. Vérifier la configuration

```bash
npm run check
```

Résultat attendu :

```
Réseau  : sepolia (chainId 11155111)
Adresse : 0x…              ← la même adresse que dans MetaMask
Solde   : 0.05 ETH          ← doit être supérieur à 0
```

## 3. Faire une répétition à blanc (facultatif)

```bash
npm run deploy:local
```

Cette commande déploie le contrat sur une blockchain simulée en local : c'est gratuit, et rien n'est envoyé sur Sepolia.

## 4. Déployer

```bash
npm run deploy
```

Le script affiche le réseau, le déployeur et son solde, puis l'adresse du contrat une fois la transaction incluse dans un bloc. Il s'arrête si le solde est à zéro.

Le déployeur devient le **propriétaire** du token et reçoit la supply initiale de 4 200 000 YC42.

## 5. Publier le code source

```bash
npm run verify -- <adresse du contrat>
```

Hardhat envoie le code source à Etherscan, Blockscout et Sourcify. Chacun vérifie qu'il correspond bien au bytecode déployé, puis le publie.

⚠️ Ne modifie pas `code/contracts/YC42.sol` entre le déploiement et la vérification, même pas un commentaire. Le compilateur ajoute au bytecode une empreinte du fichier source : si le fichier change, la vérification échoue.

---

## Le déploiement réalisé

| | |
|---|---|
| Date | 15 octobre 2026 |
| Réseau | Ethereum Sepolia (chainId `11155111`) |
| Adresse du contrat | [`0xee8224DC19837cf266684b2fd4cfdEa4835b2323`](https://sepolia.etherscan.io/address/0xee8224DC19837cf266684b2fd4cfdEa4835b2323#code) |
| Déployeur / propriétaire | `0x29e55047e0f421a99F5fD76a465F28F767DE5007` |
| Transaction | [`0x4dd672829433c8fda2874b6b0df9df9f9333c9f5aa7ced0be9fd3ed45261eaa6`](https://sepolia.etherscan.io/tx/0x4dd672829433c8fda2874b6b0df9df9f9333c9f5aa7ced0be9fd3ed45261eaa6) |
| Bloc | 11 916 251 |
| Gas consommé | 8 529 897, soit environ 0,0085 SepoliaETH |
| Vérification | ✅ Etherscan, Blockscout, Sourcify |

**Pourquoi autant de gas ?** Le même déploiement ne coûte que 1 280 265 gas sur la blockchain simulée de Hardhat. Sepolia applique des règles de prix plus récentes : stocker un octet de code y coûte environ **1 542 gas**, au lieu des 200 de la règle historique. Le contrat faisant 5 003 octets, l'écart vient de là, et non du contrat.
