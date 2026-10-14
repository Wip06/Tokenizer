# Guide d'utilisation de YC42

Ce guide explique comment détenir, envoyer et utiliser des YC42, sans rien installer d'autre que MetaMask. Pour les notions de base (wallet, gas, transaction…), voir [notions.md](notions.md).

**Adresse du contrat** : `0xee8224DC19837cf266684b2fd4cfdEa4835b2323` sur **Ethereum Sepolia**

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
2. Colle l'adresse du contrat : `0xee8224DC19837cf266684b2fd4cfdEa4835b2323`.
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
| 1 YC42 (une partie) | `1000000000000000000` |
| 10 YC42 | `10000000000000000000` |
| 100 YC42 | `100000000000000000000` |

---

## 4. Consulter les informations (gratuit)

Sur [Etherscan → Contract → Read Contract](https://sepolia.etherscan.io/address/0xee8224DC19837cf266684b2fd4cfdEa4835b2323#readContract), sans wallet ni frais :

| Fonction | Ce qu'elle renvoie |
|---|---|
| `name` / `symbol` / `decimals` | `ycandela-42` / `YC42` / `18` |
| `totalSupply` | Le nombre de jetons en circulation |
| `MAX_SUPPLY` / `INITIAL_SUPPLY` | Le plafond (42 M) et la supply de départ (4,2 M) |
| `balanceOf(account)` | Le solde d'une adresse |
| `allowance(owner, spender)` | Ce que `spender` peut encore dépenser pour `owner` |
| `owner` | L'adresse du gérant (propriétaire) |

Les montants s'affichent en plus petites unités.

---

## 5. Envoyer des jetons (`transfer`)

*Offrir une partie à un camarade, payer une fanny.*

**Depuis MetaMask** (le plus simple) :
1. Clique sur **YC42**, puis **Envoyer**.
2. Colle l'adresse du destinataire et tape le montant, par exemple `1`.
3. **Continuer**, puis **Confirmer**.

**Depuis Etherscan** (pour montrer l'appel au contrat) :
1. Ouvre [Write Contract](https://sepolia.etherscan.io/address/0xee8224DC19837cf266684b2fd4cfdEa4835b2323#writeContract) et clique sur **Connect to Web3** pour brancher MetaMask.
2. Ouvre `transfer` et remplis `to` (l'adresse du destinataire) et `value` (le montant en plus petites unités).
3. Clique sur **Write** et confirme dans MetaMask.
4. Ouvre la transaction avec **View your transaction**. Elle doit afficher *Success* et *ERC-20 Tokens Transferred*.

---

## 6. Jouer une partie (`burn`)

*Mettre le jeton dans la machine.*

Dans **Write Contract**, ouvre `burn`, entre `value = 1000000000000000000` (1 YC42), puis **Write** et confirme. Le jeton est détruit : ton solde et `totalSupply` baissent de 1 YC42.

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

## 8. Les fonctions du gérant (propriétaire uniquement)

| Fonction | Effet |
|---|---|
| `mint(to, amount)` | Crée `amount` jetons pour `to`, sans jamais dépasser 42 millions en circulation. Pour récompenser une correction : `mint(correcteur, 1000000000000000000)` |
| `transferOwnership(newOwner)` | Confie la gestion à une autre adresse : l'ancien gérant perd tous ses droits |
| `renounceOwnership()` | ⚠️ **Irréversible** : plus personne ne pourra jamais fabriquer de jetons |

Appelées depuis une autre adresse que celle du gérant, ces fonctions sont refusées.

---

## 9. Les erreurs possibles

Quand une règle n'est pas respectée, le contrat **annule toute la transaction** (*revert*) : rien ne change, seul le gas consommé est perdu.

| Erreur | Signification |
|---|---|
| `OwnableUnauthorizedAccount(account)` | `account` n'est pas le gérant : **pas de roulette !** |
| `MaxSupplyExceeded(requestedAmount, remainingMintable)` | Ce `mint` ferait dépasser 42 millions de jetons en circulation |
| `ERC20InsufficientBalance(sender, balance, needed)` | Solde insuffisant |
| `ERC20InsufficientAllowance(spender, allowance, needed)` | L'autorisation donnée avec `approve` est trop faible |
| `ERC20InvalidReceiver(receiver)` | Envoi vers l'adresse zéro, interdit |

---

## 10. Problème connu : le « smart account » de MetaMask

Les versions récentes de MetaMask proposent de transformer ton compte en « smart account » (transactions de type `0x4`, EIP-7702). MetaMask fait alors passer tes appels par son propre contrat intermédiaire, et cet intermédiaire peut échouer alors que ton appel est valide.

**Comment le reconnaître** : la transaction échoue et Etherscan montre qu'elle a été envoyée à une autre adresse que `0xee8224DC…`.

**Solution** : refuse la conversion en smart account, ou repasse en compte standard dans les détails du compte MetaMask. Avant de confirmer, vérifie toujours que la transaction est bien adressée au contrat YC42.

---

## 11. Démo en 5 minutes

1. **Lire** : sur *Read Contract*, montrer `name`, `symbol`, `totalSupply`, `MAX_SUPPLY` et `owner`.
2. **Envoyer** : faire un `transfer` de 1 YC42 du gérant vers un compte 2, puis vérifier `balanceOf(compte 2)`.
3. **Jouer** : faire un `burn` de 1 YC42 et constater que `totalSupply` baisse.
4. **Récompenser une correction** : le gérant fait un `mint` de 1 YC42 vers le compte 2, et `totalSupply` augmente.
5. **Sécurité** : connecté avec le compte 2, tenter un `mint`. Il est refusé avec `OwnableUnauthorizedAccount`.
