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

### `ElectionManager.sol`

Serves as the central hub for creating and managing elections and political parties. It acts as a factory for `Election` and `Party` contracts, allowing an administrator to create new elections and parties and retrieve their addresses.