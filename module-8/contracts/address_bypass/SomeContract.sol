//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Address.sol";

contract SomeContract {
    constructor() {
        // To safeguard against extcodesize bypass
        // require(msg.sender == tx.origin, "Caller is a contract!");
        bool isNotContract = !Address.isContract(msg.sender);
        require(isNotContract, "Caller is a contract!");
    }
}
