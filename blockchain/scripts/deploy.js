const hre = require("hardhat");

async function main() {
  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");

  // Deploy
  const supplyChain = await SupplyChain.deploy();

  // Wait for deployment
  await supplyChain.waitForDeployment();

  // Get the transaction receipt to check block number
  const receipt = await supplyChain.deploymentTransaction().wait();

  console.log("✅ SupplyChain deployed to:", supplyChain.target);
  console.log("📦 Deployed in block:", receipt.blockNumber);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
