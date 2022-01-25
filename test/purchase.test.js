import { expect } from 'chai';
import { ethers, waffle, deployments } from 'hardhat';
import { deployMockContract } from '@ethereum-waffle/mock-contract';

import rinkebyTerminalV1 from '@jbx-protocol/contracts/deployments/rinkeby/TerminalV1.json';
import rinkebyTerminalDirectory from '@jbx-protocol/contracts/deployments/rinkeby/TerminalDirectory.json'
import { isConstructorDeclaration } from 'typescript';


describe('Purchase', () => {
    //Default values
    const PROJECT_ID = 1;
    const TOKEN_ID = 1;
    const BENEFICIARY = ethers.Wallet.createRandom().address;
    const PREFER_CLAIMED_TOKENS = false;
    const MEMO = 'memo';
    const AMOUNT = ethers.utils.parseEther('1.0');

    async function setup() {
        //Get named addresses
        const [deployer, nftDeployer] = await ethers.getSigners();

        // Deploy nftMarket. `deployer` is the deployer/owner
        const mockTerminalV1 = await deployMockContract(deployer, rinkebyTerminalV1.abi);
        const mockTerminalDirectory = await deployMockContract(deployer, rinkebyTerminalDirectory.abi);
        await mockTerminalDirectory.mock.terminalOf
            .withArgs(PROJECT_ID)
            .returns(mockTerminalV1.address);

        await mockTerminalV1.mock.pay
            .withArgs(PROJECT_ID, BENEFICIARY, MEMO, PREFER_CLAIMED_TOKENS)
            .returns();

        const nftMarketFactory = await ethers.getContractFactory('NFTMarket');
        const nftMarket = await nftMarketFactory.deploy(mockTerminalV1.address)

        // Deploy ERC721. `nftDeployer` is the deployer/owner.
        const nftFactory = await ethers.getContractFactory('ERC721', nftDeployer);
        const nft = await nftFactory.deploy('Name', 'NAME') //as nftFactory;

        // Mint NFT
        await nft.safeMint(nftDeployer.address, TOKEN_ID);

        // List NFT
        await nft.connect(nftDeployer).setApprovalForAll(nftMarket.address, true);
        await nftMarket.connect(nftDeployer).list(nft.address, TOKEN_ID, AMOUNT, makeSaleReceipientArray(10000, BENEFICIARY, PROJECT_ID));

        return { deployer, nftDeployer, mockTerminalV1, nftMarket, nft };
    }

    function makeSaleReceipientArray(_percent, _beneficiary, _projectId) {
        return [
            {
                preferUnstaked: PREFER_CLAIMED_TOKENS,
                percent: _percent,
                beneficiary: _beneficiary,
                memo: MEMO,
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

    it('Should succeed if purchased with correct funds', async () => {
        const { deployer, nftDeployer, nftMarket, nft } = await setup();
        await nftMarket.purchase(nft.address, 1, nftDeployer.address, { value: AMOUNT });
        // await expect(nftMarket.purchase(nft.address, 1, nftDeployer.address, { value: AMOUNT })).to.not.be.reverted;
    });
});