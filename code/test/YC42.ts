import { expect } from "chai";
import { network } from "hardhat";

// Démarre une blockchain simulée en local, rien que pour les tests :
// aucune transaction n'est envoyée sur Sepolia et rien ne coûte d'ETH.
const { ethers, networkHelpers } = await network.create();
const { loadFixture } = networkHelpers;

// Convertit un nombre de YC42 « lisible » (ex. "1000") dans la plus petite
// unité stockée par le contrat (1000 × 10^18), comme le fait un wallet.
function toTokenUnits(amount: string): bigint {
  return ethers.parseUnits(amount, 18);
}

// Déploie un contrat neuf et renvoie les comptes de test. Grâce à loadFixture,
// le déploiement n'a lieu qu'une fois : avant chaque test, la blockchain est
// remise dans cet état, pour que les tests restent indépendants.
async function deployTokenFixture() {
  const [owner, alice, bob] = await ethers.getSigners();
  const token = await ethers.deployContract("YC42");
  return { token, owner, alice, bob };
}

describe("YC42", function () {
  describe("Déploiement", function () {
    it("a le bon nom, le bon ticker et 18 décimales", async function () {
      const { token } = await loadFixture(deployTokenFixture);

      expect(await token.name()).to.equal("ycandela-42");
      expect(await token.symbol()).to.equal("YC42");
      expect(await token.decimals()).to.equal(18n);
    });

    it("donne 4,2 millions de YC42 au déployeur, sous un plafond de 42 millions", async function () {
      const { token, owner } = await loadFixture(deployTokenFixture);

      expect(await token.MAX_SUPPLY()).to.equal(toTokenUnits("42000000"));
      expect(await token.totalSupply()).to.equal(toTokenUnits("4200000"));
      expect(await token.balanceOf(owner.address)).to.equal(toTokenUnits("4200000"));
    });

    it("désigne le déployeur comme propriétaire", async function () {
      const { token, owner } = await loadFixture(deployTokenFixture);

      expect(await token.owner()).to.equal(owner.address);
    });
  });

  // Ces fonctions viennent d'OpenZeppelin, qui teste déjà tous leurs cas
  // d'erreur : on vérifie seulement qu'elles fonctionnent dans notre token.
  describe("Fonctions standard ERC-20", function () {
    it("transfer déplace des tokens d'un compte à un autre", async function () {
      const { token, owner, alice } = await loadFixture(deployTokenFixture);
      const amount = toTokenUnits("100");

      await expect(token.transfer(alice.address, amount))
        .to.changeTokenBalances(ethers, token, [owner, alice], [-amount, amount]);
    });

    it("transferFrom dépense une autorisation donnée avec approve", async function () {
      const { token, owner, alice, bob } = await loadFixture(deployTokenFixture);
      await token.approve(alice.address, toTokenUnits("100"));

      // Alice dépense 30 des 100 YC42 que le propriétaire l'autorise à utiliser.
      const amount = toTokenUnits("30");
      await expect(token.connect(alice).transferFrom(owner.address, bob.address, amount))
        .to.changeTokenBalances(ethers, token, [owner, bob], [-amount, amount]);
      expect(await token.allowance(owner.address, alice.address)).to.equal(toTokenUnits("70"));
    });

    it("burn détruit des tokens de l'appelant", async function () {
      const { token, owner } = await loadFixture(deployTokenFixture);
      const amount = toTokenUnits("500");
      const supplyBefore = await token.totalSupply();

      await expect(token.burn(amount))
        .to.changeTokenBalance(ethers, token, owner, -amount);
      expect(await token.totalSupply()).to.equal(supplyBefore - amount);
    });
  });

  describe("Mint", function () {
    it("le propriétaire peut créer des tokens", async function () {
      const { token, alice } = await loadFixture(deployTokenFixture);
      const amount = toTokenUnits("1000");
      const supplyBefore = await token.totalSupply();

      await expect(token.mint(alice.address, amount))
        .to.changeTokenBalance(ethers, token, alice, amount);
      expect(await token.totalSupply()).to.equal(supplyBefore + amount);
    });

    it("une autre adresse ne peut pas créer de tokens", async function () {
      const { token, alice } = await loadFixture(deployTokenFixture);

      await expect(token.connect(alice).mint(alice.address, toTokenUnits("1000")))
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
        .withArgs(alice.address);
    });

    it("le plafond peut être atteint, mais pas dépassé", async function () {
      const { token, alice } = await loadFixture(deployTokenFixture);
      const maxSupply = await token.MAX_SUPPLY();

      // On crée tout ce qui reste sous le plafond…
      await token.mint(alice.address, maxSupply - (await token.totalSupply()));
      expect(await token.totalSupply()).to.equal(maxSupply);

      // … après quoi même 1 unité de plus est refusée (demandé : 1, restant : 0).
      await expect(token.mint(alice.address, 1n))
        .to.be.revertedWithCustomError(token, "MaxSupplyExceeded")
        .withArgs(1n, 0n);
    });

    it("des tokens brûlés libèrent de la place sous le plafond", async function () {
      const { token, owner } = await loadFixture(deployTokenFixture);
      const maxSupply = await token.MAX_SUPPLY();
      const burnedAmount = toTokenUnits("500");

      // Plafond atteint, puis 500 YC42 brûlés : on peut à nouveau en créer 500.
      await token.mint(owner.address, maxSupply - (await token.totalSupply()));
      await token.burn(burnedAmount);
      await token.mint(owner.address, burnedAmount);

      expect(await token.totalSupply()).to.equal(maxSupply);
    });
  });

  describe("Propriété", function () {
    it("après transferOwnership, le nouveau propriétaire peut minter, l'ancien non", async function () {
      const { token, owner, alice } = await loadFixture(deployTokenFixture);
      const amount = toTokenUnits("1000");

      await token.transferOwnership(alice.address);
      expect(await token.owner()).to.equal(alice.address);

      await expect(token.connect(alice).mint(alice.address, amount))
        .to.changeTokenBalance(ethers, token, alice, amount);
      await expect(token.mint(owner.address, amount))
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
        .withArgs(owner.address);
    });

    it("une autre adresse ne peut pas s'emparer de la propriété", async function () {
      const { token, alice } = await loadFixture(deployTokenFixture);

      await expect(token.connect(alice).transferOwnership(alice.address))
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
        .withArgs(alice.address);
    });

    it("après renounceOwnership, plus personne ne peut créer de tokens", async function () {
      const { token, owner } = await loadFixture(deployTokenFixture);

      await token.renounceOwnership();
      expect(await token.owner()).to.equal(ethers.ZeroAddress);

      await expect(token.mint(owner.address, toTokenUnits("1000")))
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
        .withArgs(owner.address);
    });
  });
});
