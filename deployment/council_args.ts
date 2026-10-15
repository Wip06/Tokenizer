// Paramètres du constructeur du Conseil du Babyfoot. Ce fichier sert à la fois
// au script de déploiement et à la vérification sur Etherscan
// (npm run verify:council) : les deux utilisent exactement les mêmes valeurs.

// Le token YC42, déjà déployé sur Sepolia.
export const YC42_ADDRESS = "0xee8224DC19837cf266684b2fd4cfdEa4835b2323";

// Les trois membres du Conseil. Pour le projet, ce sont trois comptes MetaMask ;
// dans la vraie vie, ce seraient trois personnes différentes.
export const COUNCIL_MEMBERS = [
  "0x29e55047e0f421a99F5fD76a465F28F767DE5007", // compte 1 : le déployeur
  "0x3dBA7D94089Ccc464e9d8E403bC6B468d4353460", // compte 2
  "0xe9d9812535f6a93C44281A24251c74E5f686738a", // compte 3
];

export default [YC42_ADDRESS, COUNCIL_MEMBERS];
