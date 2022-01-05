import { expect } from 'chai';
import { ethers, waffle } from 'hardhat';
import { deployMockContract } from '@ethereum-waffle/mock-contract';

import rinkebyTerminalV1 from '@jbx-protocol/contracts/deployments/rinkeby/TerminalV1.json';

describe('List', () => {
    async function setup() {
        const [deployer, nftDeployer] = await ethers.getSigners();
        const mockTerminalV1 = await deployMockContract(deployer, rinkebyTerminalV1.abi);
        
        const nftMarketFactory = await ethers.getContractFactory('NFTMarket');
        const nftMarket = await nftMarketFactory.deploy(mockTerminalV1.address);
        
        const nftFactory = await ethers.getContractFactory('ERC721');
        const nft = await nftFactory.deploy('Name', 'NAME');
        
        return { deployer, nftDeployer, mockTerminalV1, nftMarket, nft };
    }

    it('should deploy the NFTMarket contract', async () => {
        const { deployer, nftDeployer, mockTerminalV1, nftMarket, nft } = await setup();
        await nft.safeMint(nftDeployer.address, 1);
        console.log(await nft.balanceOf(nftDeployer.address));
    });
});