// SPDX-License-Identifer :MIT
pragma solidity ^0.8.28;

import "./CreatorToken.sol";

contract TokenFactory {

    enum TokenStatus {

        Active ,
        Paused ,
        Deactivated 

    }
     struct Tokeninfo {

        address token ;
        address creator ;
        string name ;
        string symbol ;
        string image ;
        string description ;
        uint8 category ;
        TokenStatus status ;
        uint256 createdAt ;

     }

     Tokeninfo[] public allTokens ;

     mapping(address => address[])public tokenCreator ;
     mapping(address => uint256)public tokenIndex ;

     event TokenCreated(address indexed creator , address indexed token);
     event TokenActivated(address indexed token);
     event TokenPaused(address indexed token);
     event TokenDeactivated(address indexed token);

     function tokenCreate(
        string calldata name ,
        string calldata description ,
        uint256 supply ,
        string calldata image ,
        string calldata description ,
        uint8 category
     )external returns(address tokenAdd){
        CreatorToken token = new CreatorToken(
            name , 
            symbol ,
            supply ,
            msg.sender
        );
        tokenAdd = address(token);

        allTokens.push (
            Tokeninfo({
                token : tokenAdd ,
                creator : msg.sender ,
                name : name ,
                symbol : symbol ,
                image : image ,
                description : description ,
                category : category ,
                status : TokenStatus.Active ,
                createdAt : block.timestamp 
            })
        );

        tokenIndex[tokenAdd] = allTokens.length -1 ;
        CreatorToken[msg.sender].push(tokenAdd);

        emit TokenCreated(msg.sender, tokenAdd);
     }


     function pauseToken(address token)external {
        Tokeninfo storage info = allTokens[tokenIndex[token]];
        require(msg.sender == info.creator ,"not creator");
        require(info.status == TokenStatus.Active ,"not active");

        info.status = TokenStatus.Paused;
        emit TokenPaused(token);
     }

     function activateToken(address token)external {
        Tokeninfo storage info = allTokens[tokenIndex[token]];
        require(msg.sender == info.creator ,"not creator");
        require(info.status == TokenStatus.Paused ,"Token is already active");

        info.status = TokenStatus.Active;
        emit TokenActivated(token);
     }
}