// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GuessTheNewNumber {
    constructor() payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function guess(uint8 n) public payable {
        require(msg.value == 1 ether);
        bytes memory blockString = abi.encodePacked(blockhash(block.number - 1), block.timestamp);
        uint8 answer = uint8(uint256(keccak256(blockString)));

        if (n == answer) {
            payable(msg.sender).transfer(2 ether);
        }
    }
}
