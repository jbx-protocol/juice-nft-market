import { expect } from 'chai';
import { ethers, waffle } from 'hardhat';
const { deployContract } = waffle;
import { deployMockContract } from '@ethereum-waffle/mock-contract';

import rinkebyTerminalV1 from '@jbx-protocol/contracts/deployments/rinkeby/TerminalV1.json';


describe('Constructor', () => {
    async function setup() {
        const [deployer, mockDeployer] = await ethers.getSigners();
        const mockTerminalV1 = await deployMockContract(mockDeployer, rinkebyTerminalV1.abi); // deploy mock TerminalV1
        const nftMarket = await deployContract('NFTMarket', [mockTerminalV1.address]); // deploy NFTMarket
        return { deployer, mockTerminalV1, nftMarket };
    }

    it('should deploy the NFTMarket contract', async () => {
        const { deployer, mockTerminalV1, nftMarket } = await setup();
        expect(nftMarket.terminalDirectory).to.equal(mockTerminalV1.address);
    });
});

