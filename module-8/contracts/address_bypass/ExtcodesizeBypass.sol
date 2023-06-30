//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./SomeContract.sol";

contract ExtcodesizeBypass {
    constructor() {
        SomeContract someContract = new SomeContract();
    }
}
