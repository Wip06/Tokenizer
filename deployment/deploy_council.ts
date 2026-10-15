// Déploie le Conseil du Babyfoot (npm run deploy:council). La passation de YC42
// au Conseil se fait ensuite à la main sur Etherscan, avec transferOwnership :
// on peut ainsi vérifier le Conseil avant de lui confier le token.

import { network } from "hardhat";
// Mêmes paramètres que ceux relus par la vérification (npm run verify:council).
import { COUNCIL_MEMBERS, YC42_ADDRESS } from "./council_args.js";

// Se connecte au réseau choisi avec --network (sepolia dans package.json).
const { ethers, networkName } = await network.create();

// Un membre mal saisi rendrait son siège inutilisable : on vérifie avant
// de dépenser du gas.
for (const member of COUNCIL_MEMBERS) {
  if (!ethers.isAddress(member)) {
    throw new Error(`Adresse de membre invalide dans council_args.ts : ${member}`);
  }
}

// Le compte du .env, qui signe et paie le déploiement.
const [deployer] = await ethers.getSigners();
console.log(`Réseau     : ${networkName}`);
console.log(`Déployeur  : ${deployer.address}`);
console.log(`Token YC42 : ${YC42_ADDRESS}`);
console.log(`Membres    : ${COUNCIL_MEMBERS.join(", ")}`);

// Les deux valeurs sont passées au constructeur : (YC42 yc42, address[3] councilMembers).
const council = await ethers.deployContract("BabyfootCouncil", [YC42_ADDRESS, COUNCIL_MEMBERS]);
console.log(`Transaction : ${council.deploymentTransaction()?.hash}`);
// Attend que la transaction soit incluse dans un bloc.
await council.waitForDeployment();

const councilAddress = await council.getAddress();
console.log(`\nConseil déployé à l'adresse : ${councilAddress}`);

// Sur Sepolia, rappelle les étapes suivantes.
if (networkName === "sepolia") {
  console.log(`\nVoir sur Etherscan : https://sepolia.etherscan.io/address/${councilAddress}`);
  console.log(`Publier le code    : npm run verify:council -- ${councilAddress}`);
  console.log(`Étape suivante     : sur YC42, appeler transferOwnership(${councilAddress})`);
}
