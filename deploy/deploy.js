/**
 * Deploys the Juice NFT Market contract.
 *
 * Example usage:
 *
 * pnpm hardhat deploy --network rinkeby
 *
 * TODO: Find a solution for local chain.
 */

const rinkebyJBDirectory = require(`@jbx-protocol/contracts/deployments/rinkeby/JBDirectory.json`);

const getJBDirectoryAddress = (chainId) => {
    if (chainId == 4) {
        return rinkebyJBDirectory.address;
    }

    throw Error(`Chain ID ${chainId} is not yet supported.`);
};

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = await getChainId();

    const jbDirectoryAddress = getJBDirectoryAddress(chainId);
    console.log(
        `Deploying Juice NFT Market with Chain ID {${chainId}} and JBDirectory address ${jbDirectoryAddress}`,
    );

    await deploy('NFTMarket', {
        from: deployer,
        args: [jbDirectoryAddress],
        log: true,
        skipIfAlreadyDeployed: true,
    });
};
