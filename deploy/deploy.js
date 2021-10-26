// const { ethers } = require("ethers"); // Not necessary because vscode has a built-in version

async function main() {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const NFTMKT = await ethers.getContractFactory("NFTMKT");
    const nftmkt = await NFTMKT.deploy('0x0000000000000000000000000000000000000000');

    console.log('NFTMKT deployed to: ', nftmkt.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });