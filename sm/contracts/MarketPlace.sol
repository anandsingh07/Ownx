// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ITokenFactory {
    function getTokenStatus(address token) external view returns (uint8);
}

contract Marketplace is ReentrancyGuard {
    uint256 public constant PLATFORM_FEE = 30; // 0.3%
    uint256 public constant CREATOR_FEE = 70;  // 0.7%

    ITokenFactory public factory;

    struct Trade {
        address trader;
        address token;
        bool isBuy;
        uint256 ethAmount;
        uint256 tokenAmount;
        uint256 timestamp;
    }

    mapping(address => Trade[]) public userTrades;
    mapping(address => Trade[]) public tokenTrades;

    mapping(address => uint256) public totalVolumeETH;
    mapping(address => uint256) public totalTrades;
    mapping(address => uint256) public lastTradeAt;

    uint256 public platformEarnings;

    event TradeExecuted(
        address indexed trader,
        address indexed token,
        bool isBuy,
        uint256 ethAmount,
        uint256 tokenAmount
    );

    constructor(address factory_) {
        factory = ITokenFactory(factory_);
    }

    function buy(address token) external payable nonReentrant {
        require(msg.value > 0, "no eth");
        require(factory.getTokenStatus(token) == 0, "inactive");

        uint256 fee = (msg.value * (PLATFORM_FEE + CREATOR_FEE)) / 10_000;
        uint256 net = msg.value - fee;

        uint256 tokenAmount = net * 1000;

        IERC20(token).transfer(msg.sender, tokenAmount);

        _recordTrade(msg.sender, token, true, msg.value, tokenAmount);
    }

    function sell(address token, uint256 amount) external nonReentrant {
        require(amount > 0, "zero");
        require(factory.getTokenStatus(token) == 0, "inactive");

        IERC20(token).transferFrom(msg.sender, address(this), amount);

        uint256 ethAmount = amount / 1000;
        uint256 fee = (ethAmount * (PLATFORM_FEE + CREATOR_FEE)) / 10_000;
        uint256 net = ethAmount - fee;

        payable(msg.sender).transfer(net);

        _recordTrade(msg.sender, token, false, ethAmount, amount);
    }

    function _recordTrade(
        address trader,
        address token,
        bool isBuy,
        uint256 ethAmount,
        uint256 tokenAmount
    ) internal {
        Trade memory t = Trade(
            trader,
            token,
            isBuy,
            ethAmount,
            tokenAmount,
            block.timestamp
        );

        userTrades[trader].push(t);
        tokenTrades[token].push(t);

        totalVolumeETH[token] += ethAmount;
        totalTrades[token] += 1;
        lastTradeAt[token] = block.timestamp;

        emit TradeExecuted(trader, token, isBuy, ethAmount, tokenAmount);
    }

    function getUserTrades(address user)
        external
        view
        returns (Trade[] memory)
    {
        return userTrades[user];
    }

    function getTokenTrades(address token)
        external
        view
        returns (Trade[] memory)
    {
        return tokenTrades[token];
    }
}
