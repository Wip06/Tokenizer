# Guide d'utilisation de YC42

Ce guide explique comment détenir, envoyer et utiliser des YC42, puis comment le Conseil du Babyfoot vote la création de nouveaux jetons. Il suffit de MetaMask et d'Etherscan. Pour les notions de base (wallet, gas, transaction…), voir [notions.md](notions.md).

Réseau : **Ethereum Sepolia**

| Contrat | Adresse |
|---|---|
| Token YC42 | `0xee8224DC19837cf266684b2fd4cfdEa4835b2323` |
| Conseil du Babyfoot | `0x425a39BCC9e7436A5aC1ad2a9B65B1C3f207F36B` |

---

## 1. Ce qu'il faut

| Élément | Pourquoi | Où le trouver |
|---|---|---|
| **MetaMask** | Le wallet qui garde ta clé et signe tes transactions | Extension de navigateur, sur metamask.io |
| **Le réseau Sepolia** | YC42 n'existe que sur ce réseau de test | Dans MetaMask : active l'affichage des réseaux de test, puis choisis Sepolia |
| **Un peu de SepoliaETH** | Chaque action qui modifie la blockchain coûte du gas, payé en ETH | Un faucet gratuit, par exemple [Google Cloud](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) ou le [PoW faucet](https://sepolia-faucet.pk910.de) |

Pour recevoir des YC42, pas besoin de SepoliaETH : il en faut seulement pour **envoyer** ou **agir**.

---

## 2. Voir ses YC42 dans MetaMask

1. Dans MetaMask, sur le réseau Sepolia, clique sur **Importer des tokens**.
2. Colle l'adresse du token : `0xee8224DC19837cf266684b2fd4cfdEa4835b2323`.
3. Le ticker (`YC42`) et les décimales (`18`) se remplissent tout seuls. Valide.

Ton solde de YC42 apparaît désormais dans MetaMask.

---

## 3. Les montants : attention aux 18 décimales

La blockchain ne connaît pas les nombres à virgule. Elle compte en **plus petites unités** : 1 YC42 = 10¹⁸ unités.

- **Dans MetaMask** (bouton « Envoyer »), tu tapes le montant normal : `1`, `0.5`, `100`.
- **Sur Etherscan** (onglet *Write Contract*), tu dois taper le montant en plus petites unités :

| Montant voulu | À taper sur Etherscan |
|---|---|
| 0,5 YC42 (une mi-temps) | `500000000000000000` |
| 1 YC42 (une partie, ou une correction) | `1000000000000000000` |
| 10 YC42 | `10000000000000000000` |
| 100 YC42 | `100000000000000000000` |

---

## 4. Consulter les informations (gratuit)

Sur la page du token, [Etherscan → Contract → Read Contract](https://sepolia.etherscan.io/address/0xee8224DC19837cf266684b2fd4cfdEa4835b2323#readContract), sans wallet ni frais :

| Fonction | Ce qu'elle renvoie |
|---|---|
| `name` / `symbol` / `decimals` | `ycandela-42` / `YC42` / `18` |
| `totalSupply` | Le nombre de jetons en circulation |
| `MAX_SUPPLY` / `INITIAL_SUPPLY` | Le plafond (42 M) et la supply de départ (4,2 M) |
| `balanceOf(account)` | Le solde d'une adresse |
| `allowance(owner, spender)` | Ce que `spender` peut encore dépenser pour `owner` |
| `owner` | Le propriétaire : l'adresse du Conseil du Babyfoot |

Les montants s'affichent en plus petites unités. Pour voir tous les soldes d'un coup, ouvre l'onglet [Holders](https://sepolia.etherscan.io/token/0xee8224DC19837cf266684b2fd4cfdEa4835b2323#balances) de la page du token.

---

## 5. Envoyer des jetons (`transfer`)

*Offrir une partie à un camarade, payer une fanny.*

**Depuis MetaMask** (le plus simple) :
1. Clique sur **YC42**, puis **Envoyer**.
2. Colle l'adresse du destinataire et tape le montant, par exemple `1`.
3. **Continuer**, puis **Confirmer**.

**Depuis Etherscan** (pour montrer l'appel au contrat) :
1. Ouvre le [Write Contract du token](https://sepolia.etherscan.io/address/0xee8224DC19837cf266684b2fd4cfdEa4835b2323#writeContract) et clique sur **Connect to Web3** pour brancher MetaMask.
2. Ouvre `transfer` et remplis `to` (l'adresse du destinataire) et `value` (le montant en plus petites unités).
3. Clique sur **Write** et confirme dans MetaMask.
4. Ouvre la transaction avec **View your transaction**. Elle doit afficher *Success* et *ERC-20 Tokens Transferred*.

---

## 6. Jouer une partie (`burn`)

*Mettre le jeton dans la machine.*

Dans le **Write Contract** du token, ouvre `burn`, entre `value = 1000000000000000000` (1 YC42), puis **Write** et confirme. Le jeton est détruit : ton solde et `totalSupply` baissent de 1 YC42.

---

## 7. Laisser quelqu'un dépenser pour toi (`approve`)

*Ton ami peut payer ses parties avec tes jetons, dans une limite que tu fixes.*

1. **Toi** : `approve(spender, value)`, avec l'adresse de ton ami et le maximum autorisé.
2. **Ton ami**, connecté avec son compte :
   - `transferFrom(from, to, value)` pour envoyer tes jetons à quelqu'un ;
   - ou `burnFrom(account, value)` pour jouer avec.
3. À chaque utilisation, l'autorisation diminue. `allowance(toi, ton ami)` montre ce qu'il reste.

Pour retirer l'autorisation, refais `approve` avec `value = 0`.

---

## 8. Créer des jetons : le vote du Conseil

*Récompenser une correction.*

Depuis la passation, **seul le Conseil du Babyfoot peut créer des jetons** : `mint` refuse tout autre appelant, y compris l'ancien propriétaire. Le Conseil agit dès que **2 de ses 3 membres** sont d'accord :

| Membre | Adresse |
|---|---|
| Membre 1 | `0x29e55047e0f421a99F5fD76a465F28F767DE5007` |
| Membre 2 | `0x3dBA7D94089Ccc464e9d8E403bC6B468d4353460` |
| Membre 3 | `0xe9d9812535f6a93C44281A24251c74E5f686738a` |

### Ce qu'il faut

- **Deux comptes membres** dans MetaMask, chacun avec un peu de SepoliaETH pour le gas.
- La page du Conseil : [Write Contract](https://sepolia.etherscan.io/address/0x425a39BCC9e7436A5aC1ad2a9B65B1C3f207F36B#writeContract) et [Read Contract](https://sepolia.etherscan.io/address/0x425a39BCC9e7436A5aC1ad2a9B65B1C3f207F36B#readContract).

### Étape 1 : un premier membre propose

1. Sur le **Write Contract du Conseil**, clique sur **Connect to Web3** et choisis un **compte membre**, par exemple le membre 1.
2. Ouvre `proposeMint` et remplis :
   - `to` : l'adresse du correcteur à récompenser ;
   - `amount` : `1000000000000000000` (1 YC42).
3. Clique sur **Write**. Dans MetaMask, vérifie que la transaction est adressée au **Conseil** (`0x425a39BC…`), puis confirme.

La proposition est enregistrée avec **1 confirmation** : proposer compte comme un vote. Aucun jeton n'est encore créé.

### Étape 2 : retrouver le numéro de la proposition

Les propositions sont numérotées dans l'ordre : `0`, `1`, `2`… Le premier vote, la proposition `0`, a déjà eu lieu le 15 octobre 2026 : la prochaine porte donc le numéro `1`, puis `2`, etc.

Pour vérifier, ouvre `proposals` dans le **Read Contract du Conseil** et entre le numéro :

| Champ | Valeur attendue après l'étape 1 |
|---|---|
| `target` | L'adresse du correcteur |
| `amount` | `1000000000000000000` |
| `isOwnershipTransfer` | `false` |
| `confirmations` | `1` |
| `executed` | `false` |

Si `proposals` renvoie une erreur, c'est que ce numéro n'existe pas encore.

### Étape 3 : un deuxième membre confirme

1. Dans Etherscan, déconnecte-toi, puis reconnecte-toi avec un **autre compte membre**, par exemple le membre 2.
2. Ouvre `confirm` et entre le numéro de la proposition dans `proposalId`.
3. Clique sur **Write** et confirme dans MetaMask.

C'est la **2e confirmation** : dans la même transaction, le Conseil appelle `mint` sur YC42 et le jeton est créé.

### Étape 4 : vérifier

- Dans la transaction, Etherscan affiche *ERC-20 Tokens Transferred : From Null Address To (le correcteur) For 1 YC42*. Un mint, c'est un transfert « depuis nulle part ».
- Dans le Read Contract du Conseil, `proposals(numéro)` affiche maintenant `confirmations = 2` et `executed = true`.
- Dans le Read Contract du token, `balanceOf(correcteur)` et `totalSupply` ont augmenté de 1 YC42.

### Rendre ou transmettre la propriété de YC42

Même principe, avec `proposeOwnershipTransfer(newOwner)` à l'étape 1, puis `confirm` par un deuxième membre. À la 2e confirmation, `newOwner` devient le propriétaire de YC42 et le Conseil perd tous ses droits.

---

## 9. Les erreurs possibles

Quand une règle n'est pas respectée, le contrat **annule toute la transaction** (*revert*) : rien ne change, seul le gas consommé est perdu.

**Côté token (YC42)** :

| Erreur | Signification |
|---|---|
| `OwnableUnauthorizedAccount(account)` | `account` n'est pas le propriétaire (le Conseil). Par exemple, quelqu'un appelle `mint` directement sur le token : **pas de roulette !** |
| `MaxSupplyExceeded(requestedAmount, remainingMintable)` | Ce `mint` ferait dépasser 42 millions de jetons en circulation |
| `ERC20InsufficientBalance(sender, balance, needed)` | Solde insuffisant |
| `ERC20InsufficientAllowance(spender, allowance, needed)` | L'autorisation donnée avec `approve` est trop faible |
| `ERC20InvalidReceiver(receiver)` | Envoi vers l'adresse zéro, interdit |

**Côté Conseil** :

| Erreur | Signification |
|---|---|
| `NotCouncilMember(account)` | `account` n'est pas membre du Conseil : il ne peut ni proposer ni confirmer |
| `AlreadyConfirmed(proposalId, member)` | Ce membre a déjà voté pour cette proposition. Attention, proposer compte déjà comme un vote |
| `ProposalAlreadyExecuted(proposalId)` | La proposition a déjà été exécutée : elle ne peut pas l'être une deuxième fois |
| Erreur sans nom (*panic*) sur `confirm` ou `proposals` | Ce numéro de proposition n'existe pas |

Si YC42 refuse le mint au moment de la 2e confirmation (plafond dépassé, par exemple), **la confirmation est annulée aussi** : la proposition reste à 1 confirmation.

---

## 10. Problème connu : le « smart account » de MetaMask

Les versions récentes de MetaMask proposent de transformer ton compte en « smart account » (transactions de type `0x4`, EIP-7702). MetaMask fait alors passer tes appels par son propre contrat intermédiaire, et cet intermédiaire peut échouer alors que ton appel est valide.

**Comment le reconnaître** : la transaction échoue, et Etherscan montre qu'elle a été envoyée à une autre adresse que celle du token (`0xee8224DC…`) ou du Conseil (`0x425a39BC…`).

**Solution** : refuse la conversion en smart account, ou repasse en compte standard dans les détails du compte MetaMask. Avant de confirmer, vérifie toujours l'adresse de destination de la transaction.

---

## 11. Démo en 5 minutes

1. **Lire** : dans le Read Contract du token, montrer `name`, `symbol`, `totalSupply` et `MAX_SUPPLY`, puis `owner`, qui est l'adresse du Conseil.
2. **Envoyer** : faire un `transfer` de 1 YC42 du membre 1 vers le membre 2, puis vérifier `balanceOf`.
3. **Jouer** : faire un `burn` de 1 YC42 et constater que `totalSupply` baisse.
4. **Récompenser une correction** : le membre 1 propose `proposeMint(correcteur, 1000000000000000000)`, le membre 2 fait `confirm`. Montrer que `totalSupply` augmente.
5. **Sécurité** :
   - avec le membre 1, appeler `mint` directement sur le token : c'est refusé avec `OwnableUnauthorizedAccount`, même l'ancien propriétaire ne peut plus agir seul ;
   - avec le membre 1, refaire `confirm` sur une proposition qu'il vient de faire : c'est refusé avec `AlreadyConfirmed`, un membre seul ne peut pas atteindre 2 voix.
