import { network } from "hardhat";

// Se connecte au réseau choisi avec l'option --network :
//   - sans option : blockchain simulée en local, pour s'entraîner gratuitement ;
//   - --network sepolia : le vrai déploiement, avec le wallet du fichier .env.
const { ethers, networkName } = await network.create();

const [deployer] = await ethers.getSigners();
const balance = await ethers.provider.getBalance(deployer.address);

console.log(`Réseau     : ${networkName}`);
console.log(`Déployeur  : ${deployer.address}`);
console.log(`Solde      : ${ethers.formatEther(balance)} ETH`);

// Déployer coûte du gas : inutile d'essayer avec un wallet vide.
if (balance === 0n) {
  throw new Error("Solde nul : récupère des SepoliaETH sur un faucet avant de déployer.");
}

// Envoie la transaction de déploiement, puis attend qu'elle soit incluse dans un bloc.
const token = await ethers.deployContract("YC42");
console.log(`Transaction : ${token.deploymentTransaction()?.hash}`);
await token.waitForDeployment();

const tokenAddress = await token.getAddress();
console.log(`\nYC42 déployé à l'adresse : ${tokenAddress}`);

if (networkName === "sepolia") {
  console.log(`\nVoir sur Etherscan : https://sepolia.etherscan.io/address/${tokenAddress}`);
  console.log(`Publier le code    : npm run verify -- ${tokenAddress}`);
}
