# Semaphore Integration Guide

This guide explains how to integrate Semaphore into the Blockchain Voting System for Zero-Knowledge privacy.

## What is Semaphore?

Semaphore is a zero-knowledge protocol that enables anonymous signaling in Ethereum smart contracts. It allows users to prove group membership and broadcast signals without revealing their identity.

## Core Concepts

### Identities

Each voter has a Semaphore identity consisting of:
- **Secret**: Private value known only to the voter (two random values)
- **Commitment**: Public value derived from the secret (stored on-chain)

```typescript
import { Identity } from '@semaphore-protocol/identity'

// Generate a new identity
const identity = new Identity()

// Extract commitment (public part stored on-chain)
const commitment = identity.commitment

// Extract secret (private part - must be securely stored)
const secret = identity.secret
```

### Groups

Groups are Merkle trees containing identity commitments:
- **Members**: Identity commitments stored in leaves
- **Root**: Single hash representing the entire group
- **Depth**: Determines maximum group size (16, 20, or 32)

```typescript
import { Group } from '@semaphore-protocol/group'

// Create a new group with depth 20
const group = new Group(20)

// Add member to group
group.addMember(identity.commitment)
```

### Nullifiers

Nullifiers prevent double signaling:
- **Nullifier Hash**: Unique hash derived from identity and external nullifier
- **External Nullifier**: Context identifier (e.g., election ID)
- **Uniqueness**: Each combination prevents double signaling

### Signals

Signals are the messages being sent anonymously:
- **Content**: Vote choice or other data
- **Encoding**: Converted to bytes32 for ZK proofs

## Implementation Steps

### 1. Install Dependencies

```bash
pnpm add @semaphore-protocol/identity @semaphore-protocol/group @semaphore-protocol/proof
```

### 2. Generate Identity

```typescript
import { Identity } from '@semaphore-protocol/identity'

// Create a new identity for the voter
const identity = new Identity()

// Extract commitment (public part stored on-chain)
const commitment = identity.commitment

// Extract secret (private part - must be securely stored)
const secret = identity.secret
```

### 3. Add to Group

```typescript
// On-chain: Add commitment to Semaphore group
await semaphoreContract.addMember(groupId, commitment)
```

### 4. Generate Proof

```typescript
import { generateProof } from '@semaphore-protocol/proof'

// Generate ZK proof of group membership
const fullProof = await generateProof(
  identity,
  groupId,
  signal, // e.g., "vote_candidate_1"
  externalNullifier // e.g., "election_123"
)
```

### 5. Verify Proof

```typescript
// On-chain: Verify the proof
await semaphoreContract.verifyProof(
  groupId,
  fullProof.publicSignals.merkleTreeRoot,
  fullProof.publicSignals.nullifierHash,
  fullProof.publicSignals.signal,
  externalNullifier,
  fullProof.proof
)
```

## Smart Contract Integration

### Using Semaphore Contracts

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ISemaphore } from "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract Voting {
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

## Frontend Integration

### React Hook for Semaphore

```typescript
import { useState, useCallback } from 'react'
import { Identity } from '@semaphore-protocol/identity'
import { generateProof } from '@semaphore-protocol/proof'

export function useSemaphore() {
  const [identity, setIdentity] = useState<Identity | null>(null)
  const [isGeneratingProof, setIsGeneratingProof] = useState(false)
  
  const generateIdentity = useCallback(() => {
    const newIdentity = new Identity()
    setIdentity(newIdentity)
    return newIdentity
  }, [])
  
  const generateVotingProof = useCallback(async (
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
    generateVotingProof
  }
}
```

## Backend Integration

### Identity Management Service

```typescript
import { Identity } from '@semaphore-protocol/identity'
import { encrypt, decrypt } from '@/lib/crypto'

class SemaphoreIdentityService {
  // Store encrypted identity secrets
  async storeIdentity(userId: string, identity: Identity): Promise<void> {
    const encryptedSecret = encrypt(identity.secret.toString())
    await database.storeEncryptedIdentity(userId, encryptedSecret)
  }
  
  // Retrieve and decrypt identity
  async getIdentity(userId: string): Promise<Identity | null> {
    const encryptedSecret = await database.getEncryptedIdentity(userId)
    if (!encryptedSecret) return null
    
    try {
      const secret = decrypt(encryptedSecret)
      return new Identity(secret)
    } catch (error) {
      return null
    }
  }
  
  // Generate proof on behalf of user (for gasless transactions)
  async generateProofForUser(
    userId: string,
    signal: string,
    externalNullifier: string
  ) {
    const identity = await this.getIdentity(userId)
    if (!identity) {
      throw new Error('User identity not found')
    }
    
    return await generateProof(
      identity,
      groupId,
      signal,
      externalNullifier
    )
  }
}
```

## Testing

### Unit Tests

```typescript
import { Identity } from '@semaphore-protocol/identity'
import { generateProof } from '@semaphore-protocol/proof'

describe('Semaphore Integration', () => {
  it('should generate valid identity', () => {
    const identity = new Identity()
    expect(identity.commitment).toBeDefined()
    expect(identity.secret).toBeDefined()
  })
  
  it('should generate valid proof', async () => {
    const identity = new Identity()
    const signal = 'test_vote'
    const externalNullifier = 'election_1'
    
    const proof = await generateProof(
      identity,
      groupId,
      signal,
      externalNullifier
    )
    
    expect(proof.proof).toBeDefined()
    expect(proof.publicSignals).toBeDefined()
  })
})
```

## Security Considerations

### Identity Storage
- **Never store secrets in plaintext**
- **Use strong encryption for secret storage**
- **Implement secure key derivation**

### Proof Generation
- **Validate all inputs**
- **Handle errors gracefully**
- **Prevent replay attacks**

### Smart Contract
- **Audit contracts regularly**
- **Use established Semaphore contracts**
- **Implement proper access controls**

## Performance Optimization

### Caching
```typescript
// Cache generated proofs
const proofCache = new Map<string, FullProof>()

function getProofFromCache(cacheKey: string): FullProof | undefined {
  return proofCache.get(cacheKey)
}

function setProofInCache(cacheKey: string, proof: FullProof): void {
  proofCache.set(cacheKey, proof)
}
```

### Web Workers
```typescript
// Offload proof generation to web workers
const worker = new Worker('/semaphore-worker.js')

worker.postMessage({
  action: 'generateProof',
  data: { identity, groupId, signal, externalNullifier }
})

worker.onmessage = (event) => {
  const { proof } = event.data
  // Handle generated proof
}
```

## Troubleshooting

### Common Errors

1. **"Tree depth mismatch"**
   - Solution: Ensure group depth matches proof parameters

2. **"Invalid identity"**
   - Solution: Verify identity secret format

3. **"Proof verification failed"**
   - Solution: Check signal and external nullifier match

### Debugging Tips

1. **Enable logging** in development
2. **Use Semaphore CLI tools** for testing
3. **Check browser console** for WebAssembly errors
4. **Verify network connectivity** to blockchain nodes

## Resources

- [Semaphore Documentation](https://semaphore.appliedzkp.org/)
- [Semaphore GitHub](https://github.com/semaphore-protocol/semaphore)
- [ZK Voting Examples](https://github.com/semaphore-protocol/semaphore/tree/main/examples)