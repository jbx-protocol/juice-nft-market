import { expect } from 'chai';
import { ethers, waffle, deployments } from 'hardhat';
import { deployMockContract } from '@ethereum-waffle/mock-contract';

import rinkebyTerminalV1 from '@jbx-protocol/contracts/deployments/rinkeby/TerminalV1.json';
import { isConstructorDeclaration, OperationCanceledException } from 'typescript';


describe('List', () => {
    async function setup() {
        //Get named addresses
        const [deployer, nftDeployer] = await ethers.getSigners();

        // Deploy nftMarket. `deployer` is the deployer/owner
        const mockTerminalV1 = await deployMockContract(deployer, rinkebyTerminalV1.abi);
        const nftMarketFactory = await ethers.getContractFactory('NFTMarket');
        const nftMarket = await nftMarketFactory.deploy(mockTerminalV1.address) // as nftMarketFactory;

        // Deploy ERC721. `nftDeployer` is the deployer/owner.
        const nftFactory = await ethers.getContractFactory('ERC721', nftDeployer);
        const nft = await nftFactory.deploy('Name', 'NAME') //as nftFactory;

        // Mint NFT
        await nft.safeMint(nftDeployer.address, 1);
        return { deployer, nftDeployer, mockTerminalV1, nftMarket, nft };
    }

    function makeSaleReceipientArray(_percent, _beneficiary, _projectId) {
        return [
            {
                preferUnstaked: false,
                percent: _percent,
                beneficiary: _beneficiary,
                memo: '',
                projectId: _projectId,
            }
        ]
    };

    it('Should succeed if listed by owner and Market IS approved', async () => {
        const { deployer, nftDeployer, nftMarket, nft } = await setup();
        await nft.connect(nftDeployer).approve(nftMarket.address, 1);
        await expect(nftMarket.connect(nftDeployer).list(nft.address, 1, 1, makeSaleReceipientArray(10000, deployer.address, 1))).to.not.be.reverted;
    });

    it('Should succeed if listed by owner and Market IS approved for all', async () => {
        const { deployer, nftDeployer, nftMarket, nft } = await setup();
        await nft.connect(nftDeployer).setApprovalForAll(nftMarket.address, true);
        await expect(nftMarket.connect(nftDeployer).list(nft.address, 1, 1, makeSaleReceipientArray(10000, deployer.address, 1))).to.not.be.reverted;
    });

    it('Should revert if listed by owner and Market is NOT approved', async () => {
        const { deployer, nftDeployer, nftMarket, nft } = await setup();
        await expect(nftMarket.connect(nftDeployer).list(nft.address, 1, 1, makeSaleReceipientArray(10000, deployer.address, 1))).to.be.revertedWith('Unapproved()');
    })

    it("Should revert if listed by unapproved non-owner and Market IS approved", async () => {
        const { deployer, nftDeployer, nftMarket, nft } = await setup();
        await nft.connect(nftDeployer).approve(nftMarket.address, 1);
        await nft.connect(nftDeployer).setApprovalForAll(nftMarket.address, true);
        await expect(nftMarket.list(nft.address, 1, 1, makeSaleReceipientArray(10000, deployer.address, 1))).to.be.revertedWith('Unapproved()');
    })

    it("Should revert if listed by unapproved non-owner and Market is NOT approved", async () => {
        const { deployer, nftDeployer, nftMarket, nft } = await setup();
        await expect(nftMarket.list(nft.address, 1, 1, makeSaleReceipientArray(10000, deployer.address, 1))).to.be.revertedWith('Unapproved()');
    })

    // TODO Do we think this is a good idea?
    it('Should succeed if listed by an approved address and Market IS approved for all', async () => {
        const { deployer, nftDeployer, nftMarket, nft } = await setup();
        await nft.connect(nftDeployer).approve(deployer.address, 1);
        await nft.connect(nftDeployer).setApprovalForAll(nftMarket.address, true);
        await expect(nftMarket.list(nft.address, 1, 1, makeSaleReceipientArray(10000, deployer.address, 1))).to.not.be.reverted;
    })

    // TODO Do we think this is a good idea?
    it('Should succeed if listed by an address approved for all and Market IS approved', async () => {
        const { deployer, nftDeployer, nftMarket, nft } = await setup();
        await nft.connect(nftDeployer).approve(nftMarket.address, 1);
        await nft.connect(nftDeployer).setApprovalForAll(deployer.address, true);
        await expect(nftMarket.list(nft.address, 1, 1, makeSaleReceipientArray(10000, deployer.address, 1))).to.not.be.reverted;
    })

    it('Should revert if recipient percentage is 0', async () => {
        const { deployer, nftDeployer, nftMarket, nft } = await setup();
        await nft.connect(nftDeployer).approve(nftMarket.address, 1);
        await expect(nftMarket.connect(nftDeployer).list(nft.address, 1, 1, makeSaleReceipientArray(0, deployer.address, 1))).to.be.revertedWith('RecipientPercentZero()');
    })

    it('Should revert if sum of percentages exceeds 10000', async () => {
        const { deployer, nftDeployer, nftMarket, nft } = await setup();
        await nft.connect(nftDeployer).approve(nftMarket.address, 1);
        await expect(nftMarket.connect(nftDeployer).list(nft.address, 1, 1, makeSaleReceipientArray(10001, deployer.address, 1))).to.be.revertedWith('PercentExceeded()');
    })

    it('Should revert if sum of percentages is less than 10000', async () => {
        const { deployer, nftDeployer, nftMarket, nft } = await setup();
        await nft.connect(nftDeployer).approve(nftMarket.address, 1);
        await expect(nftMarket.connect(nftDeployer).list(nft.address, 1, 1, makeSaleReceipientArray(9999, deployer.address, 1))).to.be.revertedWith('PercentNot100()');
    })

    it('Should revert if benefiiary is the zero address and project 0 is specified', async () => {
        const { deployer, nftDeployer, nftMarket, nft } = await setup();
        await nft.connect(nftDeployer).approve(nftMarket.address, 1);
        await expect(nftMarket.connect(nftDeployer).list(nft.address, 1, 1, makeSaleReceipientArray(10000, ethers.constants.AddressZero, 0))).to.be.revertedWith('BeneficiaryIsZero()');
    })

    // TODO Do we think this is a good idea?
    it('Should succeed if benefiiary is the zero address and a project is specified', async () => {
        const { deployer, nftDeployer, nftMarket, nft } = await setup();
        await nft.connect(nftDeployer).approve(nftMarket.address, 1);
        await expect(nftMarket.connect(nftDeployer).list(nft.address, 1, 1, makeSaleReceipientArray(10000, ethers.constants.AddressZero, 1))).to.not.be.reverted;
    })




});