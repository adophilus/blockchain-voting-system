# Development Tasks and Flow

This document outlines the refined flow of operations for the Blockchain Voting System, incorporating considerations for a more comprehensive system design with ZK privacy and gasless transactions. It also includes questions raised during the review process to ensure all aspects are addressed.

## Review Questions

During the review of the initial flow, the following questions and considerations were raised:

1. **Voter Privacy**: How can we ensure voter privacy while maintaining the integrity of the voting process?

2. **Gas Fees**: How can we eliminate gas fees for voters to improve user experience?

3. **Wallet Complexity**: How can we hide blockchain wallet complexity from voters while still leveraging blockchain benefits?

4. **Identity Verification**: How can voters prove their eligibility without revealing their identity?

5. **Double Voting Prevention**: How can we prevent double voting in a privacy-preserving manner?

## Refined Flow of Operations

Based on the above considerations, here is a refined flow of operations for the Blockchain Voting System with ZK privacy and gasless transactions:

### Phase 1: Election Setup

1.  **Admin creates an election:** The administrator initiates a new election by specifying its name, a detailed description, the official start and end times (Unix timestamps), and an IPFS Content Identifier (CID) for any election-related media or information. Candidates define their own positions.

2.  **Admin creates political parties:** For each political entity participating in the election, the administrator creates a new `Party` contract. This involves providing the party's name, a slogan, and an IPFS CID for its logo or other related media.

3.  **Admin adds parties to the election:** The administrator then associates the newly created `Party` contracts with the specific election. This step registers which parties are officially participating in the current election.

4.  **Admin registers candidates to parties:** Within each participating party, the administrator registers individual candidates. For each candidate, their name, the position they are running for, and an IPFS CID for their detailed profile or image are provided.

5.  **Admin registers voters to the election:** The administrator registers eligible voters by providing their unique blockchain addresses. For the current scope of this project, the voter's address serves as their primary identification for registration. Each registered voter gets added to a Semaphore group for ZK privacy.

### Phase 2: Voting Period

6.  **Voters authenticate with traditional methods:** During the active election period, voters access the web application using traditional authentication (email/password). No wallet installation is required.

7.  **Voters generate ZK proof of eligibility:** When a voter wants to vote, they generate a Zero-Knowledge proof that demonstrates they are a registered voter without revealing their identity. This proof is generated client-side using their Semaphore identity.

8.  **Backend relays vote to blockchain:** The voter's selections and ZK proof are sent to the backend, which:
    - Verifies the ZK proof
    - Uses its own wallet to submit the vote transaction to the blockchain (paying gas fees)
    - Records the vote in the database for immediate confirmation

9.  **Blockchain validates and records vote:** The blockchain contract:
    - Verifies the ZK proof to ensure voter eligibility
    - Checks that the voter hasn't already voted (using nullifiers)
    - Records the vote in an anonymized manner
    - Updates vote counts

### Phase 3: Election Conclusion

10. **Admin ends the election:** After the `endTime` of the election has passed, the administrator explicitly calls the `endElection()` function on the `Election` contract to formally conclude the voting period.

11. **Election results are tallied and displayed:** Once the election has officially ended, the web application retrieves the final vote counts and results by calling the `getElectionResults()` function on the `Election` contract. These results are then presented to the public in a clear and transparent manner, with all votes having been recorded anonymously on-chain.

## ZK Privacy Implementation Details

### Semaphore Integration

The system uses Semaphore for voter anonymity:

1. **Identity Generation**: Each registered voter gets a unique Semaphore identity (secret + commitment)
2. **Group Membership**: Voters are added to election-specific Semaphore groups
3. **ZK Proof Generation**: Voters generate proofs of group membership without revealing identity
4. **Nullifier System**: Prevents double voting while preserving anonymity

### Gasless Transaction Architecture

The relay approach hides blockchain complexity:

1. **Backend Wallet**: System backend uses its own wallet to pay gas fees
2. **User Experience**: Voters interact with a traditional web app
3. **Transaction Relay**: Backend submits signed transactions to blockchain
4. **Cost Management**: Organization covers transaction costs

## Security Model

### Privacy Guarantees
- **Anonymity**: Votes cannot be linked to specific voters
- **Unlinkability**: Multiple votes from same voter appear unrelated
- **Deniability**: Voters cannot prove how they voted

### Integrity Properties
- **Soundness**: Invalid proofs are rejected
- **Completeness**: Valid proofs are accepted
- **Nullifier Uniqueness**: Each voter can vote only once

### Trust Assumptions
- Semaphore circuit correctness
- Smart contract implementation accuracy
- Backend operator honesty (for relay transactions)