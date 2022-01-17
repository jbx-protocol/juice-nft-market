//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import '@jbx-protocol/contracts/contracts/v1/interfaces/ITerminalDirectory.sol';
import '@openzeppelin/contracts/utils/Address.sol';
import '@paulrberg/contracts/math/PRBMath.sol';

struct SaleRecipient {
    bool preferUnstaked;
    uint16 percent;
    address payable beneficiary;
    string memo;
    uint256 projectId;
}

/**
 * @title NFTMKT
 * @author @juicebox
 * @notice An NFT marketplace built for Juicebox projects.
 * @dev Compatible with ERC-721 NFTs only.
 */
contract NFTMarket is IERC721Receiver, ReentrancyGuard {
    /**
    @dev The direct deposit terminals.
    */
    ITerminalDirectory public immutable terminalDirectory;

    // ERRORS //
    ///@notice Emitted when an address is not approved to move this NFT.
    error Unapproved();
    ///@notice Emitted when there is not at least 1 recipient.
    error NoRecipients();
    ///@notice Emitted when a recipient's percent is 0.
    error RecipientPercentZero();
    ///@notice Emitted when the sum of percent values exceeds 10000.
    error PercentExceeded();
    ///@notice Emitted when a projectId is not specified and the beneficiary is the zero address.
    error BeneficiaryIsZero();
    ///@notice Emitted when the sum of the sale recipients' distribution is not equal to 100%.
    error PercentNot100();
    ///@notice Emitted when the amount of ETH sent does not match the price of the listed NFT.
    error WrongPrice();
    ///@notice Emitted when the Terminal is the zero address.
    error TerminalNotFound();

    // TODO: Reuse the same SaleRecipient by using hashes of SaleRecipient as keys in a mapping instead
    // All sale recipients for each project ID's configurations.
    // mapping(bytes32 => SaleRecipient[]) saleRecipients; //declare first
    //listing
    // bytes32 hash = keccak256(abi.encode(_recipients)); //in the list fn (this line and subsequent)
    // if(saleRecipients[hash] != 0){
    //     // used stored recipients
    // } else {
    //     // check that it sums to 10000
    //     saleRecipients[hash] = _recipients;
    // }

    /**
     *  @notice Stores benificiaries of sale revenues and tokens
     *  address Address listing the NFT
     *  IERC721 NFT contract address
     *  uint256 NFT tokenId
     *  SaleRecipient[] Array of split receipients.
     */
    mapping(address => mapping(IERC721 => mapping(uint256 => SaleRecipient[]))) public recipientsOf;

    /**
     * @notice Stores each NFT's price
     * IERC721 NFT contract address
     * uint256 NFT tokenId
     * uint256 NFT price in wei
     */
    //TODO Should this mapping be contained in a mapping (listingAddress => IERC721)?
    //TODO Consider modularizing pricing strategies to support auctions, FOMO ramps, pricing tranches
    mapping(IERC721 => mapping(uint256 => uint256)) public prices;

    /**
     * @notice Emitted when an NFT is listed on NFTMKT.
     * @param _from The address that listed the NFT.
     * @param _contract The NFT's contract address.
     * @param _tokenId The NFT's tokenId.
     */
    event Listed(
        address indexed _from,
        IERC721 indexed _contract,
        uint256 indexed _tokenId,
        SaleRecipient[] _recipients,
        uint256 _price
    );
    /**
     * @notice Emitted when an NFT is delisted from NFTMKT.
     * @param _from The address that listed the NFT.
     * @param _contract The NFT's contract address.
     * @param _tokenId The NFT's tokenId.
     */
    event Delisted(address indexed _from, IERC721 indexed _contract, uint256 indexed _tokenId);

    /**
     * @notice Emitted when an NFT is purchased from NFTMKT.
     * @param _from The address that listed the NFT.
     * @param _to The address that purchased the NFT.
     * @param _contract The NFT's contract address.
     * @param _tokenId The NFT's tokenId.
     */
    event Purchased(
        address _from,
        address indexed _to,
        IERC721 indexed _contract,
        uint256 indexed _tokenId,
        uint256 _price
    );

    /**
     * @notice Creates an instance of NFTMKT. Any address may permissionlesly list their NFTs on this NFTMKT instance.
     * @dev Frontends can filter listed NFTs for those relevant to a specific project, or listed by a particular address.
     * @param _terminalDirectory A directory of a project's current Juicebox terminal to receive payments in.
     */
    constructor(ITerminalDirectory _terminalDirectory) {
        terminalDirectory = _terminalDirectory;
    }

    /**
     * @notice List NFT in the NFTMKT and define who will receive project tokens resulting from a sale.
     * @dev Listing address must `approve` the NFTMKT contract address on the 721 contract before calling `list` on NFTMKT, so the NFTMKT can move purchased NFTs.
     * @dev `_receipients` are validated to sum to no more than 100%.
     * @param _contract The contract that issued the listed NFT.
     * @param _tokenId The tokenId of the listed NFT.
     * @param _recipients An array of `SaleRecipient` that will receive project tokens issued in response to a sale.
     **/
    function list(
        IERC721 _contract,
        uint256 _tokenId,
        uint256 _price,
        SaleRecipient[] memory _recipients
    ) external nonReentrant {
        // Listing address must be owner or approved to manage this NFT.
        if (
            _contract.ownerOf(_tokenId) != msg.sender &&
            _contract.getApproved(_tokenId) != msg.sender &&
            !_contract.isApprovedForAll(_contract.ownerOf(_tokenId), msg.sender)
        ) revert Unapproved();

        // NFTMKT must be approved to manage this NFT.
        if (
            _contract.getApproved(_tokenId) != address(this) &&
            !_contract.isApprovedForAll(_contract.ownerOf(_tokenId), address(this))
        ) revert Unapproved();

        // There must be at least 1 recipient.
        if (_recipients.length <= 0) revert NoRecipients();

        // Add up all `SaleRecipeint.percent` allotments to make sure they sum to no more than 100%.
        uint256 saleRecipientsPercentTotal = 0;

        // Validate that recipients add up to no more than 100%.
        for (uint256 i = 0; i < _recipients.length; i++) {
            // Each recipient's percent must be greater than 0.
            if (_recipients[i].percent <= 0) revert RecipientPercentZero();

            // Add to the total percents.
            saleRecipientsPercentTotal = saleRecipientsPercentTotal + _recipients[i].percent;

            // The sum of percent values must not exceed 10000.
            if (saleRecipientsPercentTotal > 10000) revert PercentExceeded();

            // If projectId is not specified, the beneficiary must not be the zero address.
            if (_recipients[i].projectId == 0 && _recipients[i].beneficiary == address(0))
                revert BeneficiaryIsZero();

            // Add this recipient to the recipients list for this NFT listing.
            recipientsOf[msg.sender][_contract][_tokenId].push(_recipients[i]);
        }

        // Sum of sale recipients' distribution must equal 100%.
        if (saleRecipientsPercentTotal != 10000) revert PercentNot100();

        // Store the price
        // TODO Should we store price as prices[listingAddress][_contract][_tokenId] instead?
        // Consider: Address A lists the NFT, transfers to Address B, who has already given unlimited allowance for the same NFT contract to NFTMKT. Address A's listing price will still be active.
        prices[_contract][_tokenId] = _price;

        emit Listed(msg.sender, _contract, _tokenId, _recipients, _price);
    }

    /**
     * @notice Routes funds from purchase to the preconfigured recipients.
     * @dev If SalesRecipients points at a project, this function calls _terminal.pay(). If SaleRecipients points to an address, this function transfers ETH to that address directly.
     * Similar logic to https://github.com/jbx-protocol/juicehouse/blob/540f3037689ae74f2f97d95f9f28d88f69afd4a3/packages/hardhat/contracts/TerminalV1.sol#L1015
     */
    function purchase(
        IERC721 _contract,
        uint256 _tokenId,
        address _owner
    ) external payable nonReentrant {
        // The amount of ETH sent must match the price of the listed NFT.
        if (prices[_contract][_tokenId] != msg.value) revert WrongPrice();

        // Get a reference to the sale recipients for this NFT.
        SaleRecipient[] memory _recipients = recipientsOf[_owner][_contract][_tokenId];

        // There must be recipients.
        if (_recipients.length <= 0) revert NoRecipients();

        // TODO Consider holding ETH and executing payout distribution upon `distribute` external call.
        // TODO `distributeAll`

        // Distribute ETH to all recipients.
        for (uint256 i = 0; i < _recipients.length; i++) {
            // Get a reference to the recipient being iterated on.
            SaleRecipient memory _recipient = _recipients[i];

            // The amount to send to recipients. Recipients percents are out of 10000.
            uint256 _recipientCut = PRBMath.mulDiv(msg.value, _recipient.percent, 10000);

            // If the recipient is owed
            if (_recipientCut > 0) {
                // And the recipient is a project
                if (_recipient.projectId > 0) {
                    // Get a reference to the Juicebox terminal being used.
                    ITerminal _terminal = terminalDirectory.terminalOf(_recipient.projectId);
                    // Project must have a terminal.
                    if (_terminal == ITerminal(address(0))) revert TerminalNotFound();
                    // Pay the terminal what this recipient is owed.
                    _terminal.pay{value: _recipientCut}(
                        _recipient.projectId,
                        // If no beneficiary is specified, send the tokens to the msg.sender.
                        _recipient.beneficiary == address(0) ? msg.sender : _recipient.beneficiary,
                        _recipient.memo,
                        _recipient.preferUnstaked
                    );
                } else {
                    // Otherwise, send the funds directly to the beneficiary.
                    Address.sendValue(_recipient.beneficiary, _recipientCut);
                }
            }
        }
        // TODO Consider adding destination parameter to a `purchaseFor` method
        // Transfer NFT to buyer
        _contract.safeTransferFrom(address(this), msg.sender, _tokenId);

        // Delete the recipients.
        delete recipientsOf[_owner][_contract][_tokenId];

        emit Purchased(address(this), msg.sender, _contract, _tokenId, msg.value);
    }

    /**
     * @notice Cancels NFT listing on NFTMKT. Can only be called on an NFT by the address that listed it.
     */
    function delist(IERC721 _contract, uint256 _tokenId) external nonReentrant {
        // Caller must have listed the NFT
        if (recipientsOf[msg.sender][_contract][_tokenId].length <= 0) revert Unapproved();

        // NFTMKT must be approved to manage this NFT,
        if (
            _contract.getApproved(_tokenId) != address(this) ||
            !_contract.isApprovedForAll(_contract.ownerOf(_tokenId), address(this))
        ) revert Unapproved();

        // Remove from recipientsOf
        delete recipientsOf[msg.sender][_contract][_tokenId];

        emit Delisted(msg.sender, _contract, _tokenId);
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
