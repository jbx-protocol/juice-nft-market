import { expect } from 'chai';
import { ethers, waffle } from 'hardhat';
import { deployMockContract } from '@ethereum-waffle/mock-contract';

import rinkebyTerminalV1 from '@jbx-protocol/contracts/deployments/rinkeby/TerminalV1.json';
import IERC721 from '../build/IERC721.json';

describe('List', () => {
    async function setup() {
        const [deployer, mockDeployer] = await ethers.getSigners();
        const mockTerminalV1 = await deployMockContract(deployer, rinkebyTerminalV1.abi);
        const nftMarketFactory = await ethers.getContractFactory('NFTMarket');
        const nftMarket = await nftMarketFactory.deploy(mockTerminalV1.address);
        return { deployer, mockTerminalV1, nftMarket };
    }

    it('should revert if no allowance is set for the nftmarket', async () => {
        const { deployer, mockTerminalV1, nftMarket } = await setup();
    });
});