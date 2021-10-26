//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "hardhat/console.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@jbox/sol/contracts/interfaces/ITerminalDirectory.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@paulrberg/contracts/math/PRBMath.sol";

struct SaleRecipient {
    bool preferUnstaked;
    uint16 percent;
    address payable beneficiary;
    string memo;
    uint256 projectId;
}

/**
 * @title NFTMKT
 * @author @nnnnicholas & @mejango
 * @notice An NFT marketplace built for Juicebox projects.
 * @dev Accepts ERC721 only.
 */
contract NFTMKT is IERC721Receiver {
    /**
    @dev The direct deposit terminals.
    */
    ITerminalDirectory public immutable terminalDirectory;

    // TODO: Reuse the same SaleRecipient by using hashes of SaleRecipient as keys in a mapping instead
    // All sale recipients for each project ID's configurations.

    /**
     *  address Address listing the NFT
     *  IERC721 Contract address
     *  uint TokenID
     *  An array of SaleRecipients.
     */
    mapping(address => mapping(IERC721 => mapping(uint256 => SaleRecipient[])))
        public recipientsOf;

    /**
     * @notice Stores each NFT's price
     * IERC721 contract address
     * tokenId
     * price in wei
     */
    //TODO Consider modularizing pricing strategies to support auctions, FOMO ramps, pricing tranches
    mapping(IERC721 => mapping(uint256 => uint256)) public prices;

    /**
     * @notice Emitted when an NFT is successfully listed on NFTMKT.
     * @param _from The address that listed the NFT.
     * @param _contract The NFT's contract address.
     * @param _tokenId The NFT's tokenId.
     */
    event Listed(
        address indexed _from,
        IERC721 indexed _contract,
        uint256 indexed _tokenId,
        SaleRecipient[] _recipients
    );
    /**
     * @notice Emitted when an NFT is successfully delist from NFTMKT.
     * @param _to The address that listed the NFT.
     * @param _contract The NFT's contract address.
     * @param _tokenId The NFT's tokenId.
     */
    event Delisted(
        address indexed _to,
        IERC721 indexed _contract,
        uint256 indexed _tokenId
    );

    /**
     * @notice Emitted when an NFT is successfully purchased from NFTMKT.
     * @param _from The address that listed the NFT.
     * @param _to The address that purchased the NFT.
     * @param _contract The NFT's contract address.
     * @param _tokenId The NFT's tokenId.
     */
    event Purchased(
        address _from,
        address indexed _to,
        IERC721 indexed _contract,
        uint256 indexed _tokenId
    );

    /**
     * @notice Creates an instance of NFTMKT. Anyone can permissionlesly list their NFTs on this NFTMKT instance.
     * @dev Frontends can filter listed NFTs for those relevant to a specific project, or listed by a particular address.
     * @param _terminalDirectory A directory of a project's current Juicebox terminal to receive payments in.
     */
    constructor(ITerminalDirectory _terminalDirectory) {
        terminalDirectory = _terminalDirectory;
    }

    /**
     * @notice List NFT in the NFTMKT and define who will receive project tokens resulting from a sale.
     * @dev Must call `approve` on the 721 contract before calling `list` on NFTMKT
     * @dev `SaleReceipients` are validated to add up to no more than 100%.
     * @param _contract The contract that issued the listed NFT.
     * @param _tokenId The tokenId of the listed NFT.
     * @param _recipients An array of `SaleRecipient` that will receive project tokens issued in response to a sale.
     **/
    function list(
        IERC721 _contract,
        uint256 _tokenId,
        uint256 _price,
        SaleRecipient[] memory _recipients // TODO @jango calldata?
    ) external {
        require(
            _contract.getApproved(_tokenId) == address(this) ||
                _contract.isApprovedForAll(
                    _contract.ownerOf(_tokenId),
                    address(this)
                ), // TODO is this OR ok?
            "NFTMKT::list: NOT_APPROVED"
        );

        // Must be at least 1 recipient.
        require(_recipients.length > 0, "NFTMKT::list: NO_RECIP"); //TODO Verify new error is ok. Old error: "ModStore::setPayoutMods: NO_OP"

        // Add up all `SaleRecipeint.percent` alottments to make sure they sum to no more than 100%.
        uint256 saleRecipientsPercentTotal = 0;

        // Validate that recipients add up to no more than 100%.
        for (uint256 i = 0; i < _recipients.length; i++) {
            // The percent should be greater than 0.
            require(
                _recipients[i].percent > 0,
                "NFTMKT::list: RECIPS_PERCENT_0"
            );

            // Add to the total percents.
            saleRecipientsPercentTotal =
                saleRecipientsPercentTotal +
                _recipients[i].percent;

            // The total percent should be less than 10000.
            require(
                saleRecipientsPercentTotal <= 10000,
                "NFTMKT::list: RECIPS_PERCENT_EXCEEDS"
            );

            // The beneficiary shouldn't be the zero address.
            // TODO @jango I suppose this is something we want to restrict in terminalv1 but in terminalv2 it would be ok? i'm thinking we could remove this require.
            require(
                _recipients[i].beneficiary != address(0),
                "NFTMKT::list: BENEF_IS_0."
            );
        }

        // If total sale recipients distribution is equal to 100%.
        //TODO @jango any reason to accept a <100% SaleRecipients distribution?
        require(saleRecipientsPercentTotal == 10000);

        for (uint256 i = 0; i < _recipients.length - 1; i++) {
            // Set the recipients for this NFT listing to the passed `_recipients`.
            recipientsOf[msg.sender][_contract][_tokenId].push(_recipients[i]);
        }

        // Store the price
        prices[_contract][_tokenId] = _price;

        // Transfer ownership of NFT to to the contract
        _contract.safeTransferFrom(msg.sender, address(this), _tokenId);
        emit Listed(msg.sender, _contract, _tokenId, _recipients);
    }

    /**
     *
     */
    function purchase(IERC721 _contract, uint256 _tokenId) external payable {
        // TODO add reentrancy guard
        // must route funds received from buyer to the preconfigured recipients. Logic for this can be very similar to the _distributeToPayoutMods
        // see https://github.com/jbx-protocol/juicehouse/blob/540f3037689ae74f2f97d95f9f28d88f69afd4a3/packages/hardhat/contracts/TerminalV1.sol#L1015
        // If SalesRecipients points at a project, call _terminal.pay(), if it pays out to an address, just transfer directly

        address owner;

        require(prices[_contract][_tokenId] == msg.value, "Incorrect "); // TODO `prices[][] <= msg.value` instead?

        // Get a reference to the sale recipients for this NFT.
        SaleRecipient[] memory _recipients = recipientsOf[owner][_contract][
            _tokenId
        ];

        // TODO Consider holding ETH and executing payout distribution upon `distribute` external call.
        // TODO `distributeAll`

        // Distribute ETH to all recipients.
        for (uint256 i = 0; i < _recipients.length; i++) {
            // Get a reference to the recipient being iterated on.
            SaleRecipient memory _recipient = _recipients[i];

            // The amount to send to recipients. Recipients percents are out of 10000.
            uint256 _recipientCut = PRBMath.mulDiv(
                msg.value,
                _recipient.percent,
                10000
            );

            // If the recipient is owed
            if (_recipientCut > 0) {
                // And the recipient is a project
                if (_recipient.projectId > 0) {
                    // Get a reference to the Juicebox terminal being used.
                    ITerminal _terminal = terminalDirectory.terminalOf(
                        _recipient.projectId
                    );
                    // If the project has a terminal
                    require(
                        _terminal != ITerminal(address(0)),
                        "Terminal::pay: TERM_0"
                    );
                    // Pay the terminal what this recipient is owed.
                    _terminal.pay{value: _recipientCut}(
                        _recipient.projectId,
                        _recipient.beneficiary,
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
        emit Purchased(address(this), msg.sender, _contract, _tokenId);
    }

    /**
     * @notice Cancels NFT listing on NFTMKT. Can only be called on an NFT by the address that listed it.
     */
    function delist(
        IERC721 _contract,
        uint256 _tokenId
    ) external {
        // Check that this contract is approved to move the NFT
        // TODO consider if we need this require. perhaps what matters more is that the calling address is approved, rather than the NFTMKT?
        require(
            _contract.getApproved(_tokenId) == address(this) ||
                _contract.isApprovedForAll(
                    _contract.ownerOf(_tokenId),
                    address(this)
                ),
            "NFTMKT::delist: NOT_APPROVED"
        );

        // Check that caller listed the NFT
        //TODO I wonder if the owner of the NFT should also be able to delist. Imagine I approve nftmkt, list for 1 wei, then sell to you on opensea, then buy it back on nftmkt (contract still has nft approval)
        //TODO or alternately the NFT cannot be sold via nftmkt if it is currently held by an address OTHER than the address that listed it.  this may harm composability but is intuitively correct. This change would be in purchase, not here.
        require(recipientsOf[msg.sender][_contract][_tokenId].length > 0);

        // Remove from recipientsOf
        // recipientsOf[msg.sender][_contract][_tokenId] = SaleRecipient[];

        //TODO Maybe remove price from prices

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
