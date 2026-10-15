# Déploiement de YC42 et du Conseil

Ce dossier contient tout ce qu'il faut pour déployer le token et le Conseil du Babyfoot sur Sepolia, le réseau de test d'Ethereum, puis publier leur code source sur Etherscan.

| Fichier | Rôle |
|---|---|
| [`deploy.ts`](deploy.ts) | Déploie le token YC42 et affiche son adresse |
| [`council_args.ts`](council_args.ts) | Les paramètres du Conseil : l'adresse du token et les 3 membres |
| [`deploy_council.ts`](deploy_council.ts) | Déploie le Conseil du Babyfoot et affiche son adresse |

Ces scripts s'appuient sur [`hardhat.config.ts`](../hardhat.config.ts), à la racine, qui déclare le réseau Sepolia et la vérification Etherscan.

---

## Prérequis

- **Node.js 24** : lance `nvm use` à la racine du projet, qui lit le fichier `.nvmrc`.
- **Les dépendances** : `npm install`.
- **Un wallet MetaMask dédié aux tests**, avec quelques SepoliaETH venant d'un faucet. Compte environ 0,01 SepoliaETH pour chaque déploiement.
- **Une clé API Etherscan**, gratuite : sur etherscan.io, menu du compte → *API Keys*.
- **Pour le Conseil** : 3 comptes membres, dont au moins 2 avec un peu de SepoliaETH pour voter.

---

## Partie 1 : le token

### 1. Configurer les secrets

```bash
cp .env.example .env
```

Puis remplis le fichier `.env`. **Il ne doit jamais être commit** : il est déjà dans le `.gitignore`.

| Variable | Valeur |
|---|---|
| `SEPOLIA_RPC_URL` | L'adresse d'un nœud Sepolia. Celle du modèle est publique et gratuite |
| `SEPOLIA_PRIVATE_KEY` | La clé privée du wallet de test. Dans MetaMask : détails du compte → *Afficher la clé privée* |
| `ETHERSCAN_API_KEY` | La clé API Etherscan |

### 2. Déployer le token

```bash
npm run deploy
```

Le script affiche le réseau, l'adresse du déployeur et son solde, puis l'adresse du contrat une fois la transaction incluse dans un bloc. Il s'arrête si le solde est à zéro. L'adresse du déployeur doit être celle du wallet de test dans MetaMask : sinon, la clé privée du `.env` n'est pas la bonne.

Le déployeur devient le **propriétaire** du token et reçoit la supply initiale de 4 200 000 YC42.

### 3. Publier le code du token

```bash
npm run verify -- <adresse du token>
```

Hardhat envoie le code source à Etherscan, Blockscout et Sourcify. Chacun vérifie qu'il correspond bien au bytecode déployé, puis le publie.

⚠️ Ne modifie pas un contrat entre son déploiement et sa vérification, même pas un commentaire. Le compilateur ajoute au bytecode une empreinte du fichier source : si le fichier change, la vérification échoue.

---

## Partie 2 : le Conseil du Babyfoot (bonus)

### 4. Choisir les membres

Dans [`council_args.ts`](council_args.ts), indique l'adresse du token déployé à l'étape 2 et les **3 adresses des membres**. Elles doivent être toutes différentes et non nulles.

### 5. Déployer le Conseil

```bash
npm run deploy:council
```

Le script vérifie que les 3 adresses sont bien formées, puis déploie le Conseil et affiche son adresse. Le Conseil ne possède encore rien : la passation se fait à l'étape 7.

### 6. Publier le code du Conseil

```bash
npm run verify:council -- <adresse du Conseil>
```

Les paramètres du constructeur sont relus dans `council_args.ts`, le même fichier que pour le déploiement : la vérification utilise exactement les mêmes valeurs.

### 7. La passation : confier YC42 au Conseil

Sur Etherscan, avec le compte **propriétaire actuel** du token :

1. Ouvre le *Write Contract* du token et clique sur **Connect to Web3**.
2. Appelle `transferOwnership(newOwner)` avec l'**adresse du Conseil**.

À partir de là, seul le Conseil peut créer des jetons, après un vote de 2 membres sur 3. L'ancien propriétaire n'a plus aucun droit. Pour voter un mint, voir le [guide d'utilisation](../documentation/guide_utilisation.md#8-créer-des-jetons--le-vote-du-conseil).

---

## Les déploiements réalisés

Le 15 octobre 2026, sur Ethereum Sepolia (chainId `11155111`).

### Le token YC42

| | |
|---|---|
| Adresse | [`0xee8224DC19837cf266684b2fd4cfdEa4835b2323`](https://sepolia.etherscan.io/address/0xee8224DC19837cf266684b2fd4cfdEa4835b2323#code) |
| Déployeur | `0x29e55047e0f421a99F5fD76a465F28F767DE5007` |
| Transaction | [`0x4dd672829433c8fda2874b6b0df9df9f9333c9f5aa7ced0be9fd3ed45261eaa6`](https://sepolia.etherscan.io/tx/0x4dd672829433c8fda2874b6b0df9df9f9333c9f5aa7ced0be9fd3ed45261eaa6) |
| Bloc | 11 916 251 |
| Gas consommé | 8 529 897, soit environ 0,0085 SepoliaETH |
| Vérification | ✅ Etherscan, Blockscout, Sourcify |

### Le Conseil du Babyfoot

| | |
|---|---|
| Adresse | [`0x425a39BCC9e7436A5aC1ad2a9B65B1C3f207F36B`](https://sepolia.etherscan.io/address/0x425a39BCC9e7436A5aC1ad2a9B65B1C3f207F36B#code) |
| Membres | Les 3 adresses de [`council_args.ts`](council_args.ts) |
| Transaction | [`0x65ab6fa48c7217a24c3fe102d8a4d648f5f1f06cc9267152939e08ed13e7b622`](https://sepolia.etherscan.io/tx/0x65ab6fa48c7217a24c3fe102d8a4d648f5f1f06cc9267152939e08ed13e7b622) |
| Bloc | 11 918 777 |
| Gas consommé | 5 205 080, soit environ 0,0052 SepoliaETH |
| Vérification | ✅ Etherscan, Blockscout, Sourcify |
| Passation | [`0xc709ca95b30e3f31a5968bd3a98044d0a7131d52a584b76828d961fd7fbf4c76`](https://sepolia.etherscan.io/tx/0xc709ca95b30e3f31a5968bd3a98044d0a7131d52a584b76828d961fd7fbf4c76) (bloc 11 918 869) |
| Premier mint voté | [`0xfe35df99d2a28eead1fb951b64f4da236a58ee988028503eb12751b504950537`](https://sepolia.etherscan.io/tx/0xfe35df99d2a28eead1fb951b64f4da236a58ee988028503eb12751b504950537) (bloc 11 918 885) |

**Pourquoi autant de gas ?** Le même déploiement du token ne coûte que 1 280 265 gas sur la blockchain simulée de Hardhat. Sepolia applique des règles de prix plus récentes : stocker un octet de code y coûte environ **1 542 gas**, au lieu des 200 de la règle historique. Le token faisant 5 003 octets et le Conseil 3 006, l'écart vient de là, et non des contrats.
