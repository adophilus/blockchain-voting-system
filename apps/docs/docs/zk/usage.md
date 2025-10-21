# ZK Integration Usage

This guide explains how to use the Zero-Knowledge (ZK) privacy features in the Blockchain Voting System.

## Prerequisites

Before using ZK features, ensure you have:

1. A compatible browser with WebAssembly support
2. A modern JavaScript runtime
3. Access to the voting system
4. Registration as an eligible voter

## Voter Registration with ZK

### Identity Generation

When registering as a voter, the system automatically generates a Semaphore identity:

```typescript
// Backend generates identity for voter during registration
import { Identity } from '@semaphore-protocol/identity'

const identity = new Identity()
const commitment = identity.commitment
const secret = identity.secret

// Store commitment on-chain in voter group
// Store encrypted secret in database for voter
```

### Secret Storage

The voter's secret identity is stored securely:
- **Encrypted in database**: Backend encrypts and stores the secret
- **Offline backup**: Voter receives backup copy (PDF, QR code)
- **Secure recovery**: Recovery mechanisms without revealing identity

## Voting with ZK Privacy

### Authentication Flow

1. **Traditional Login**: Voter signs in with email/password
2. **Identity Retrieval**: Backend decrypts voter's identity secret
3. **Proof Generation**: ZK proof created from identity secret
4. **Blockchain Submission**: Vote submitted with ZK proof

### ZK Proof Generation

The system automatically generates ZK proofs:

```typescript
import { generateProof } from '@semaphore-protocol/proof'

// Generate proof of group membership
const proof = await generateProof(
  identity,           // Voter's Semaphore identity
  groupId,            // Election-specific group ID
  signal,             // Vote content
  externalNullifier   // Election context
)

// Pack proof for efficient transmission
const packedProof = packProof(proof)
```

### Vote Submission

Votes are submitted with ZK proofs:

```typescript
// Submit vote with proof
const tx = await votingContract.castVote(
  electionId,
  partyAddress,
  candidateId,
  packedProof,
  publicSignals
)

await tx.wait()
```

## Gasless Transaction Handling

### Backend Relay

The system uses backend relaying to eliminate gas fees:

1. **Proof Generation**: Voter's browser or backend generates ZK proof
2. **Transaction Signing**: Backend signs transaction with its wallet
3. **Gas Payment**: Backend pays gas fees
4. **Blockchain Submission**: Transaction submitted to blockchain

### User Experience

Voters experience a seamless process:
- No wallet installation required
- No gas fees to pay
- No private key management
- Traditional web app interface

## Verification Process

### Proof Verification

Smart contracts verify ZK proofs:

```solidity
// Verify ZK proof on-chain
function verifyProof(
    uint256 groupId,
    uint256 merkleTreeRoot,
    bytes32 signal,
    uint256 nullifierHash,
    uint256 externalNullifier,
    uint256[8] memory proof
) public view returns (bool) {
    return semaphore.verifyProof(
        groupId,
        merkleTreeRoot,
        signal,
        nullifierHash,
        externalNullifier,
        proof
    );
}
```

### Double Voting Prevention

The nullifier system prevents double voting:

```solidity
// Check if voter has already voted
require(!nullifierHashes[nullifierHash], "Already voted");

// Mark voter as having voted
nullifierHashes[nullifierHash] = true;
```

## Error Handling

### Common ZK Errors

1. **Proof Generation Failures**
   - Insufficient browser resources
   - Invalid identity secrets
   - Network connectivity issues

2. **Verification Failures**
   - Invalid proofs
   - Expired elections
   - Incorrect group membership

3. **Transaction Failures**
   - Insufficient gas (backend issue)
   - Contract errors
   - Network congestion

### Error Recovery

The system implements graceful error handling:

```typescript
try {
  const proof = await generateProof(identity, groupId, signal, externalNullifier)
  const result = await submitVoteWithProof(proof)
  return Result.ok(result)
} catch (error) {
  if (error.message.includes('tree depth')) {
    // Handle incorrect tree depth
    return Result.err({ type: 'InvalidTreeDepthError' })
  } else if (error.message.includes('signal')) {
    // Handle invalid signal
    return Result.err({ type: 'InvalidSignalError' })
  } else {
    // Handle other errors
    return Result.err({ type: 'UnknownError', message: error.message })
  }
}
```

## Testing ZK Features

### Unit Testing

Test ZK proof generation and verification:

```typescript
describe('ZK Voting', () => {
  it('should generate and verify valid proof', async () => {
    const identity = new Identity()
    const groupId = BigInt(1)
    const signal = 'vote:1:5'
    const externalNullifier = 'election-1'
    
    const proof = await generateProof(identity, groupId, signal, externalNullifier)
    expect(proof).toBeDefined()
    
    // Verify proof structure
    expect(proof.proof).toBeDefined()
    expect(proof.publicSignals).toBeDefined()
  })
})
```

### Integration Testing

Test end-to-end voting flow with ZK:

```typescript
describe('ZK Voting Integration', () => {
  it('should complete anonymous voting flow', async () => {
    // 1. Register voter with ZK identity
    const voter = await registerVoterWithZK()
    
    // 2. Generate ZK proof for vote
    const proof = await generateVotingProof(voter.identity, electionId, voteData)
    
    // 3. Submit vote with proof
    const result = await submitVoteWithProof(proof)
    expect(result.success).toBe(true)
    
    // 4. Verify vote was recorded
    const voteCount = await getVoteCount(candidateId)
    expect(voteCount).toBe(1)
  })
})
```

## Performance Optimization

### Proof Caching

Cache frequently used proofs:

```typescript
const proofCache = new Map<string, FullProof>()

function getCachedProof(cacheKey: string): FullProof | undefined {
  return proofCache.get(cacheKey)
}

function setCachedProof(cacheKey: string, proof: FullProof): void {
  proofCache.set(cacheKey, proof)
}
```

### Web Workers

Offload proof generation to web workers:

```typescript
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

## Security Best Practices

### Identity Management

1. **Encrypt Secrets**: Always encrypt identity secrets in storage
2. **Secure Transmission**: Use HTTPS/TLS for secret distribution
3. **Access Controls**: Implement proper access controls for identity data

### Proof Generation

1. **Validate Inputs**: Sanitize all inputs before proof generation
2. **Error Handling**: Handle proof generation errors gracefully
3. **Resource Management**: Monitor browser resources during proof generation

### Smart Contract Security

1. **Audit Contracts**: Regular security audits of ZK contracts
2. **Upgradeability**: Consider upgradeable contract patterns
3. **Gas Optimization**: Optimize for gas efficiency

## Monitoring and Logging

### Transaction Tracking

Track ZK transactions for monitoring:

```typescript
class ZKTransactionMonitor {
  async trackTransaction(txHash: string, voterId: string, action: string) {
    // Log transaction for monitoring
    await database.logTransaction({
      txHash,
      voterId,
      action,
      timestamp: new Date(),
      status: 'submitted'
    })
  }
}
```

### Performance Metrics

Monitor ZK proof generation performance:

```typescript
class ZKPerformanceMonitor {
  async measureProofGeneration(
    identity: Identity,
    groupId: bigint,
    signal: string,
    externalNullifier: string
  ) {
    const startTime = Date.now()
    const proof = await generateProof(identity, groupId, signal, externalNullifier)
    const endTime = Date.now()
    
    const duration = endTime - startTime
    console.log(`Proof generation took ${duration}ms`)
    
    return { proof, duration }
  }
}
```

## Troubleshooting

### Common Issues

1. **Slow Proof Generation**
   - Solution: Use web workers or background processing
   - Solution: Implement progress indicators

2. **Invalid Proofs**
   - Solution: Verify signal and external nullifier match
   - Solution: Check group membership

3. **Verification Failures**
   - Solution: Validate contract addresses
   - Solution: Check network connectivity

### Debugging Tips

1. **Enable Verbose Logging**: During development, enable detailed ZK logging
2. **Use Semaphore CLI Tools**: For testing and debugging ZK proofs
3. **Check Browser Console**: Look for WebAssembly or proof generation errors
4. **Verify Network Connectivity**: Ensure connection to blockchain nodes

## Further Reading

- [Semaphore Documentation](https://semaphore.appliedzkp.org/)
- [Zero-Knowledge Proofs Explained](https://zkp.science/)
- [Ethereum Development Guides](https://ethereum.org/developers/)