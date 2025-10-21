# Smart Contracts Deployment

This section details the process of deploying the smart contracts to a blockchain network. We use Foundry for contract deployment.

## Prerequisites

Before deploying the contracts, ensure you have:

1. **Foundry** installed ([installation guide](https://book.getfoundry.sh/getting-started/installation))
2. **Node.js** and **pnpm** installed
3. Access to a blockchain network (local Anvil, testnet, or mainnet)
4. Sufficient funds in your deployer wallet for gas fees

## Deployment Process

### 1. Local Development Deployment

For local development and testing:

```bash
# Start a local Anvil node
anvil

# In another terminal, deploy contracts
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
```

### 2. Testnet/Mainnet Deployment

For deploying to a testnet or mainnet:

```bash
# Set your private key in environment variables
export PRIVATE_KEY=your_private_key_here

# Deploy to Sepolia testnet
forge script script/Deploy.s.sol --rpc-url https://sepolia.infura.io/v3/YOUR_INFURA_KEY --private-key $PRIVATE_KEY --broadcast --verify

# Deploy to Polygon mainnet
forge script script/Deploy.s.sol --rpc-url https://polygon-rpc.com --private-key $PRIVATE_KEY --broadcast --verify
```

## Deployment Script

The deployment script (`script/Deploy.s.sol`) handles the deployment of all core contracts:

1. **VoterRegistry**: Manages voter registration and verification
2. **CandidateRegistry**: Manages candidate information
3. **PartyRegistry**: Manages political parties
4. **ElectionRegistry**: Manages elections
5. **VotingSystem**: Central hub coordinating all registries

## Post-Deployment Configuration

After deployment, you'll need to:

1. **Set contract addresses**: Update environment variables in the backend
2. **Register administrators**: Add admin addresses to registries
3. **Configure relayers**: Set up backend relayer for gasless transactions
4. **Initialize ZK groups**: Set up Semaphore groups for voter privacy

## Environment Variables

Set these environment variables in your backend:

```env
# Blockchain Configuration
BLOCKCHAIN_VOTING_SYSTEM_ADDRESS=0x...
BLOCKCHAIN_WALLET_PRIVATE_KEY=0x...
```

## Gasless Transaction Setup

To enable gasless transactions for voters:

1. **Deploy relayer wallet**: Create a dedicated wallet for paying gas fees
2. **Fund relayer wallet**: Ensure sufficient funds for transaction fees
3. **Configure backend**: Set `BLOCKCHAIN_WALLET_PRIVATE_KEY` to relayer wallet key
4. **Enable ZK verification**: Set up Semaphore for voter anonymity

## ZK Integration Deployment

For ZK voter privacy using Semaphore:

1. **Deploy Semaphore contracts**: Follow Semaphore deployment guide
2. **Create voter groups**: Set up groups for each election
3. **Configure backend**: Integrate Semaphore proof generation
4. **Test ZK proofs**: Verify proof generation and verification works

## Verification

After deployment, verify contract functionality:

```bash
# Run tests against deployed contracts
forge test --fork-url http://localhost:8545

# Check contract addresses
cast call 0xVotingSystemAddress "voterRegistryAddress()" --rpc-url http://localhost:8545
cast call 0xVotingSystemAddress "candidateRegistryAddress()" --rpc-url http://localhost:8545
cast call 0xVotingSystemAddress "partyRegistryAddress()" --rpc-url http://localhost:8545
cast call 0xVotingSystemAddress "electionRegistryAddress()" --rpc-url http://localhost:8545
```

## Troubleshooting

Common deployment issues:

1. **Insufficient funds**: Ensure deployer wallet has enough ETH/MATIC
2. **Network connectivity**: Verify RPC endpoint is accessible
3. **Contract verification**: Check Etherscan/Polygonscan API keys for verification
4. **Nonce issues**: Reset nonce if transactions fail repeatedly

## Security Considerations

1. **Private key management**: Never commit private keys to version control
2. **Admin access**: Limit admin addresses to trusted personnel only
3. **Contract upgrades**: Plan for upgradeability if needed
4. **Auditing**: Consider third-party security audits for production deployments