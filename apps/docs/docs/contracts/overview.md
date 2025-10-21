# Smart Contracts Overview

This section provides a high-level overview of the smart contracts developed for the Blockchain Voting System. The contracts are written in Solidity and deployed on a compatible blockchain network.

For detailed technical specifications of each contract, please refer to the [Technical Details](/contracts/technical-details) page.

## Core Contracts

The smart contract suite employs a modular design approach, where core entities of the voting system are encapsulated within their own dedicated Solidity contracts. This structure enhances clarity, maintainability, and reusability by separating concerns.

### `Voter.sol`

Defines the `Voter` struct, a fundamental data structure for managing voter status (registered, voted) within the election system. It is a blueprint for voter objects, not a deployable contract.

### `Candidate.sol`

Defines the `Candidate` struct, representing a candidate participating in an election. It includes fields for a unique ID, name, position, and an IPFS Content Identifier (CID) for additional profile information. This is a data structure definition, not a deployable contract.

### `Party.sol`

Manages political parties, their details (name, slogan, IPFS CID for logo), and the candidates associated with them. Each `Party` contract is deployed independently and allows its administrator to register and manage candidates.

### `Election.sol`

Manages the lifecycle of a single election, including its start and end times, participating parties, voter registration, and vote casting. It interacts with `Party` contracts and utilizes the `Voter` struct to track voter status and votes.

### `VotingSystem.sol`

Serves as the central hub for creating and managing elections and political parties. It acts as a factory for `Election` and `Party` contracts, allowing an administrator to create new elections and parties and retrieve their addresses.

## ZK Privacy Integration

The system integrates Zero-Knowledge (ZK) proofs using Semaphore to ensure voter privacy:

### `Semaphore Integration`
- **Anonymous Voting**: Voters can prove eligibility without revealing identity
- **Group Membership**: Voters belong to Semaphore groups for each election
- **Nullifier System**: Prevents double voting while maintaining anonymity
- **ZK Proof Generation**: Client-side proof generation for voter eligibility

### `Privacy Guarantees`
- **Voter Anonymity**: Votes cannot be linked to specific voter identities
- **Unlinkability**: Multiple actions by same voter appear unrelated
- **Deniability**: Voters cannot prove how they voted

## Gasless Transaction Architecture

To hide blockchain complexity from voters, the system implements a relay architecture:

### `Backend Relayer`
- **Gas Abstraction**: Backend pays gas fees for voter transactions
- **Wallet Management**: Backend wallet handles all blockchain interactions
- **User Experience**: Voters interact with traditional web app interface
- **Transaction Relay**: Backend submits signed transactions on behalf of voters

### `Authentication Flow`
- **Traditional Login**: Email/password or social login for voters
- **ZK Proof Generation**: Client-side generation of eligibility proofs
- **Backend Submission**: Relay service submits votes to blockchain
- **Confirmation**: Immediate feedback to voters

## ZK Privacy Integration

The system integrates Zero-Knowledge proofs for voter privacy using Semaphore:

### `Semaphore Integration`
- Voters generate ZK proofs to prove eligibility without revealing identity
- Semaphore groups manage voter anonymity
- Nullifier system prevents double voting

### `Privacy Guarantees`
- Votes cannot be linked to specific voters
- Voter eligibility is proven without revealing identity
- Unlinkability between votes from the same voter

## Gasless Transaction Architecture

To hide blockchain complexity from voters:

### `Backend Relay`
- Backend submits transactions to blockchain on behalf of voters
- Voters don't need wallets or pay gas fees
- Traditional authentication (email/password) used instead

### `User Experience`
- Seamless web application experience
- No wallet installation required
- Instant vote confirmation