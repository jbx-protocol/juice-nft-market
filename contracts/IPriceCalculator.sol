//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IPriceCalculator {
    function getCurrentPriceOf(
        IERC721 _contract,
        uint256 _tokenId,
        address _owner
    ) external view returns (uint256);
}
