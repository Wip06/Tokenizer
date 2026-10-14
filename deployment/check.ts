import { network } from "hardhat";

// Vérifie la configuration du fichier .env sans rien envoyer sur la blockchain :
// la connexion au nœud, la clé privée, et le solde du wallet qui déploiera.
const { ethers, networkName } = await network.create();

const [deployer] = await ethers.getSigners();
const { chainId } = await ethers.provider.getNetwork();
const balance = await ethers.provider.getBalance(deployer.address);

console.log(`Réseau  : ${networkName} (chainId ${chainId})`);
console.log(`Adresse : ${deployer.address}`);
console.log(`Solde   : ${ethers.formatEther(balance)} ETH`);
