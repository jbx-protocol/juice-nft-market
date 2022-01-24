import { expect } from 'chai';
import { ethers, waffle, deployments } from 'hardhat';
import { deployMockContract } from '@ethereum-waffle/mock-contract';

import rinkebyTerminalV1 from '@jbx-protocol/contracts/deployments/rinkeby/TerminalV1.json';
import { isConstructorDeclaration } from 'typescript';


describe('Purchase', () => {
    async function setup() {
        //Get named addresses
        const [deployer, nftDeployer] = await ethers.getSigners();

        // Deploy nftMarket. `deployer` is the deployer/owner
        const mockTerminalV1 = await deployMockContract(deployer, rinkebyTerminalV1.abi);
        // tktktk
        // need to mock terminalDirectory? nftmarket.sol line 226
        // await mockTerminalV1.mock.["terminalOf"]
        //     .withArgs(1)
        //     .returns();

        const nftMarketFactory = await ethers.getContractFactory('NFTMarket');
        const nftMarket = await nftMarketFactory.deploy(mockTerminalV1.address) // as nftMarketFactory;

        // Deploy ERC721. `nftDeployer` is the deployer/owner.
        const nftFactory = await ethers.getContractFactory('ERC721', nftDeployer);
        const nft = await nftFactory.deploy('Name', 'NAME') //as nftFactory;

        // Mint NFT
        await nft.safeMint(nftDeployer.address, 1);

        // List NFT
        await nft.connect(nftDeployer).setApprovalForAll(nftMarket.address, true);
        await nftMarket.connect(nftDeployer).list(nft.address, 1, 1, makeSaleReceipientArray(10000, deployer.address, 1));

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


    it('Should revert if purchased with no funds', async () => {
        const { deployer, nftDeployer, nftMarket, nft } = await setup();
        await expect(nftMarket.purchase(nft.address, 1, nftDeployer.address)).to.be.revertedWith("IncorrectAmount()");
    });

    it('Should revert if purchased with excess funds', async () => {
        const { deployer, nftDeployer, nftMarket, nft } = await setup();
        await expect(nftMarket.purchase(nft.address, 1, nftDeployer.address, { value: 2 })).to.be.revertedWith("IncorrectAmount()");
    });

    // it('Should succeed if purchased with correct funds', async () => {
    //     const { deployer, nftDeployer, nftMarket, nft } = await setup();
    //     await expect(nftMarket.purchase(nft.address, 1, nftDeployer.address, { value: 1 })).to.not.be.reverted;
    // });
});