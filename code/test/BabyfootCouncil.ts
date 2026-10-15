import { expect } from "chai";
import { network } from "hardhat";

// Blockchain simulée en local, comme pour les tests de YC42.
const { ethers, networkHelpers } = await network.create();
const { loadFixture } = networkHelpers;

const ONE_TOKEN = ethers.parseUnits("1", 18);

// Déploie YC42, puis un Conseil de 3 membres (Alice, Bob, Carol), et lui
// donne la propriété du token. Dave est un joueur qui ne fait pas partie du Conseil.
async function deployCouncilFixture() {
  const [deployer, alice, bob, carol, dave] = await ethers.getSigners();
  const token = await ethers.deployContract("YC42");
  const council = await ethers.deployContract("BabyfootCouncil", [
    await token.getAddress(),
    [alice.address, bob.address, carol.address],
  ]);
  await token.transferOwnership(await council.getAddress());
  return { token, council, deployer, alice, bob, carol, dave };
}

describe("BabyfootCouncil", function () {
  it("a 3 membres valides et devient propriétaire de YC42", async function () {
    const { token, council, alice, bob, carol, dave } = await loadFixture(deployCouncilFixture);

    expect(await council.isMember(alice.address)).to.equal(true);
    expect(await council.isMember(bob.address)).to.equal(true);
    expect(await council.isMember(carol.address)).to.equal(true);
    expect(await council.isMember(dave.address)).to.equal(false);
    expect(await token.owner()).to.equal(await council.getAddress());

    // Un Conseil avec deux fois le même membre est refusé au déploiement.
    const tokenAddress = await token.getAddress();
    await expect(
      ethers.deployContract("BabyfootCouncil", [tokenAddress, [alice.address, alice.address, bob.address]]),
    )
      .to.be.revertedWithCustomError(council, "InvalidMember")
      .withArgs(alice.address);
  });

  it("un mint s'exécute à la 2e confirmation, pas avant", async function () {
    const { token, council, alice, bob, dave } = await loadFixture(deployCouncilFixture);

    // Alice propose de récompenser Dave : 1 confirmation sur 2, rien n'est encore créé.
    await council.connect(alice).proposeMint(dave.address, ONE_TOKEN);
    expect(await token.balanceOf(dave.address)).to.equal(0n);

    // Bob confirme : 2 confirmations sur 2, le mint part automatiquement.
    await expect(council.connect(bob).confirm(0))
      .to.changeTokenBalance(ethers, token, dave, ONE_TOKEN);
  });

  it("refuse les non-membres", async function () {
    const { council, alice, dave } = await loadFixture(deployCouncilFixture);

    await expect(council.connect(dave).proposeMint(dave.address, ONE_TOKEN))
      .to.be.revertedWithCustomError(council, "NotCouncilMember")
      .withArgs(dave.address);

    await council.connect(alice).proposeMint(dave.address, ONE_TOKEN);
    await expect(council.connect(dave).confirm(0))
      .to.be.revertedWithCustomError(council, "NotCouncilMember")
      .withArgs(dave.address);
  });

  it("refuse une double confirmation et une double exécution", async function () {
    const { council, alice, bob, carol, dave } = await loadFixture(deployCouncilFixture);
    await council.connect(alice).proposeMint(dave.address, ONE_TOKEN);

    // Alice a déjà confirmé en proposant : elle ne peut pas atteindre 2 toute seule.
    await expect(council.connect(alice).confirm(0))
      .to.be.revertedWithCustomError(council, "AlreadyConfirmed")
      .withArgs(0n, alice.address);

    // Une fois exécutée par Bob, la proposition ne peut plus être confirmée.
    await council.connect(bob).confirm(0);
    await expect(council.connect(carol).confirm(0))
      .to.be.revertedWithCustomError(council, "ProposalAlreadyExecuted")
      .withArgs(0n);
  });

  it("l'ancien propriétaire ne peut plus minter directement", async function () {
    const { token, deployer } = await loadFixture(deployCouncilFixture);

    await expect(token.mint(deployer.address, ONE_TOKEN))
      .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
      .withArgs(deployer.address);
  });

  it("peut rendre la propriété de YC42, à 2 sur 3", async function () {
    const { token, council, deployer, alice, bob } = await loadFixture(deployCouncilFixture);

    await council.connect(alice).proposeOwnershipTransfer(deployer.address);
    await council.connect(bob).confirm(0);

    expect(await token.owner()).to.equal(deployer.address);
  });
});
