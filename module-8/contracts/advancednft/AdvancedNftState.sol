// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract AdvancedNftState {
    enum Stages {
        PreSale,
        PublicSale,
        Withdrawal,
        End
    }

    Stages public stage = Stages.Withdrawal;

    modifier atStage(Stages _stage) {
        require(stage >= _stage);
        _;
    }
    
    function nextStage() internal {
        stage = Stages(uint(stage) + 1);
    }
}
