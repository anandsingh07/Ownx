// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CreatorToken is ERC20 {
    address public immutable creator;
    uint256 public immutable maxSupply;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 supply_,
        address creator_
    ) ERC20(name_, symbol_) {
        require(creator_ != address(0), "invalid creator");
        require(supply_ > 0, "invalid supply");

        creator = creator_;
        maxSupply = supply_;

        _mint(creator_, supply_);
    }
}
