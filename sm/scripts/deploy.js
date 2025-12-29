const hre = require("hardhat");

async function main() {
  
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying with:", await deployer.getAddress());

  const TokenFactory = await hre.ethers.getContractFactory(
    "TokenFactory",
    deployer
  );
  const factory = await TokenFactory.deploy();
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("TokenFactory deployed to:", factoryAddress);

  const Marketplace = await hre.ethers.getContractFactory(
    "Marketplace",
    deployer
  );
  const marketplace = await Marketplace.deploy(factoryAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("Marketplace deployed to:", marketplaceAddress);

  const Treasury = await hre.ethers.getContractFactory(
    "Treasury",
    deployer
  );
  const treasury = await Treasury.deploy();
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();
  console.log("Treasury deployed to:", treasuryAddress);

  console.log("\n✅ Deployment Complete");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
