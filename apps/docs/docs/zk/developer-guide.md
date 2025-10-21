# ZK Developer Guide

This guide provides developers with the information needed to work with Zero-Knowledge privacy features in the Blockchain Voting System.

## Overview

The system uses Semaphore, a zero-knowledge protocol that enables anonymous signaling in Ethereum smart contracts. This allows voters to prove their eligibility without revealing their identity.

## Key Concepts

### Semaphore Groups
- Voters are grouped into Merkle trees
- Each voter has a secret identity and public commitment
- Group membership can be proven without revealing which member

### ZK Proofs
- Voters generate proofs of eligibility without revealing identity
- Proofs are verified on-chain
- Prevents double voting through nullifiers

### Gasless Transactions
- Backend relays transactions to hide blockchain complexity
- Organization pays gas fees for voters
- Voters interact with traditional web interface

## Development Setup

### Prerequisites
- Node.js 18+
- pnpm package manager
- Ethereum wallet (for testing)
- Foundry (for smart contract development)

### Installation
```bash
# Install dependencies
pnpm install

# Install Semaphore CLI tools (optional)
pnpm add -g @semaphore-protocol/cli
```

### Environment Configuration
```env
# Blockchain Configuration
BLOCKCHAIN_RPC_URL=https://polygon-rpc.com
BLOCKCHAIN_VOTING_SYSTEM_ADDRESS=0x...
BLOCKCHAIN_WALLET_PRIVATE_KEY=0x...

# Encryption
ENCRYPTION_KEY=supersecretkey

# ZK Configuration
SEMAPHORE_GROUP_DEPTH=20
```

## Core Components

### 1. Voter Identity Management

```typescript
import { Identity } from '@semaphore-protocol/identity'

// Generate a new identity for a voter
const identity = new Identity()

// Extract commitment (public part stored on-chain)
const commitment = identity.commitment

// Extract secret (private part - must be securely stored)
const secret = identity.secret
```

### 2. Group Management

```typescript
import { Group } from '@semaphore-protocol/group'

// Create a new group with depth 20
const group = new Group(20)

// Add member to group
group.addMember(identity.commitment)

// Get group root (used in proofs)
const root = group.root
```

### 3. Proof Generation

```typescript
import { generateProof } from '@semaphore-protocol/proof'

// Generate ZK proof of group membership
const fullProof = await generateProof(
  identity,
  group, // or groupId for on-chain groups
  signal, // e.g., "vote_candidate_1"
  externalNullifier // e.g., "election_123"
)
```

### 4. Proof Verification

```typescript
import { verifyProof } from '@semaphore-protocol/proof'

// Verify the proof locally (for testing)
const isValid = await verifyProof(fullProof, group)
```

## Smart Contract Integration

### Semaphore Contracts
The system uses established Semaphore contracts:
- `Semaphore.sol`: Core protocol contracts
- `SemaphoreVerifier.sol`: ZK proof verification
- `Groups.sol`: Group management

### Custom Voting Contracts
Additional contracts for voting functionality:
- `ZKVoting.sol`: Voting with ZK verification
- `VoterRegistry.sol`: Voter management with ZK groups
- `Election.sol`: Election lifecycle management

### Example Contract Implementation

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ISemaphore } from "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract ZKVoting {
    ISemaphore public semaphore;
    uint256 public groupId;
    
    // Track nullifiers to prevent double voting
    mapping(uint256 => bool) public nullifierHashes;
    
    constructor(address _semaphore, uint256 _groupId) {
        semaphore = ISemaphore(_semaphore);
        groupId = _groupId;
    }
    
    function vote(
        uint256 merkleTreeRoot,
        uint256 nullifierHash,
        uint256[8] calldata proof,
        bytes32 signal
    ) external {
        // Check if voter has already voted
        require(!nullifierHashes[nullifierHash], "Already voted");
        
        // Verify the proof
        semaphore.verifyProof(groupId, merkleTreeRoot, signal, nullifierHash, groupId, proof);
        
        // Mark voter as having voted
        nullifierHashes[nullifierHash] = true;
        
        // Process the vote
        processVote(signal);
    }
    
    function processVote(bytes32 signal) internal {
        // Extract vote information from signal and process
        // This is application-specific logic
    }
}
```

## Backend Integration

### Blockchain Service
```typescript
import { BlockchainVotingSystem } from '@blockchain-voting-system/core'
import { Wallet } from '@blockchain-voting-system/core'

class BlockchainService {
  private votingSystem: BlockchainVotingSystem | null = null

  constructor(
    private readonly privateKey: `0x${string}`,
    private votingSystemAddress: Address,
    private logger: Logger,
  ) {}

  async initialize(): Promise<void> {
    try {
      const wallet = new Wallet(this.privateKey)
      this.votingSystem = new BlockchainVotingSystem(
        wallet,
        this.votingSystemAddress,
      )
      this.logger.info('Blockchain service initialized successfully')
    } catch (error) {
      this.logger.error('Failed to initialize blockchain service:', error)
      throw error
    }
  }

  getVotingSystem(): BlockchainVotingSystem | null {
    return this.votingSystem
  }

  isInitialized(): boolean {
    return this.votingSystem !== null
  }
}
```

### Gasless Transaction Relayer
```typescript
class GaslessTransactionRelayer {
  private provider: ethers.providers.JsonRpcProvider
  private wallet: ethers.Wallet
  
  constructor(rpcUrl: string, privateKey: string) {
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    this.wallet = new ethers.Wallet(privateKey, this.provider)
  }
  
  async executeTransaction(
    contractAddress: string,
    abi: any,
    functionName: string,
    args: any[]
  ): Promise<string> {
    const contract = new ethers.Contract(contractAddress, abi, this.wallet)
    
    const tx = await contract[functionName](...args)
    const receipt = await tx.wait()
    
    return receipt.transactionHash
  }
}
```

## Frontend Integration

### React Hook for Semaphore
```typescript
import { useState, useCallback } from 'react'
import { Identity } from '@semaphore-protocol/identity'

export function useSemaphore() {
  const [identity, setIdentity] = useState<Identity | null>(null)
  const [isGeneratingProof, setIsGeneratingProof] = useState(false)
  
  const generateIdentity = useCallback(() => {
    const newIdentity = new Identity()
    setIdentity(newIdentity)
    return newIdentity
  }, [])
  
  const generateProof = useCallback(async (
    signal: string,
    externalNullifier: string
  ) => {
    if (!identity) {
      throw new Error('No identity generated')
    }
    
    setIsGeneratingProof(true)
    try {
      const proof = await generateProof(
        identity,
        groupId,
        signal,
        externalNullifier
      )
      return proof
    } finally {
      setIsGeneratingProof(false)
    }
  }, [identity])
  
  return {
    identity,
    isGeneratingProof,
    generateIdentity,
    generateProof
  }
}
```

### Wallet Connection (Optional)
```typescript
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

export function useWalletConnection() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  
  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
        await web3Provider.send('eth_requestAccounts', [])
        const signer = web3Provider.getSigner()
        const address = await signer.getAddress()
        
        setProvider(web3Provider)
        setAccount(address)
        setIsConnected(true)
        
        return { provider: web3Provider, account: address }
      } catch (error) {
        console.error('Failed to connect wallet:', error)
        throw error
      }
    } else {
      throw new Error('MetaMask not installed')
    }
  }, [])
  
  return {
    provider,
    account,
    isConnected,
    connectWallet
  }
}
```

## Testing

### Unit Tests
```typescript
import { Identity } from '@semaphore-protocol/identity'
import { Group } from '@semaphore-protocol/group'
import { generateProof } from '@semaphore-protocol/proof'

describe('ZK Voting', () => {
  it('should generate valid identity', () => {
    const identity = new Identity()
    expect(identity.commitment).toBeDefined()
    expect(identity.secret).toBeDefined()
  })
  
  it('should generate valid proof', async () => {
    const identity = new Identity()
    const group = new Group(20)
    group.addMember(identity.commitment)
    
    const signal = 'test_vote'
    const externalNullifier = 'election_1'
    
    const proof = await generateProof(
      identity,
      group,
      signal,
      externalNullifier
    )
    
    expect(proof.proof).toBeDefined()
    expect(proof.publicSignals).toBeDefined()
  })
  
  it('should verify valid proof', async () => {
    const identity = new Identity()
    const group = new Group(20)
    group.addMember(identity.commitment)
    
    const signal = 'test_vote'
    const externalNullifier = 'election_1'
    
    const proof = await generateProof(
      identity,
      group,
      signal,
      externalNullifier
    )
    
    const isValid = await verifyProof(proof, group)
    expect(isValid).toBe(true)
  })
})
```

### Integration Tests
```typescript
import { BlockchainVotingSystem } from '@blockchain-voting-system/core'

describe('ZK Voting Integration', () => {
  it('should complete anonymous voting flow', async () => {
    // 1. Initialize blockchain service
    const blockchainService = new BlockchainService(privateKey, votingSystemAddress, logger)
    await blockchainService.initialize()
    
    // 2. Get voting system
    const votingSystem = blockchainService.getVotingSystem()
    expect(votingSystem).toBeDefined()
    
    // 3. Create election
    const electionResult = await votingSystem.createElection(
      'Test Election',
      'Description',
      'QmTestElectionCID'
    )
    
    expect(electionResult.isOk).toBe(true)
    const electionId = electionResult.value
    
    // 4. Register voter with ZK identity
    const voterResult = await votingSystem.registerVoter('0x1234...')
    expect(voterResult.isOk).toBe(true)
    
    // 5. Verify voter
    const verifyResult = await votingSystem.isVoterVerified('0x1234...')
    expect(verifyResult.isOk).toBe(true)
    expect(verifyResult.value).toBe(true)
    
    // 6. Cast vote with ZK proof
    const voteResult = await votingSystem.castVote(
      electionId,
      '0x5678...', // Party address
      1 // Candidate ID
    )
    
    expect(voteResult.isOk).toBe(true)
  })
})
```

## Security Best Practices

### 1. Identity Management
```typescript
// Always encrypt identity secrets
const encryptIdentitySecret = (secret: string, encryptionKey: string): string => {
  // Use strong encryption (AES-256-GCM)
  return encrypt(secret, encryptionKey)
}

// Secure storage
const storeEncryptedIdentity = async (userId: string, encryptedSecret: string) => {
  await database.storeEncryptedIdentity({
    userId,
    encryptedSecret,
    createdAt: new Date()
  })
}
```

### 2. Proof Generation
```typescript
// Validate inputs before proof generation
const validateVoteInputs = (electionId: number, candidateId: number) => {
  if (!electionId || electionId <= 0) {
    throw new Error('Invalid election ID')
  }
  
  if (!candidateId || candidateId <= 0) {
    throw new Error('Invalid candidate ID')
  }
}

// Generate proofs in web workers to prevent UI blocking
const generateProofInWorker = async (
  identity: Identity,
  groupId: bigint,
  signal: string,
  externalNullifier: string
): Promise<FullProof> => {
  const worker = new Worker('/proof-generator.js')
  
  return new Promise((resolve, reject) => {
    worker.postMessage({ identity, groupId, signal, externalNullifier })
    
    worker.onmessage = (event) => {
      resolve(event.data.proof)
      worker.terminate()
    }
    
    worker.onerror = (error) => {
      reject(error)
      worker.terminate()
    }
  })
}
```

### 3. Smart Contract Security
```solidity
// Always validate inputs in smart contracts
function vote(
    uint256 merkleTreeRoot,
    uint256 nullifierHash,
    uint256[8] calldata proof,
    bytes32 signal
) external {
    // Validate nullifier
    require(nullifierHash != 0, "Invalid nullifier");
    
    // Check if voter has already voted
    require(!nullifierHashes[nullifierHash], "Already voted");
    
    // Verify the proof
    semaphore.verifyProof(groupId, merkleTreeRoot, signal, nullifierHash, groupId, proof);
    
    // Mark voter as having voted
    nullifierHashes[nullifierHash] = true;
    
    // Process the vote
    processVote(signal);
}
```

## Performance Optimization

### 1. Proof Caching
```typescript
class ProofCache {
  private cache: Map<string, { proof: FullProof; timestamp: number }> = new Map()
  private ttl: number = 5 * 60 * 1000 // 5 minutes
  
  get(key: string): FullProof | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return entry.proof
  }
  
  set(key: string, proof: FullProof): void {
    this.cache.set(key, {
      proof,
      timestamp: Date.now()
    })
  }
}
```

### 2. Web Workers
```typescript
// proof-generator.js
self.onmessage = async (event) => {
  const { identity, groupId, signal, externalNullifier } = event.data
  
  try {
    const proof = await generateProof(identity, groupId, signal, externalNullifier)
    self.postMessage({ proof })
  } catch (error) {
    self.postMessage({ error: error.message })
  }
}
```

### 3. Batch Operations
```typescript
// Batch multiple votes in single transaction
async function batchVoteSubmission(votes: VoteData[]): Promise<string> {
  const batch = new ethers.providers.JsonRpcBatchProvider(rpcUrl)
  
  // Submit all votes in one transaction to save gas
  const tx = await votingContract.batchVote(votes)
  const receipt = await tx.wait()
  
  return receipt.transactionHash
}
```

## Troubleshooting

### Common Issues

1. **"Tree depth mismatch"**
   - Solution: Ensure group depth matches proof parameters
   
2. **"Invalid identity"**
   - Solution: Verify identity secret format
   
3. **"Proof verification failed"**
   - Solution: Check signal and external nullifier match
   
4. **"Already voted"**
   - Solution: Use proper nullifier system

### Debugging Tips

1. **Enable verbose logging** during development
2. **Use Semaphore CLI tools** for testing proofs
3. **Check contract addresses** and ABIs
4. **Verify network configuration**

## Monitoring and Analytics

### Transaction Tracking
```typescript
class ZKTransactionMonitor {
  async trackTransaction(
    txHash: string,
    userId: string,
    action: 'vote' | 'register' | 'verify',
    proofGenerationTime: number
  ) {
    await database.logTransaction({
      txHash,
      userId,
      action,
      proofGenerationTime,
      timestamp: new Date()
    })
  }
}
```

### Performance Metrics
```typescript
class ZKPerformanceMonitor {
  async measureProofGeneration(duration: number) {
    await analytics.track('zk_proof_generation_time', {
      duration_ms: duration,
      timestamp: new Date()
    })
  }
  
  async measureVerification(duration: number) {
    await analytics.track('zk_proof_verification_time', {
      duration_ms: duration,
      timestamp: new Date()
    })
  }
}
```

## Resources

- [Semaphore Documentation](https://semaphore.appliedzkp.org/)
- [Zero-Knowledge Proofs Explained](https://zkp.science/)
- [Ethereum Development Guides](https://ethereum.org/developers/)
- [Account Abstraction Resources](https://docs.pimlico.io/)