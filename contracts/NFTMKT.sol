//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "hardhat/console.sol";
import "@jbox/sol/contracts/abstract/JuiceboxProject.sol";

/**
 * @title NFTMKT
 * @author @nnnnicholas & @mejango
 * @notice An NFT marketplace built for Juicebox projects.
 * @dev Accepts ERC721.
 */
contract NFTMKT is JuiceboxProject, IERC721Receiver {
    /**
    @dev The direct deposit terminals.
    */
    ITerminalDirectory public immutable terminalDirectory;

    /**
     * @notice Emitted when an NFT is successfully submitted to NFTMKT.
     * @param _from The address that submitted the NFT.
     * @param _contract The NFT's contract address.
     * @param _tokenId The NFT's tokenId.
     */
    event Submitted(
        address indexed _from,
        address indexed _contract,
        address indexed _tokenId
    );
    /**
     * @notice Emitted when an NFT is successfully withdrawn from NFTMKT.
     * @param _to The address that submitted the NFT.
     * @param _contract The NFT's contract address.
     * @param _tokenId The NFT's tokenId.
     */
    event Withdrawn(
        address indexed _to,
        address indexed _contract,
        address indexed _tokenId
    );

    /**
     * @notice Emitted when an NFT is successfully purchased from NFTMKT.
     * @param _from The address that submitted the NFT.
     * @param _to The address that purchased the NFT.
     * @param _contract The NFT's contract address.
     * @param _tokenId The NFT's tokenId.
     */
    event Purchased(
        address _from,
        address indexed _to,
        address indexed _contract,
        uint256 indexed _tokenId
    );

    /**
     * @notice Creates a NFTMKT for a Juicebox project.
     * @param _projectID The project's ID in HEX
     * @param terminalDirectory A directory of a project's current Juicebox terminal to receive payments in.
     */
    constructor(uint256 _projectID, ITerminalDirectory _terminalDirectory)
        JuiceboxProject(_projectID, _terminalDirectory)
    {
        
    }

    /**
     * @notice Submit NFT to the NFTMKT and define who will receive project Project tokens resulting from a sale.
     * @dev `payoutMods` are validated to add up to no more than 100%.
     * @param _nft The NFT being submitted.
     * @param payoutMods The mods that will receive project token payouts.
     **/
    function submit(
        address _contract,
        uint256 _tokenId,
        PayoutMod[] payoutMods
    ) {
        emit Submitted(msg.sender, _contract, _tokenId);
    }

    /**
     *
     */
    function purchase(address _contractId, uint256 _tokenId) {
        // must route funds received from buyer to the preconfigured Mods. Logic for this can be very similar to the _distributeToPayoutMods
        // see https://github.com/jbx-protocol/juicehouse/blob/540f3037689ae74f2f97d95f9f28d88f69afd4a3/packages/hardhat/contracts/TerminalV1.sol#L1015
        // If PayoutMod points at a project, call _terminal.pay(), if it pays out to an address, just transfer  directly
    }

    /**
     * @notice Withdraw NFT from marketplace. Can only be called on a given NFT by the address that submit it.
     * @dev
     * @param
     * @param
     */
    function withdraw(address _contractId, uint256 _tokenId) public {
        emit Withdrawn(msg.sender, _contract, _tokenId);
    }

    /**
     * @dev Tells ERC-721 contracts that this contract can receive ERC-721s (supports IERC721Receiver)
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) public pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
