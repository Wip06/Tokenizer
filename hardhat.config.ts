import { existsSync } from "node:fs";
import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable, defineConfig } from "hardhat/config";

// Charge les secrets du fichier .env dans les variables d'environnement,
// où configVariable() ira les chercher. Le fichier est facultatif : sans lui,
// on peut quand même compiler et lancer les tests.
if (existsSync(".env")) {
  process.loadEnvFile(".env");
}

export default defineConfig({
  // Regroupe ethers.js, les outils de test Mocha/Chai et la vérification
  // des contrats sur Etherscan.
  plugins: [hardhatToolboxMochaEthersPlugin],

  // Version du compilateur Solidity.
  solidity: "0.8.34",

  // Le sujet impose le code du token dans `code/` et le déploiement dans
  // un dossier à part : on remplace donc les dossiers par défaut de Hardhat.
  paths: {
    sources: "./code/contracts",
    tests: { mocha: "./code/test" },
  },

  networks: {
    // Sepolia, le réseau de test public d'Ethereum : aucun argent réel.
    sepolia: {
      type: "http",
      chainType: "l1",
      // Aucun secret n'est écrit dans ce fichier : configVariable() lit la
      // valeur dans le fichier .env, qui n'est jamais commit.
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
  },

  // Sert à publier le code source vérifié sur Etherscan.
  verify: {
    etherscan: {
      apiKey: configVariable("ETHERSCAN_API_KEY"),
    },
  },
});
