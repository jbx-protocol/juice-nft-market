import { expect } from 'chai';
import { ethers, waffle } from 'hardhat';
import { deployMockContract } from '@ethereum-waffle/mock-contract';

import rinkebyTerminalV1 from '@jbx-protocol/contracts/deployments/rinkeby/TerminalV1.json';
import ierc721 from '../build/IERC721.json';

describe('List', () => {
    async function setup() {
        const [deployer, nftDeployer] = await ethers.getSigners();
        const mockTerminalV1 = await deployMockContract(deployer, rinkebyTerminalV1.abi);
        const nftMarketFactory = await ethers.getContractFactory('NFTMarket');
        const nftMarket = await nftMarketFactory.deploy(mockTerminalV1.address);
        const nft = await deployMockContract(nftDeployer, ierc721.abi);
        return { deployer, nftDeployer, mockTerminalV1, nftMarket, nft };
    }

    it('should deploy the NFTMarket contract', async () => {
        const { deployer, nftDeployer, mockTerminalV1, nftMarket, nft } = await setup();
        await nft.safeTransferFrom(nftDeployer.address, deployer.address, 1);
    });
});