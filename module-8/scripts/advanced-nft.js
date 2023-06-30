const hre = require("hardhat");
const ethers = require("ethers");
const crypto = require("crypto");
const merkleTree = require("./helpers/merkle-tree");

// arbitrary number of addresses
const ADDRESSES_COUNT = 99;

async function advancedNft() {
  const treeValues = createMerkleTreeValues();
  const tree = merkleTree.createTree(treeValues);

  const AdvancedNft = await hre.ethers.getContractFactory("AdvancedNft");
  const advancedNft = await AdvancedNft.deploy(tree.root);
  await advancedNft.deployed();
  console.log(`Deploy to ${advancedNft.address}`);
}

function createMerkleTreeValues() {
  let bitmapIndex = 3;
  let addresses = [
    ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 0],
    ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 1],
    ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 2],
  ];

  while (bitmapIndex < ADDRESSES_COUNT) {
    const id = crypto.randomBytes(32).toString("hex");
    const privateKey = "0x" + id;
    const wallet = new ethers.Wallet(privateKey);
    addresses.push([wallet.address, bitmapIndex]);
    bitmapIndex++;
  }

  return addresses;
}

async function main() {
  await advancedNft();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
