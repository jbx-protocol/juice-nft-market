/**
 * Deploys the Juice NFT Market contract.
 *
 * Example usage:
 *
 * pnpm hardhat deploy --network rinkeby
 *
 * TODO: Find a solution for local chain.
 */

const rinkebyTerminalV1 = require(`@jbx-protocol/contracts/deployments/rinkeby/TerminalV1.json`);

const getTerminalV1Address = (chainId) => {
    if (chainId == 4) {
        return rinkebyTerminalV1.address;
    }

    throw Error(`Chain ID ${chainId} is not yet supported.`);
};

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = await getChainId();

    const terminalV1Address = getTerminalV1Address(chainId);
    console.log(
        `Deploying Juice NFT Market with Chain ID {${chainId}} and TerminalV1 address ${terminalV1Address}`,
    );

    await deploy('NFTMarket', {
        from: deployer,
        args: [terminalV1Address],
        log: true,
        skipIfAlreadyDeployed: true,
    });
};
