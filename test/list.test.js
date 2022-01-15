import { expect } from 'chai';
import { ethers, waffle, deployments } from 'hardhat';
import { deployMockContract } from '@ethereum-waffle/mock-contract';

import rinkebyTerminalV1 from '@jbx-protocol/contracts/deployments/rinkeby/TerminalV1.json';
import { isConstructorDeclaration } from 'typescript';


describe('List', () => {
    async function setup() {
        //Get named addresses
        const [deployer, nftDeployer] = await ethers.getSigners();

        // Deploy nftMarket. `deployer` is the deployer/owner
        const mockTerminalV1 = await deployMockContract(deployer, rinkebyTerminalV1.abi);
        const nftMarketFactory = await ethers.getContractFactory('NFTMarket');
        const nftMarket = await nftMarketFactory.deploy(mockTerminalV1.address);

        // Deploy ERC721. `nftDeployer` is the deployer/owner.
        const nftFactory = await ethers.getContractFactory('ERC721', nftDeployer);
        const nft = await nftFactory.deploy('Name', 'NAME');

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

    it('Should succeed if listed by owner', async () => {
        const { deployer, nftDeployer, nftMarket, nft } = await setup();
        await expect(nftMarket.connect(nftDeployer).list(nft.address, 1, 1, makeSaleReceipientArray(10000, deployer.address, 1))).to.not.be.reverted;
    })

    it('Should succeed if listed by address approved for token', async () => {
        const { deployer, nftDeployer, nftMarket, nft } = await setup();
        await nft.connect(nftDeployer).approve(nftMarket.address, 1); // approve nftMarket
        await expect(nftMarket.list(nft.address, 1, 1, makeSaleReceipientArray(10000, deployer.address, 1))).to.not.be.reverted;
    })

    it('Should succeed if listed by address approved for all tokens', async () => {
        const { deployer, nftDeployer, nftMarket, nft } = await setup();
        await nft.connect(nftDeployer).setApprovalForAll(nftMarket.address, 1); // approve nftMarket
        await expect(nftMarket.connect(nftDeployer).list(nft.address, 1, 1, makeSaleReceipientArray(10000, deployer.address, 1))).to.not.be.reverted;
    })

    // it('Should fail if token does not belong to listing address', async () => {
    //     const { deployer, nftDeployer, nftMarket, nft } = await setup();
    //     // expect(await nftMarket.list(nft.address, 1, 1, makeSaleReceipientArray(10000, deployer.address, 1))).to.be.revertedWith('Unapproved()');
    // });

    // it('Should fail if token allowance is not set.', async () => {
    //     const { deployer, nftDeployer, nftMarket, nft } = await setup();

    // });
});