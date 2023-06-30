const hre = require("hardhat");

async function addressBypassHack() {
  const ExtcodesizeBypass = await hre.ethers.getContractFactory("ExtcodesizeBypass");
  const extcodesizeBypass = await ExtcodesizeBypass.deploy();
  await extcodesizeBypass.deployed();
}

async function trusterHack() {
  const TOKENS_IN_POOL = 1000000n * 10n ** 18n;

  const DamnValuableToken = await hre.ethers.getContractFactory("DamnValuableToken");
  const damnValuableToken = await DamnValuableToken.deploy();
  await damnValuableToken.deployed();
  
  const Truster = await hre.ethers.getContractFactory("Truster");
  const truster = await Truster.deploy(damnValuableToken.address);
  await truster.deployed();
  await damnValuableToken.transfer(truster.address, TOKENS_IN_POOL);

  const balance = await damnValuableToken.balanceOf(truster.address);

  const FlashLoanAttack = await hre.ethers.getContractFactory("FlashLoanAttack");
  const flashLoanAttack = await FlashLoanAttack.deploy(truster.address, damnValuableToken.address);
  await flashLoanAttack.deployed();
  await flashLoanAttack.attack();
}

async function main() {
  // await addressBypassHack();
  await trusterHack();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
