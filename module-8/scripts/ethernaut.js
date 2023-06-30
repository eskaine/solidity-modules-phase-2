const hre = require("hardhat");

async function ethernaut() {
  const GatekeeperTwo = await hre.ethers.getContractFactory("GatekeeperTwo");
  const gatekeeperTwo = await GatekeeperTwo.deploy();
  await gatekeeperTwo.deployed();
  
  const GatekeeperTwoAttack = await hre.ethers.getContractFactory("GatekeeperTwoAttack");
  const gatekeeperTwoAttack = await GatekeeperTwoAttack.deploy(gatekeeperTwo.address);
  await gatekeeperTwoAttack.deployed();

  // const num = await gatekeeperTwoAttack.convertedAddress();
  // console.log(num);

  // const binaryNum = Number(num).toString(2);
  // console.log(binaryNum);

  // const newBinary = binaryNum.split("").map(x => Number(!Number(x)).toString()).join("");
  // console.log(newBinary);

  // const num2 = await gatekeeperTwoAttack.convertedAddress2();
  // console.log(num2);
  // const binaryNum2 = Number(num2).toString(2);
  // console.log(binaryNum2);


  // const x = "000" + Number("1747165870446776319").toString(2);


  // console.log(x);
  // console.log(parseInt("0001100000111111001011100001101000101111101010101000111111111111"));
  // console.log(Number(Number("18446744073709551615") ^ num));

  // await gatekeeperTwoAttack.attack(gatekeeperTwo.address);
}

async function main() {
  await ethernaut();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
