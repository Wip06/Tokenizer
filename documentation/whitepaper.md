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
          │  mint : après un vote 2 sur 3, le Conseil crée 1 YC42 pour le correcteur
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
| Une correction est effectuée : le correcteur gagne 1 YC42 | Au Conseil, un membre fait `proposeMint(correcteur, 1 YC42)` et un autre fait `confirm` : le Conseil appelle alors `mint` |
| Jouer une partie : le jeton est mis dans la machine | `burn(1 YC42)` : le jeton est détruit |
| Offrir une partie à un camarade, payer une fanny | `transfer(to, value)` |
| Laisser un ami jouer avec tes jetons, dans une limite fixée | `approve(spender, value)` puis `burnFrom(account, value)` |
| Le gérant vide la machine et remet les jetons en circulation | Les jetons brûlés libèrent de la place sous le plafond, qui peut être mintée à nouveau |
| Un tricheur tente de se créer des jetons | Refus de YC42 (`OwnableUnauthorizedAccount`), ou du Conseil s'il n'est pas membre (`NotCouncilMember`) |
| Un membre tente de se récompenser seul | Refus du Conseil : il faut la voix d'un deuxième membre (`AlreadyConfirmed`) |

---

## 4. Les chiffres (tokenomics)

| | Valeur | Explication |
|---|---|---|
| Supply initiale | **4 200 000 YC42** | 10 % du plafond, donnés au gérant pour lancer les premières parties |
| Supply maximale | **42 000 000 YC42** | 42, la réponse à la grande question sur la vie, l'univers et le reste. Il n'y aura jamais plus de 42 millions de jetons en circulation |
| Décimales | **18** | On peut diviser un jeton : 0,5 YC42 = une mi-temps |
| Création | Par le Conseil uniquement, après un vote 2 sur 3 | **1 YC42 par correction effectuée** |
| Destruction | Par chaque détenteur, pour ses propres jetons | **1 YC42 par partie jouée** |

Le plafond porte sur les jetons **en circulation** : chaque partie jouée (un `burn`) libère une place, que le Conseil peut remplir en récompensant une nouvelle correction (un `mint`).

---

## 5. Les règles du campus

1. **Une correction = 1 YC42.** Chaque correction de projet effectuée rapporte un jeton au correcteur.
2. **Une partie = 1 YC42.** Le jeton est brûlé quand la partie commence.
3. **On peut offrir une partie** : un `transfer` vers le camarade de ton choix.
4. **La fanny** : celui qui perd 10-0 doit **1 YC42** à son adversaire, en plus du passage sous la table. Le contrat ne gère pas le passage sous la table, on compte sur l'honnêteté du perdant.
5. **Pas de roulette !** Comme au babyfoot, la triche est interdite. YC42 refuse tout `mint` qui ne vient pas du Conseil, et le Conseil exige deux voix : personne ne peut se créer des jetons seul.

---

## 6. Gouvernance et sécurité

### Le gérant : le Conseil du Babyfoot

Au lancement, le gérant était une seule personne, le créateur du token. Mais un gérant unique, c'est un point faible : si sa clé privée était volée, le voleur pourrait créer des jetons, et rien n'empêcherait un gérant malhonnête de se récompenser sans avoir corrigé.

Depuis le 15 octobre 2026, la gestion de YC42 est confiée au **Conseil du Babyfoot**, un contrat **multisig** à **3 membres** :

1. un membre **propose** une action, par exemple « 1 YC42 pour ce correcteur » ;
2. un **deuxième** membre **confirme** ;
3. à la deuxième voix, l'action est **exécutée** automatiquement.

Un membre seul ne peut rien faire, et une seule clé volée ne suffit plus.

### Ce que le Conseil peut faire

- Distribuer les récompenses de correction (`mint`), **sans jamais dépasser 42 millions de jetons en circulation**.
- Confier la gestion à quelqu'un d'autre (`transferOwnership`), par exemple à un nouveau Conseil si les membres changent.

Il ne peut **pas** renoncer à la gestion : sa conception ne prévoit pas `renounceOwnership`, ce qui évite de bloquer la création de jetons pour toujours par erreur.

### Ce que personne ne peut faire, pas même le Conseil

- Prendre les jetons de quelqu'un.
- Bloquer ou annuler un transfert.
- Brûler les jetons d'un joueur sans son autorisation.
- Dépasser le plafond de 42 millions.

Ces garanties sont écrites dans le code des deux contrats, publics et vérifiés sur Etherscan : elles ne dépendent pas de la bonne foi des membres.

### La limite de la blockchain : elle ne voit pas les corrections

Le contrat ne peut pas savoir qu'une correction a eu lieu : cette information vit sur l'intranet de 42, pas sur la blockchain. **Ce sont les membres du Conseil qui vérifient et votent les récompenses.** Grâce au vote à deux voix, il faudrait que deux membres s'entendent pour tricher.

---

## 7. Feuille de route

| Étape | État |
|---|---|
| Contrat YC42 écrit, commenté et testé (13 tests) | ✅ |
| Déploiement sur Sepolia | ✅ |
| Code source publié sur Etherscan, Blockscout et Sourcify | ✅ |
| Premiers transferts entre joueurs | ✅ |
| Conseil du Babyfoot : multisig 2 sur 3, testé (6 tests), déployé et publié | ✅ |
| Passation de YC42 au Conseil et premier mint voté | ✅ |

---

## 8. Informations techniques

| | |
|---|---|
| Standard | ERC-20 |
| Réseau | Ethereum Sepolia (chainId `11155111`) |
| Adresse du token | [`0xee8224DC19837cf266684b2fd4cfdEa4835b2323`](https://sepolia.etherscan.io/address/0xee8224DC19837cf266684b2fd4cfdEa4835b2323#code) |
| Adresse du Conseil | [`0x425a39BCC9e7436A5aC1ad2a9B65B1C3f207F36B`](https://sepolia.etherscan.io/address/0x425a39BCC9e7436A5aC1ad2a9B65B1C3f207F36B#code) |
| Code source | [`YC42.sol`](../code/contracts/YC42.sol) et [`BabyfootCouncil.sol`](../code/contracts/BabyfootCouncil.sol) |

Pour utiliser le token, voir le [guide d'utilisation](guide_utilisation.md).

*Don't panic. Une correction, une partie.*
