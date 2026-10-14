# YC42 : le whitepaper

> ⚽ *« Une correction, une partie. »*

> ⚠️ **Avertissement** : YC42 est un projet pédagogique de l'école 42, déployé sur Sepolia, un réseau de test. Le token n'a **aucune valeur réelle** et ne s'achète ni ne se vend.

---

## 1. Le problème

À 42, les corrections entre pairs sont au cœur de l'apprentissage. Mais corriger le projet d'un camarade à 23 h ne rapporte rien de concret, alors que le babyfoot du campus, lui, attend des joueurs. Et :

- les pièces se perdent au fond des sacs ;
- les dettes de babyfoot s'oublient : après une nuit de debug, plus personne ne sait qui doit une partie à qui.

## 2. La solution

**YC42**, le jeton de babyfoot du campus, sur la blockchain :

- **Chaque correction de projet effectuée rapporte 1 YC42** au correcteur.
- **Chaque partie de babyfoot coûte 1 YC42**, qui est brûlé (détruit) au début de la partie.
- Chaque jeton et chaque échange sont inscrits sur la blockchain, un registre public où rien ne s'efface : impossible de tricher sur son solde ou d'oublier une dette.

---

## 3. La vie d'un jeton

```
   Correction de projet effectuée
          │  mint : le gérant crée 1 YC42 pour le correcteur
          ▼
   ┌─────────────┐   transfer (facultatif) : offrir une partie, payer une fanny   ┌─────────────┐
   │  Correcteur │ ─────────────────────────────────────────────────────────────► │  Camarade   │
   └─────────────┘                                                                └─────────────┘
          │                                                                              │
          └──────────────────────────────┬───────────────────────────────────────────────┘
                                         │  burn : le jeton est mis dans la machine
                                         ▼
                                  ┌─────────────┐
                                  │  Babyfoot   │  la partie commence, le jeton est détruit
                                  └─────────────┘  et libère une place sous le plafond
```

| Dans l'histoire | Dans le contrat |
|---|---|
| Une correction est effectuée : le correcteur gagne 1 YC42 | `mint(correcteur, 1 YC42)`, réservé au gérant (propriétaire) |
| Jouer une partie : le jeton est mis dans la machine | `burn(1 YC42)` : le jeton est détruit |
| Offrir une partie à un camarade, payer une fanny | `transfer(to, value)` |
| Laisser un ami jouer avec tes jetons, dans une limite fixée | `approve(spender, value)` puis `burnFrom(account, value)` |
| Le gérant vide la machine et remet les jetons en circulation | Les jetons brûlés libèrent de la place sous le plafond, qui peut être mintée à nouveau |
| Un tricheur tente de se créer des jetons | Refus du contrat : `OwnableUnauthorizedAccount` |

---

## 4. Les chiffres (tokenomics)

| | Valeur | Explication |
|---|---|---|
| Supply initiale | **4 200 000 YC42** | 10 % du plafond, donnés au gérant pour lancer les premières parties |
| Supply maximale | **42 000 000 YC42** | 42, la réponse à la grande question sur la vie, l'univers et le reste. Il n'y aura jamais plus de 42 millions de jetons en circulation |
| Décimales | **18** | On peut diviser un jeton : 0,5 YC42 = une mi-temps |
| Création | Par le gérant uniquement | **1 YC42 par correction effectuée** |
| Destruction | Par chaque détenteur, pour ses propres jetons | **1 YC42 par partie jouée** |

Le plafond porte sur les jetons **en circulation** : chaque partie jouée (un `burn`) libère une place, que le gérant peut remplir en récompensant une nouvelle correction (un `mint`).

---

## 5. Les règles du campus

1. **Une correction = 1 YC42.** Chaque correction de projet effectuée rapporte un jeton au correcteur.
2. **Une partie = 1 YC42.** Le jeton est brûlé quand la partie commence.
3. **On peut offrir une partie** : un `transfer` vers le camarade de ton choix.
4. **La fanny** : celui qui perd 10-0 doit **1 YC42** à son adversaire, en plus du passage sous la table. Le contrat ne gère pas le passage sous la table, on compte sur l'honnêteté du perdant.
5. **Pas de roulette !** Comme au babyfoot, la triche est interdite. Le contrat refuse tout `mint` venant d'une autre adresse que celle du gérant : impossible de se créer des jetons sans avoir corrigé.

---

## 6. Gouvernance et sécurité

### Ce que le gérant (propriétaire) peut faire

- Distribuer les récompenses de correction (`mint`), **sans jamais dépasser 42 millions de jetons en circulation**.
- Confier la gestion à quelqu'un d'autre (`transferOwnership`).
- Renoncer définitivement à la gestion (`renounceOwnership`). Plus personne ne pourra alors créer de jetons : les corrections ne rapporteront plus rien, et la quantité en circulation ne pourra plus que diminuer.

### Ce qu'il ne peut pas faire

- Prendre les jetons de quelqu'un.
- Bloquer ou annuler un transfert.
- Brûler les jetons d'un joueur sans son autorisation.
- Dépasser le plafond de 42 millions.

Ces garanties sont écrites dans le code, public et vérifié sur Etherscan : elles ne dépendent pas de la bonne foi du gérant.

### La limite de la blockchain : elle ne voit pas les corrections

Le contrat ne peut pas savoir qu'une correction a eu lieu : cette information vit sur l'intranet de 42, pas sur la blockchain. **C'est le gérant qui vérifie et distribue les récompenses.** Il faut donc lui faire confiance pour ne récompenser que les vraies corrections.

### Le risque restant, et la suite

Si la clé privée du gérant était volée, le voleur pourrait créer des jetons jusqu'au plafond. Pour supprimer ce point faible, et pour ne plus dépendre d'une seule personne, la gestion sera confiée au **Conseil du Babyfoot**, un contrat **multisig** : chaque création de jetons demandera l'accord de **2 membres sur 3**. Une seule clé volée ou un seul gérant malhonnête ne suffira plus.

---

## 7. Feuille de route

| Étape | État |
|---|---|
| Contrat YC42 écrit, commenté et testé (13 tests) | ✅ |
| Déploiement sur Sepolia | ✅ |
| Code source publié sur Etherscan, Blockscout et Sourcify | ✅ |
| Premiers transferts entre joueurs | ✅ |
| Conseil du Babyfoot : multisig 2 sur 3 | 🔜 |

---

## 8. Informations techniques

| | |
|---|---|
| Standard | ERC-20 |
| Réseau | Ethereum Sepolia (chainId `11155111`) |
| Adresse | [`0xee8224DC19837cf266684b2fd4cfdEa4835b2323`](https://sepolia.etherscan.io/address/0xee8224DC19837cf266684b2fd4cfdEa4835b2323#code) |
| Code source | [`code/contracts/YC42.sol`](../code/contracts/YC42.sol) |

Pour utiliser le token, voir le [guide d'utilisation](guide-utilisation.md).

*Don't panic. Une correction, une partie.*
