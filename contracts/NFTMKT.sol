//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "hardhat/console.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@jbox/sol/contracts/interfaces/ITerminalDirectory.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@paulrberg/contracts/math/PRBMath.sol";

struct SaleRecipients {
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
 * @dev Accepts ERC721.
 */
contract NFTMKT is IERC721Receiver {
    /**
    @dev The direct deposit terminals.
    */
    ITerminalDirectory public immutable terminalDirectory;

    // TODO: Reuse the same saleRecipients by using hashes of saleRecipients as keys in a mapping instead
    // All sale recipients for each project ID's configurations.

    /**
     * @param address Address submitting the NFT
     * @param address NFT 721 address
     * @param uint TokenID
     * @return An array of SaleRecipients.
     */
    mapping(address => mapping(address => mapping(uint256 => SaleRecipients[])))
        public recipientsOf;

    /**
     * @notice Stores each NFT's price
     * @return The price in wei
     */
    //TODO Consider modularizing pricing strategies to support auctions, FOMO ramps, pricing tranches
    mapping(address => mapping(address => uint256)) public prices;

    /**
     * @notice Emitted when an NFT is successfully submitted to NFTMKT.
     * @param _from The address that submitted the NFT.
     * @param _contract The NFT's contract address.
     * @param _tokenId The NFT's tokenId.
     */
    event Submitted(
        address indexed _from,
        address indexed _contract,
        address indexed _tokenId,
        SaleRecipients[] _recipients
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
     * @param terminalDirectory A directory of a project's current Juicebox terminal to receive payments in.
     */
    constructor(ITerminalDirectory _terminalDirectory) {
        terminalDirectory = _terminalDirectory;
    }

    /**
     * @notice Submit NFT to the NFTMKT and define who will receive project Project tokens resulting from a sale.
     * @dev Must call `approve` on the 721 contract before calling `submit` on NFTMKT
     * @dev `payoutMods` are validated to add up to no more than 100%.
     * @param _nft The NFT being submitted.
     * @param payoutMods The recipients that will receive project token payouts.
     **/
    function submit(
        IERC721 _contract,
        uint256 _tokenId,
        uint256 _price,
        SaleRecipients[] _recipients
    ) external {
        require(
            _contract.getApproved(_tokenId) == address(this),
            "NFTMKT::submit: NOT_APPROVED"
        );

        // Must be at least 1 recipient.
        require(
            _recipients.length > 0,
            "NFTMKT::submit: NO_RECIP"
        ); //TODO Verify new error is ok. Old error: "ModStore::setPayoutMods: NO_OP"

        // Add up all the percents to make sure they cumulative are under 100%.
        uint256 _saleRecipientsPercentTotal = 0;

        // Validate that recipients add up to no more than 100%.
        for (uint256 _i = 0; _i < _recipients.length; _i++) {
            // The percent should be greater than 0.
            require(
                _recipients[_i].percent > 0,
                "NFTMKT::submit: RECIPS_PERCENT_0"
            );

            // Add to the total percents.
            _saleRecipientsPercentTotal =
                _saleRecipientsPercentTotal +
                _recipients[_i].percent;

            // The total percent should be less than 10000.
            require(
                _saleRecipientsPercentTotal <= 10000,
                "NFTMKT::submit: RECIPS_PERCENT_EXCEEDS"
            );

            // The beneficiary shouldn't both be the zero address.
            require(
                _recipients[_i].beneficiary != address(0),
                "NFTMKT::submit: BENEF_IS_0."
            );
        }

        // All recipient's percents must total to 100%.
        require(_saleRecipientsPercentTotal == 10000);
        _recipientsOf[msg.sender][_contract][_tokenId] = _recipients;

        // Store the price
        prices[_contract][_tokenId] = _price;

        // Transfer ownership of NFT to to the contract
        _contract.safeTransferFrom(msg.sender, address(this), _tokenId);
        emit Submitted(msg.sender, _contract, _tokenId, _recipients);
    }

    /**
     *
     */
    function purchase(IERC721 _contract, uint256 _tokenId) external payable {
        // must route funds received from buyer to the preconfigured recipients. Logic for this can be very similar to the _distributeToPayoutMods
        // see https://github.com/jbx-protocol/juicehouse/blob/540f3037689ae74f2f97d95f9f28d88f69afd4a3/packages/hardhat/contracts/TerminalV1.sol#L1015
        // If SalesRecipients points at a project, call _terminal.pay(), if it pays out to an address, just transfer directly

        address owner;

        require(prices[_contract][_tokenId] == msg.value);

        // Get a reference to the project's payout recipients.
        SalesRecipients[] memory _recipients = _recipientsOf[owner][_contract][
            _tokenId
        ];
        // TODO Consider holding ETH and executing payout distribution upon `distribute` external call.
        // TODO `distributeAll`
        // Transfer between all recipients.
        for (uint256 _i = 0; _i < _recipients.length; _i++) {
            // Get a reference to the recipient being iterated on.
            SalesRecipients memory _recipient = _recipients[_i];

            // The amount to send to recipients. Recipients percents are out of 10000.
            uint256 _recipientCut = PRBMath.mulDiv(
                msg.value,
                _recipient.percent,
                10000
            );

            if (_recipientCut > 0) {
                // Transfer ETH to the recipient.

                if (_recipient.projectId > 0) {
                    // Otherwise, if a project is specified, make a payment to it.

                    // Get a reference to the Juicebox terminal being used.
                    ITerminal _terminal = terminalDirectory.terminalOf(
                        _recipient.projectId
                    );

                    // The project must have a terminal to send funds to.
                    require(
                        _terminal != ITerminal(address(0)),
                        "Terminal::pay: TERM_0"
                    );

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
        // TODO Consider adding destination parameter.
        // Transfer NFT to buyer
        _contract.safeTransferFrom(address(this), msg.sender, _tokenId);
        emit Purchased(address(this), msg.sender, _contract, _tokenId);
    }

    //TODO implement withdraw and withdrawTo that call _withdraw

    /**
     * @notice Withdraw NFT from marketplace. Can only be called on a given NFT by the address that submit it.
     * @dev
     * @param
     * @param
     */
    function withdraw(
        IERC721 _contract,
        uint256 _tokenId,
        address destination
    ) external {
        // Check that contract holds this token
        require(_contract.ownerOf(_tokenId) == address(this));

        // Check that caller submitted the NFT
        require(_recipientsOf[msg.sender][_contract][_tokenId].length > 0);

        // Remove from recipientsOf
        _recipientsOf[msg.sender][_contract][_tokenId] = [];

        //TODO Maybe remove price from prices

        // Transfer NFT from contract to caller.
        _contract.safeTransferFrom(address(this), _destination, tokenId);
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
