// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./CreatorToken.sol";

contract TokenFactory {
    enum TokenStatus {
        Active,
        Paused,
        Deactivated
    }

    struct TokenInfo {
        address token;
        address creator;
        string name;
        string symbol;
        string imageCID;
        string description;
        uint8 category;
        TokenStatus status;
        uint256 createdAt;
    }

    TokenInfo[] public allTokens;

    mapping(address => address[]) public creatorTokens;
    mapping(address => uint256) private tokenIndex;
    mapping(address => bool) public tokenExists;

    event TokenCreated(address indexed creator, address indexed token);
    event TokenPaused(address indexed token);
    event TokenActivated(address indexed token);
    event TokenDeactivated(address indexed token);

    function createToken(
        string calldata name,
        string calldata symbol,
        uint256 supply,
        string calldata imageCID,
        string calldata description,
        uint8 category
    ) external returns (address tokenAddr) {
        CreatorToken token = new CreatorToken(
            name,
            symbol,
            supply,
            msg.sender
        );

        tokenAddr = address(token);

        allTokens.push(
            TokenInfo({
                token: tokenAddr,
                creator: msg.sender,
                name: name,
                symbol: symbol,
                imageCID: imageCID,
                description: description,
                category: category,
                status: TokenStatus.Active,
                createdAt: block.timestamp
            })
        );

        tokenIndex[tokenAddr] = allTokens.length - 1;
        tokenExists[tokenAddr] = true;
        creatorTokens[msg.sender].push(tokenAddr);

        emit TokenCreated(msg.sender, tokenAddr);
    }

    function pauseToken(address token) external {
        require(tokenExists[token], "token not found");

        TokenInfo storage info = allTokens[tokenIndex[token]];
        require(msg.sender == info.creator, "not creator");
        require(info.status == TokenStatus.Active, "not active");

        info.status = TokenStatus.Paused;
        emit TokenPaused(token);
    }

    function activateToken(address token) external {
        require(tokenExists[token], "token not found");

        TokenInfo storage info = allTokens[tokenIndex[token]];
        require(msg.sender == info.creator, "not creator");
        require(info.status == TokenStatus.Paused, "not paused");

        info.status = TokenStatus.Active;
        emit TokenActivated(token);
    }

    function deactivateToken(address token) external {
        require(tokenExists[token], "token not found");

        TokenInfo storage info = allTokens[tokenIndex[token]];
        require(msg.sender == info.creator, "not creator");
        require(info.status != TokenStatus.Deactivated, "already");

        info.status = TokenStatus.Deactivated;
        emit TokenDeactivated(token);
    }

    function getAllTokens() external view returns (TokenInfo[] memory) {
        return allTokens;
    }

    function getCreatorTokens(address creator)
        external
        view
        returns (address[] memory)
    {
        return creatorTokens[creator];
    }

    function getTokenStatus(address token)
        external
        view
        returns (TokenStatus)
    {
        require(tokenExists[token], "token not found");
        return allTokens[tokenIndex[token]].status;
    }

    function getTokenInfo(address token)
        external
        view
        returns (TokenInfo memory)
    {
        require(tokenExists[token], "token not found");
        return allTokens[tokenIndex[token]];
    }
}
