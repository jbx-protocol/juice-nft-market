//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./IPriceCalculator.sol";

contract ExamplePriceCalculator is IPriceCalculator {
    mapping(IERC721 => mapping(uint256 => mapping(address => uint256)))
        public priceFor;

    function getCurrentPriceOf(
        IERC721 _contract,
        uint256 _tokenId,
        address _owner
    ) external view override returns (uint256) {
        return priceFor[_contract][_tokenId][_owner];
    }

    function setPriceOf(
        IERC721 _contract,
        uint256 _tokenId,
        uint256 _price
    ) external {
        priceFor[_contract][_tokenId][msg.sender] = _price;
    }
}
