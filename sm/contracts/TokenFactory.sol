// SPDX-License-Identifer:MIT 
pragma solidity ^0.8.28;

import "./CreatorToken.sol";

contract TokenFactory {

    enum TokenStatus{

        Active ,
        Pending ,
        Deactivated 

    }

    struct Tokeninfo {

        address token ;
        address creator ;
        string name ;
        string symbol ;
        string description ;
        string image ;
        uint8 category ;
        TokenStatus status ;
        uint256 createdAt ;

    }

    Tokeninfo [] public alltokens ;

    mapping(address => address[])public creatorTokens ;
    mapping(address => uint256)public tokenIndex ;
}