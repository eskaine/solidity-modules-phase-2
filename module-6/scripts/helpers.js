const hre = require("hardhat");

async function deployContract(contractName, params = []) {
  const NewContract = await hre.ethers.getContractFactory(contractName);
  const newContract = await NewContract.deploy(...params);
  await newContract.deployed();

  return newContract;
}

module.exports = { deployContract };
