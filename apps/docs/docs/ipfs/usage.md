# IPFS Usage

This section details how IPFS is used within the Blockchain Voting System, including how data is uploaded, retrieved, and linked to smart contracts.

## Overview

IPFS (InterPlanetary File System) is used in the Blockchain Voting System to provide decentralized storage for election-related media and metadata. This includes:

- Candidate profile pictures and bios
- Party logos and information
- Election descriptions and related documents
- Voter registration documents

By using IPFS, the system ensures that media files are:
- Permanently available (content-addressed storage)
- Tamper-proof (immutable once stored)
- Distributed (no single point of failure)
- Cost-effective (no recurring hosting costs)

## Data Storage Architecture

### Content Addressing

All files stored on IPFS are referenced by their Content Identifier (CID), which is a cryptographic hash of the file content. This ensures:

1. **Immutability**: Files cannot be changed without generating a new CID
2. **Verifiability**: Anyone can verify file integrity by hashing the content
3. **Deduplication**: Identical files are stored only once across the network

### File Types and Usage

| File Type | Usage | Example CID |
|-----------|-------|-------------|
| Candidate Images | Profile pictures for candidates | `QmCandidateImage123...` |
| Party Logos | Visual representation of political parties | `QmPartyLogo456...` |
| Election Documents | Descriptions, rules, terms | `QmElectionDoc789...` |
| Voter Records | Registration and verification documents | `QmVoterRecordABC...` |

## Integration with Smart Contracts

### Storing References

Rather than storing entire files on the blockchain (which would be expensive), smart contracts store only the CIDs:

```solidity
struct Candidate {
    uint id;
    string name;
    string position;
    string cid; // IPFS CID for candidate image/bio
}

struct Party {
    uint id;
    string name;
    string slogan;
    string cid; // IPFS CID for party logo
}
```

### Retrieving Files

When the frontend needs to display a candidate's photo:

1. Smart contract is queried for candidate data
2. CID is extracted from the candidate record
3. IPFS gateway is used to retrieve the file: `https://ipfs.io/ipfs/{cid}`
4. File is displayed to the user

## Upload Process

### 1. File Preparation
Files are prepared for upload by:
- Validating file type and size limits
- Converting to web-friendly formats (JPEG, PNG, etc.)
- Generating thumbnails where appropriate

### 2. IPFS Upload
Files are uploaded to IPFS using:
- Local IPFS node (in development)
- Pinning service (in production)
- Content hashing to generate CID

### 3. Smart Contract Update
The generated CID is stored in the appropriate smart contract:
```typescript
// Example: Updating a candidate with their IPFS CID
const candidateId = await votingSystem.registerCandidate(
  partyId,
  "John Doe",
  "President",
  "QmCandidateImage123..." // IPFS CID
);
```

## Retrieval Process

### 1. Smart Contract Query
Frontend queries smart contract for entity data:
```typescript
const candidate = await votingSystem.getCandidate(candidateId);
const candidateCid = candidate.cid; // IPFS CID
```

### 2. IPFS Gateway Access
Frontend retrieves file from IPFS via gateway:
```typescript
const imageUrl = `https://ipfs.io/ipfs/${candidateCid}`;
```

### 3. File Display
Retrieved file is displayed in the UI.

## Security Considerations

### Content Integrity
- CIDs ensure files haven't been tampered with
- Frontend can verify file hashes if needed
- Pinning services provide redundancy

### Privacy
- Files are public by default on IPFS
- Sensitive voter data should be encrypted before upload
- Access controls are implemented at the application layer

## Best Practices

### File Optimization
- Compress images before upload
- Use appropriate file formats (WebP for images)
- Implement proper sizing for different use cases

### Pinning Strategy
- Use multiple pinning services for redundancy
- Implement automatic pinning for critical election data
- Consider unpinning expired election data to reduce costs

### Error Handling
- Implement fallback gateways
- Cache frequently accessed files
- Handle IPFS gateway downtime gracefully

## Example Implementation

### Uploading a Candidate Image
```typescript
// Frontend uploads image to IPFS
const file = document.getElementById('candidate-photo').files[0];
const cid = await ipfs.upload(file);

// Backend registers candidate with CID
const candidateId = await votingSystem.registerCandidate(
  partyId,
  name,
  position,
  cid
);
```

### Displaying a Candidate Image
```typescript
// Frontend retrieves candidate data
const candidate = await votingSystem.getCandidate(candidateId);

// Construct IPFS URL
const imageUrl = `https://ipfs.io/ipfs/${candidate.cid}`;

// Display image
document.getElementById('candidate-photo').src = imageUrl;
```

## Future Enhancements

### Encryption
- Encrypt sensitive files before IPFS upload
- Implement decryption keys for authorized access

### Streaming
- Support for large video files
- Progressive loading for better UX

### Caching
- Implement browser caching strategies
- Use CDNs for popular content