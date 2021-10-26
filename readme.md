# 🛒 NFT Market

## Description 
NFT Market is a NFT marketplace designed for Juicebox Projects.

## Installation
- `git clone https://github.com/jbx-protocol/juice-nft-market.git`.
- Call `pnpm i`.
- Fill in fields in `.example.env`. Save and rename the file `.env`.
<!-- - Call `hh deploy --network NETWORK_NAME` where NETWORK_NAME is the network of your choice (e.g., mainnet, rinkeby) -->

## Objectives
- Allow people to post and sell products/art that route proceeds to various preprogrammed addresses and juicebox project treasuries.
- Allow people to route treasury tokens that are minted from sales directed to a project’s treasury to preconfigured addresses.
- Allow a project to feature the products/artwork in the market that are configured to route sales to its treasury.

## User Journeys
- Sage Kellyn from WAGMI Studios wants to mint NFTs for the artwork/memerobilia she’s creating for JuiceboxDAO and SharkDAO. She wants to preconfigure it so that X% of sales goes to the WAGMI Studios treasury, Y% goes to the JuiceboxDAO treasury, and Z% goes to the SharkDAO treasury. Each of these projects in turn want to promote these peices in their respective galleries. Sage wants to make sure that A% of the freshly minted SHARK tokens resulting from the payment to its treasury gets allocated to the buyer and B% gets allocated to herself.
- GreenGiant wants to mint Noun derivatives for SharkDAO. He wants to keep X% of sales for himself, and send Y% of sales to the SharkDAO treasury. He wants to keep the resulting SHARK tokens.
- Art the artist wants to mint an NFT for a beautiful tree he drew. He wants to preconfigure it such that X% of sales go to his treasury, and Y% go to a beneficiary address belonging to a conservation fund. All resulting ART tokens should go to the buyer.

## Architecture
- submitToJBXNFTMKT => transferd ownership of 721 to contract
- removeFromJBXNFTMKT => transferd ownership of 721 from contract back to original owner
- purchase => verifies the 721 is owned by the MKT, receives funds, routes funds to preprogrammed destinations, routes resulting treasury tokens to preprogrammed destinations, transfers 721 to buyer.







# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
