# ycandela-42 (YC42)

🇬🇧 English · [🇫🇷 Français](README.fr.md)

> ⚽ *"One evaluation, one game."*

**YC42** is the foosball token of 42: an **ERC-20** token on **Ethereum Sepolia**. Every peer evaluation earns the evaluator **1 YC42**, and every foosball game burns one. New tokens can only be minted by the **Babyfoot Council** (*babyfoot* is French for foosball), a multisig where 2 of 3 members must agree.

Built for the **Tokenizer** project at [42](https://42.fr). Educational project on a testnet: the token has **no real value**.

---

## Deployed contracts

Network: **Ethereum Sepolia** (chain ID `11155111`). Both contracts are verified on Etherscan, Blockscout and Sourcify.

| Contract | Address |
|---|---|
| YC42 token | [`0xee8224DC19837cf266684b2fd4cfdEa4835b2323`](https://sepolia.etherscan.io/address/0xee8224DC19837cf266684b2fd4cfdEa4835b2323#code) |
| Babyfoot Council (owner of YC42) | [`0x425a39BCC9e7436A5aC1ad2a9B65B1C3f207F36B`](https://sepolia.etherscan.io/address/0x425a39BCC9e7436A5aC1ad2a9B65B1C3f207F36B#code) |

| Token | |
|---|---|
| Name / ticker | `ycandela-42` / `YC42` |
| Decimals | `18` |
| Initial supply | 4,200,000 YC42 |
| Max supply | 42,000,000 YC42 |

---

## Repository structure

```
.
├── code/
│   ├── contracts/        YC42.sol (token), BabyfootCouncil.sol (multisig)
│   └── test/             19 automated tests
├── deployment/           deployment scripts and step-by-step guide
├── documentation/        whitepaper and user guide (in French)
└── hardhat.config.ts     compiler, network and verification settings
```

---

## Design choices

| Choice | Why |
|---|---|
| **Ethereum** | The 42 subject leaves the blockchain open, as long as its standard is respected. Ethereum created smart contracts and ERC-20, and has the best tooling and documentation |
| **Sepolia testnet** | The project must never use real money. Sepolia behaves exactly like mainnet and is supported by MetaMask and Etherscan |
| **ERC-20** | The standard for fungible tokens: YC42 works out of the box with every wallet and explorer |
| **Solidity 0.8.34** | The main language for Ethereum. Since 0.8, arithmetic overflows revert automatically |
| **OpenZeppelin 5.6.1** | Audited building blocks (`ERC20`, `ERC20Burnable`, `Ownable`) instead of reinventing the standard. `YC42.sol` only adds the project rules |
| **Hardhat 3 + TypeScript** | One tool to compile, test, deploy and verify, with reproducible scripts |
| **Hard cap of 42M** | Nobody, not even the owner, can mint forever. Burned tokens free up room under the cap, like tokens collected from a foosball table |

### Permissions

| Action | Who |
|---|---|
| `transfer`, `approve`, `burn` | Any holder, with their own tokens |
| `transferFrom`, `burnFrom` | An address the holder approved first |
| `mint`, `transferOwnership` | **The Council only**, after a 2-of-3 vote |

No one can take someone else's tokens, block transfers, or exceed the cap.

---

## Bonus: the Babyfoot Council (multisig)

With a single owner, everything depends on one private key. The Council removes that single point of failure:

1. a member **proposes** an action (`proposeMint(to, amount)`), which counts as their vote;
2. a second member **confirms** (`confirm(proposalId)`);
3. the action **runs automatically** on the second vote.

The Council is purpose-built for YC42 rather than a generic multisig, which keeps it short and readable. It can also hand ownership back by vote (`proposeOwnershipTransfer`), so the setup is reversible. YC42 itself was not modified: ownership was simply transferred to the Council.

---

## Security

- Secrets (private key, API key) live in a git-ignored `.env`; only the empty [`.env.example`](.env.example) template is committed.
- Deployment uses a dedicated test wallet.
- 19 tests cover the cap, ownership and voting rules before anything is deployed.
- No single account can mint: it takes 2 of the 3 Council members.

---

## Quick start

Requires **Node.js 24** (see [`.nvmrc`](.nvmrc)).

```bash
nvm use
npm install
npm run build    # compile the contracts
npm test         # run the 19 tests
```

To deploy your own copy, follow [`deployment/README.md`](deployment/README.md) (in French).

---

## Documentation (in French)

- [Whitepaper](documentation/whitepaper.md): what YC42 represents, its rules and governance
- [User guide](documentation/guide_utilisation.md): MetaMask setup, transfers, burns, voting a mint
- [French README](README.fr.md): every design choice explained in detail
