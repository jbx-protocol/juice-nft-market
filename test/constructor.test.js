import { expect } from 'chai';
import { ethers, waffle } from 'hardhat';
// const { deployContract } = waffle; //don't need
import { deployMockContract } from '@ethereum-waffle/mock-contract';

import rinkebyTerminalV1 from '@jbx-protocol/contracts/deployments/rinkeby/TerminalV1.json';


describe('Constructor', () => {
    async function setup() {
        const [deployer, mockDeployer] = await ethers.getSigners();
        const mockTerminalV1 = await deployMockContract(deployer, rinkebyTerminalV1.abi);
        const nftMarketFactory = await ethers.getContractFactory('NFTMarket');
        const nftMarket = await nftMarketFactory.deploy(mockTerminalV1.address);
        return { deployer, mockTerminalV1, nftMarket };
    }

    it('should deploy the NFTMarket contract', async () => {
        const { deployer, mockTerminalV1, nftMarket } = await setup();
        expect(await nftMarket.terminalDirectory()).to.equal(mockTerminalV1.address);
    });
});

