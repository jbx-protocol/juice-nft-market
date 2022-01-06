import { expect } from 'chai';
import { ethers, waffle } from 'hardhat';
import { deployMockContract } from '@ethereum-waffle/mock-contract';

import rinkebyTerminalV1 from '@jbx-protocol/contracts/deployments/rinkeby/TerminalV1.json';

describe('List', () => {
    async function setup() {
        //
        const [deployer, nftDeployer] = await ethers.getSigners();

        // Deploy nftMarket. `deployer` is the deployer/owner
        const mockTerminalV1 = await deployMockContract(deployer, rinkebyTerminalV1.abi);
        const nftMarketFactory = await ethers.getContractFactory('NFTMarket');
        const nftMarket = await nftMarketFactory.deploy(mockTerminalV1.address);

        // Deploy ERC721. `nftDeployer` is the deployer/owner.
        const nftFactory = await ethers.getContractFactory('ERC721', nftDeployer);
        const nft = await nftFactory.deploy('Name', 'NAME');

        // Mint NFT from nftDeployer to nftDeployer
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

    it('Should fail if token does not belong to listing address.', async () => {
        const { deployer, nftDeployer, nftMarket, nft } = await setup();
        await nftMarket.list(ethers.constants.AddressZero, 1, 1, makeSaleReceipientArray(100, deployer.address, 1));
        // expect(await nftMarket.list(nft.address, 1, ethers.utils.parseEther(1), recipient)).to.be.revertedWith('Unapproved');
    });

    it('Should fail if token allowance is not set.', async () => {
        const { deployer, nftDeployer, nftMarket, nft } = await setup();

    });
});