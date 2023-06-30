const hre = require("hardhat");
const { deployContract } = require("./helpers");

// Capture the Ether, Math 1 - Token Sale
async function token1() {
  const [, attacker] = await ethers.getSigners();
  const value = ethers.utils.parseUnits("1", "ether");
  const tokenSale = await deployContract("TokenSale", [{value}]);
}

// Capture the Ether, Math 2 - Token Whale
async function token2() {}

// Capture the Ether, Misc 2 - Token Bank
async function token3() {}

async function main() {
  token1();
  token2();
  token3();
}
 
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
