# Developer Guide: ZK Integration

This guide explains how to integrate Zero-Knowledge (ZK) privacy features into the Blockchain Voting System.

## Prerequisites

Before working with ZK features, ensure you have:

1. Basic understanding of blockchain concepts
2. Familiarity with Ethereum development
3. Node.js and pnpm installed
4. Understanding of zero-knowledge cryptography basics

## Key Concepts

### Semaphore Groups
Semaphore uses Merkle trees to manage groups of voters. Each voter has an identity commitment that is added to the tree.

### Identity Management
Voters generate identities consisting of:
- **Secret**: Private value known only to the voter
- **Commitment**: Public value derived from the secret

### ZK Proofs
Zero-knowledge proofs allow voters to prove:
- They are a member of the voter group
- They haven't voted before (using nullifiers)
- Without revealing their identity

## Development Setup

### Installing Dependencies

```bash
# Install Semaphore dependencies
pnpm add @semaphore-protocol/identity @semaphore-protocol/proof @semaphore-protocol/group

# Install development tools
pnpm add -D @semaphore-protocol/cli
```

### Environment Configuration

Add the following to your `.env` file:

```env
# Semaphore contract addresses (for development)
SEMAPHORE_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
GROUP_ID=1
```

## Core Implementation

### 1. Identity Generation

```typescript
import { Identity } from '@semaphore-protocol/identity'

// Generate a new identity for a voter
const identity = new Identity()

// Store the secret securely (encrypted in database)
const secret = identity.secret
const commitment = identity.commitment

// Add commitment to on-chain group
await contract.addMemberToGroup(GROUP_ID, commitment)
```

### 2. Proof Generation

```typescript
import { generateProof, packProof } from '@semaphore-protocol/proof'

// Generate a ZK proof that the voter is in the group
const fullProof = await generateProof(
  identity,
  GROUP_ID,
  "vote_candidate_1",
  "election_123"
)

// Pack the proof for efficient transmission
const packedProof = packProof(fullProof.proof)
```

### 3. Proof Verification

```typescript
// Submit the proof to the smart contract
await contract.verifyAndCastVote(
  GROUP_ID,
  fullProof.publicSignals.merkleTreeRoot,
  fullProof.publicSignals.nullifierHash,
  packedProof,
  "vote_candidate_1"
)
```

## Testing ZK Features

### Unit Tests

```typescript
import { Identity } from '@semaphore-protocol/identity'
import { generateProof } from '@semaphore-protocol/proof'

describe('ZK Voting Tests', () => {
  it('should generate valid proof', async () => {
    const identity = new Identity()
    const signal = 'test_signal'
    const groupId = BigInt(1)
    const externalNullifier = 'test_election'
    
    const proof = await generateProof(identity, groupId, signal, externalNullifier)
    
    expect(proof).toBeDefined()
    expect(proof.proof).toBeDefined()
    expect(proof.publicSignals).toBeDefined()
  })
})
```

### Integration Tests

```typescript
describe('End-to-End ZK Voting', () => {
  it('should complete anonymous voting flow', async () => {
    // 1. Generate voter identity
    const identity = new Identity()
    
    // 2. Add to group (mock or real)
    await addToGroup(identity.commitment)
    
    // 3. Generate proof
    const proof = await generateProof(
      identity,
      GROUP_ID,
      'vote_candidate_A',
      'election_1'
    )
    
    // 4. Submit vote with proof
    const result = await submitVoteWithProof(proof)
    
    // 5. Verify vote was counted
    expect(result.success).toBe(true)
  })
})
```

## Common Patterns

### Error Handling

```typescript
try {
  const proof = await generateProof(identity, groupId, signal, externalNullifier)
} catch (error) {
  if (error.message.includes('tree depth')) {
    // Handle tree depth mismatch
  } else if (error.message.includes('signal')) {
    // Handle signal generation error
  } else {
    // Handle other errors
  }
}
```

### Caching Proofs

```typescript
// Cache generated proofs to avoid regeneration
const proofCache = new Map<string, any>()

function getCachedProof(key: string) {
  return proofCache.get(key)
}

function setCachedProof(key: string, proof: any) {
  proofCache.set(key, proof)
}
```

## Best Practices

### Security
1. **Never store identity secrets in plaintext**
2. **Always encrypt sensitive data**
3. **Use secure random number generation**
4. **Validate all inputs**

### Performance
1. **Cache frequently used proofs**
2. **Use web workers for proof generation**
3. **Implement progress indicators for long operations**
4. **Batch operations when possible**

### User Experience
1. **Provide clear feedback during proof generation**
2. **Show estimated time for operations**
3. **Handle errors gracefully**
4. **Save progress for long workflows**

## Troubleshooting

### Common Issues

1. **Proof Generation Timeout**
   - Solution: Use web workers or offload to backend
   
2. **Invalid Group ID**
   - Solution: Verify group exists on-chain
   
3. **Identity Not in Group**
   - Solution: Ensure identity commitment was added to group

4. **Contract Verification Failure**
   - Solution: Check contract addresses and ABIs

### Debugging Tips

1. **Enable verbose logging** during development
2. **Use Semaphore CLI tools** for testing
3. **Check browser console** for WebAssembly errors
4. **Verify network connectivity** to blockchain nodes

## Further Reading

- [Semaphore Documentation](https://semaphore.appliedzkp.org/)
- [Zero-Knowledge Proofs Explained](https://zkp.science/)
- [Ethereum Development Guides](https://ethereum.org/developers/)