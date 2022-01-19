import { expect } from 'chai';
import { ethers, waffle, deployments } from 'hardhat';
import { deployMockContract } from '@ethereum-waffle/mock-contract';

import rinkebyTerminalV1 from '@jbx-protocol/contracts/deployments/rinkeby/TerminalV1.json';
import { isConstructorDeclaration } from 'typescript';


describe('Delist', () => {
    async function setup() {
        //Get named addresses
        const [deployer, nftDeployer, ...unnamedAddresses] = await ethers.getSigners();

        // Deploy nftMarket. `deployer` is the deployer/owner
        const mockTerminalV1 = await deployMockContract(deployer, rinkebyTerminalV1.abi);
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

        return { deployer, nftDeployer, unnamedAddresses, mockTerminalV1, nftMarket, nft };
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

    function makeSaleReceipientArrayWithTen(unnamedAddresses) {
        let array = []
        for (let i = 0; i < 10; i++) {
            let saleRecipient = {
                preferUnstaked: false,
                percent: 10000 / 10,
                beneficiary: unnamedAddresses[i].address,
                memo: '',
                projectId: 1,
            }
            array.push(saleRecipient)
        }
        return array;
    };


    it('Should revert if the caller did not list the NFT', async () => {
        const { deployer, nftDeployer, nftMarket, nft } = await setup();
        await nft.connect(nftDeployer).approve(nftMarket.address, 1);
        await nftMarket.connect(nftDeployer).list(nft.address, 1, 1, makeSaleReceipientArray(10000, ethers.constants.AddressZero, 1));
        await expect(nftMarket.delist(nft.address, 1)).to.be.revertedWith("Unapproved()");
    });

    it('Should revert if the NFTMarket is unapproved, even if the NFT is listed', async () => {
        const { deployer, nftDeployer, nftMarket, nft } = await setup();
        await nft.connect(nftDeployer).approve(nftMarket.address, 1);
        await nftMarket.connect(nftDeployer).list(nft.address, 1, 1, makeSaleReceipientArray(10000, ethers.constants.AddressZero, 1));
        await nft.connect(nftDeployer).approve(ethers.constants.AddressZero, 1); // remove approval
        await expect(nftMarket.delist(nft.address, 1)).to.be.revertedWith("Unapproved()");
    });

    it('Should succeed if the caller listed the NFT', async () => {
        const { deployer, nftDeployer, nftMarket, nft } = await setup();
        await nft.connect(nftDeployer).approve(nftMarket.address, 1);
        await nftMarket.connect(nftDeployer).list(nft.address, 1, 1, makeSaleReceipientArray(10000, ethers.constants.AddressZero, 1));
        await expect(nftMarket.connect(nftDeployer).delist(nft.address, 1)).to.not.be.reverted;
    });


    it('Should succeed with ten saleRecipients', async () => {
        const { deployer, nftDeployer, unnamedAddresses, nftMarket, nft } = await setup();
        await nft.connect(nftDeployer).approve(nftMarket.address, 1);
        await expect(nftMarket.connect(nftDeployer).list(nft.address, 1, 1, makeSaleReceipientArrayWithTen(unnamedAddresses))).to.not.be.reverted;
    })

    // it('Should revert if the caller did not list the NFT', async () => {
    //     const { deployer, nftDeployer, nftMarket, nft } = await setup();
    //     await nft.connect(nftDeployer).approve(nftMarket.address, 1);
    //     await nftMarket.connect(nftDeployer).list(nft.address, 1, 1, makeSaleReceipientArray(10000, ethers.constants.AddressZero, 1));
    //     await expect(nftMarket.connect(nftDeployer).delist(nft.address, 1)).to.be.revertedWith('Unapproved()');
    // })
});