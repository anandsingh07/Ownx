// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Treasury {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {}

    function withdraw(address payable to, uint256 amount) external {
        require(msg.sender == owner, "not owner");
        require(amount <= address(this).balance, "exceeds");

        to.transfer(amount);
    }
}
