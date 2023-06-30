const hre = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const { deployContract } = require("./helpers");

const value = ethers.utils.parseUnits("1", "ether");

// Capture the Ether, Lotteries 1 - Guess the Number
// Comment: this is straightforward since the answer is right there in the contract
async function lotteries1() {
  const [, attacker] = await ethers.getSigners();
  // const params = [{ value }];
  const NewContract = await hre.ethers.getContractFactory("GuessTheNumber");
  const newContract = await NewContract.deploy();
  await newContract.deployed({ value });
  const x = await hre.ethers.provider.getBalance(newContract.address);
  console.log({x})
  // const guessTheNumber = await deployContract("GuessTheNumber", params);

  // Solution
  // await guessTheNumber.connect(attacker).guess(42, { value });
  // const isComplete = await guessTheNumber.isComplete();
  // console.log(`Is challenge completed: ${isComplete}`);
}

// Capture the Ether, Lotteries 2 - Guess the Secret Number
// Comment: Since there's way to reverse a cryptographic hash and
// secret number is uint8 which the max number is a relatively small number,
// I supposed the solution is a brute force method and it does not seems
// a re-entrancy hack will worked with a check in place
async function lotteries2() {
  const [, attacker] = await ethers.getSigners();
  const params = [{ value }];
  const guessTheSecretNumber = await deployContract("GuessTheSecretNumber", params);

  // Solution
  const secretNumber = await _findSecretNumber(
    guessTheSecretNumber,
    attacker,
    value
  );
  let isComplete = false;

  // Keep calling with secret number until ether is drained
  while (!isComplete) {
    await guessTheSecretNumber.connect(attacker).guess(secretNumber, { value });
    isComplete = await guessTheSecretNumber.isComplete();
  }

  console.log(`Is challenge completed: ${isComplete}`);
  console.log(`Secret Number is: ${secretNumber}`);
}

// Capture the Ether, Lotteries 3 - Guess the Random Number
// Comment: similar to Lotteries 2 - Guess the Secret Number
async function lotteries3() {
  const [, attacker] = await ethers.getSigners();
  const params = [{ value }];
  const guessTheRandomNumber = await deployContract("GuessTheRandomNumber", params);

  // Solution
  const secretNumber = await _findSecretNumber(
    guessTheRandomNumber,
    attacker,
    value
  );
  let isComplete = false;

  // Keep calling with secret number until ether is drained
  while (!isComplete) {
    await guessTheRandomNumber.connect(attacker).guess(secretNumber, { value });
    isComplete = await guessTheRandomNumber.isComplete();
  }

  console.log(`Is challenge completed: ${isComplete}`);
  console.log(`Secret Number is: ${secretNumber}`);
}

// Capture the Ether, Lotteries 4 - Guess the New Number
// Comment: this solution is based on the basis that block timestamp 
// can be manipulated to some extent, afterwhich the guess number
// can be determined before calling the smart contract
async function lotteries4() {
  const [, attacker] = await ethers.getSigners();
  const params = [{ value }];
  const guessTheNewNumber = await deployContract("GuessTheNewNumber", params);

  // Solution
  // Set timestamp of next block
  const minute = 60;
  const currentBlock = await ethers.provider.getBlock();
  const nextTimestamp = currentBlock.timestamp + minute;
  await helpers.time.setNextBlockTimestamp(nextTimestamp);
  // Generate guess number
  const bytesArray = ethers.utils.solidityKeccak256(
    ["address", "uint256"],
    [currentBlock.hash, nextTimestamp]
  );
  const hexString = ethers.utils.hexlify(bytesArray);
  const [decodedValue] = ethers.utils.defaultAbiCoder.decode(
    ["uint8"],
    ethers.utils.hexDataSlice(hexString, 0)
  );
  const num = Number(decodedValue);

  await guessTheNewNumber.connect(attacker).guess(num, { value });
  const isComplete = await guessTheNewNumber.isComplete();
  console.log(`Is challenge completed: ${isComplete}`);
}


async function _findSecretNumber(contract, user, value) {
  let secretNumber = 0;
  let isCorrect = false;

  // Find secret number
  while (!isCorrect) {
    const existingBalanceResult = await hre.ethers.provider.getBalance(
      contract.address
    );
    const existingBalance = Number(existingBalanceResult);
    await contract.connect(user).guess(secretNumber, { value });
    const balanceResult = await hre.ethers.provider.getBalance(
      contract.address
    );
    const balance = Number(balanceResult);

    if (balance < existingBalance) {
      isCorrect = true;
      return secretNumber;
    }

    secretNumber++;
  }
}

async function main() {
  // lotteries1();
  // lotteries2();
  // lotteries3();
  lotteries4();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
