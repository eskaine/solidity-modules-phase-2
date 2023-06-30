// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GuessTheRandomNumber {
    uint8 answer;
    

    constructor() payable {
        require(msg.value == 1 ether);
        bytes memory blockString = abi.encodePacked(blockhash(block.number - 1), block.timestamp);
        answer = uint8(uint256(keccak256(blockString)));
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function guess(uint8 n) public payable {
        require(msg.value == 1 ether);

        if (n == answer) {
            payable(msg.sender).transfer(2 ether);
        }
    }
}
