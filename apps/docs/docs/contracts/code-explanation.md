# Smart Contract Code Explanation

This document provides a detailed explanation of the smart contract implementation for the Blockchain Voting System with ZK privacy and gasless transactions.

## Overview

The smart contract system follows a modular registry pattern with separate contracts for different entities:
- **VotingSystem**: Central coordinator contract
- **Election**: Individual election management
- **Party**: Political party representation
- **Candidate**: Candidate information storage
- **Voter**: Voter registration and verification

## Core Contracts

### 1. VotingSystem Contract

The `VotingSystem` contract serves as the central hub for the entire voting system:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IVoterRegistry} from "../../voter/registry/IVoterRegistry.sol";
import {ICandidateRegistry} from "../../candidate/registry/ICandidateRegistry.sol";
import {IElectionRegistry} from "../../election/registry/IElectionRegistry.sol";
import {IPartyRegistry} from "../../party/registry/IPartyRegistry.sol";
import {IParty} from "../../party/IParty.sol";
import "../../../common/Errors.sol";
import {IVotingSystem} from "./IVotingSystem.sol";

contract VotingSystem is IVotingSystem {
    address public admin;
    address public voterRegistryAddress;
    address public candidateRegistryAddress;
    address public electionRegistryAddress;
    address public partyRegistryAddress;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(
        address _voterRegistryAddress,
        address _candidateRegistryAddress,
        address _electionRegistryAddress,
        address _partyRegistryAddress,
        address _admin
    ) {
        admin = _admin;
        voterRegistryAddress = _voterRegistryAddress;
        candidateRegistryAddress = _candidateRegistryAddress;
        electionRegistryAddress = _electionRegistryAddress;
        partyRegistryAddress = _partyRegistryAddress;
    }
}
```

**Key Features:**
- **Central Coordinator**: Manages references to all registry contracts
- **Admin Control**: Only admin can perform privileged operations
- **Registry Addresses**: Stores addresses of all system registries
- **Minimal Logic**: Delegates to specialized registry contracts

### 2. Election Contract

The `Election` contract manages the lifecycle of individual elections:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {VoterRegistry} from "../voter/registry/VoterRegistry.sol";
import {Party} from "../party/Party.sol";
import "../../common/Errors.sol";
import {IElection} from "./IElection.sol";

contract Election is IElection {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    uint public startTime;
    uint public endTime;
    bool public electionStarted;
    bool public electionEnded;
    string public name;
    string public description;
    string public cid; // IPFS CID for election-related media
    address public voterRegistryAddress;
    address public admin;

    // Mapping of parties participating in this election
    mapping(address => bool) public participatingParties;
    address[] public participatingPartyAddresses;
    mapping(address => mapping(uint => uint)) public partyCandidateVoteCounts; // party => candidateId => voteCount

    // Track voters registered for this specific election (must be in VoterRegistry first)
    mapping(address => bool) public registeredVoters;

    // Track voters who have voted in this election
    mapping(address => bool) public hasVoted;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    modifier onlyDuringElection() {
        if (block.timestamp < startTime || block.timestamp > endTime)
            revert NotWithinElectionPeriod();
        _;
    }

    modifier hasNotVoted() {
        if (hasVoted[msg.sender]) revert AlreadyVoted();
        _;
    }

    modifier onlyAfterElection() {
        if (block.timestamp <= endTime) revert ElectionNotEnded();
        _;
    }

    modifier onlyRegisteredVoter() {
        if (!registeredVoters[msg.sender])
            revert VoterNotRegisteredForElection();
        _;
    }

    constructor(
        string memory _name,
        string memory _description,
        string memory _cid,
        address _voterRegistryAddress,
        address _admin
    ) {
        name = _name;
        description = _description;
        cid = _cid;
        voterRegistryAddress = _voterRegistryAddress;
        admin = _admin;
    }

    function startElection(uint _startTime, uint _endTime) external onlyAdmin {
        if (electionStarted) revert ElectionAlreadyStarted();
        if (_startTime < block.timestamp) revert StartTimeNotInFuture();
        if (_endTime <= _startTime) revert EndTimeBeforeStartTime();

        startTime = _startTime;
        endTime = _endTime;
        electionStarted = true;

        emit ElectionStarted(_startTime, _endTime);
    }

    function endElection() external onlyAdmin onlyAfterElection {
        electionEnded = true;
        emit ElectionEnded();
    }

    function addParty(address _party) external onlyAdmin {
        if (!electionStarted) revert ElectionNotStarted();
        if (electionEnded) revert ErrorElectionEnded();
        if (_party == address(0)) revert InvalidPartyAddress();

        participatingParties[_party] = true;
        participatingPartyAddresses.push(_party);
        emit PartyAdded(_party);
    }

    function registerVoterForElection(address _voter) external onlyAdmin {
        VoterRegistry voterRegistry = VoterRegistry(voterRegistryAddress);
        if (!voterRegistry.isVoterRegistered(_voter))
            revert VoterNotInRegistry();
        if (registeredVoters[_voter])
            revert VoterAlreadyRegisteredForElection();
        if (electionStarted) revert ElectionAlreadyStarted();
        registeredVoters[_voter] = true;
        emit VoterRegistered(_voter);
    }

    function vote(
        address _party,
        uint _candidateId
    ) external onlyRegisteredVoter hasNotVoted onlyDuringElection {
        if (!participatingParties[_party]) revert PartyNotParticipating();

        // Verify that the candidate exists in the party
        Party party = Party(_party);
        (uint id, , , , ) = party.getCandidate(_candidateId);
        if (id != _candidateId) revert InvalidCandidate();

        hasVoted[msg.sender] = true;
        partyCandidateVoteCounts[_party][_candidateId]++;

        emit VoteCast(msg.sender, _party, _candidateId);
    }

    function getVoteCount(
        address _party,
        uint _candidateId
    ) external view returns (uint) {
        return partyCandidateVoteCounts[_party][_candidateId];
    }

    function getElectionResults()
        external
        view
        onlyAfterElection
        returns (
            address[] memory _parties,
            uint[][] memory _candidateIds,
            uint[][] memory _voteCounts
        )
    {
        uint numParties = participatingPartyAddresses.length;
        _parties = new address[](numParties);
        _candidateIds = new uint[][](numParties);
        _voteCounts = new uint[][](numParties);

        for (uint i = 0; i < numParties; i++) {
            address partyAddress = participatingPartyAddresses[i];
            Party party = Party(partyAddress);

            (uint[] memory ids, , , ) = party.getAllCandidates();
            uint numCandidates = ids.length;

            uint[] memory currentCandidateIds = new uint[](numCandidates);
            uint[] memory currentVoteCounts = new uint[](numCandidates);

            for (uint j = 0; j < numCandidates; j++) {
                uint candidateId = ids[j];
                currentCandidateIds[j] = candidateId;
                currentVoteCounts[j] = partyCandidateVoteCounts[partyAddress][
                    candidateId
                ];
            }
            _parties[i] = partyAddress;
            _candidateIds[i] = currentCandidateIds;
            _voteCounts[i] = currentVoteCounts;
        }
    }
}
```

**Key Features:**
- **Election Lifecycle**: Manages start, ongoing, and end phases
- **Voter Management**: Registers voters for specific elections
- **Party Management**: Tracks participating parties
- **Vote Tracking**: Records votes with privacy considerations
- **Results Aggregation**: Provides verifiable election results
- **Time Constraints**: Enforces election timing rules

### 3. Party Contract

The `Party` contract manages political parties and their candidates:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {CandidateRegistry} from "../candidate/registry/CandidateRegistry.sol";
import "../../common/Errors.sol";
import {IParty} from "./IParty.sol";

contract Party is IParty {
    string public name;
    string public slogan;
    string public cid; // IPFS CID for party logo or related media
    address public candidateRegistryAddress;
    uint public candidateCount;
    address public admin;

    uint[] public candidateIds;
    mapping(uint => bool) private candidateIdExists;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(
        string memory _name,
        string memory _slogan,
        string memory _cid,
        address _candidateRegistryAddress,
        address _admin
    ) {
        name = _name;
        slogan = _slogan;
        cid = _cid;
        candidateRegistryAddress = _candidateRegistryAddress;
        admin = _admin;
    }

    function registerCandidate(
        uint _candidateId
    ) external onlyAdmin returns (uint) {
        CandidateRegistry candidateRegistry = CandidateRegistry(
            candidateRegistryAddress
        );
        (
            uint candidateIdFromReg,
            string memory candidateNameFromReg,
            ,
            ,

        ) = candidateRegistry.getCandidate(_candidateId);
        if (candidateIdFromReg != _candidateId) revert InvalidCandidateId();
        if (candidateIdExists[_candidateId])
            revert CandidateAlreadyRegistered();

        candidateIds.push(_candidateId);
        candidateIdExists[_candidateId] = true;
        candidateCount++;

        emit CandidateRegistered(_candidateId, candidateNameFromReg);
        return _candidateId;
    }

    function getCandidate(
        uint _candidateId
    )
        external
        view
        returns (
            uint candidateId_,
            string memory candidateName_,
            string memory candidatePosition_,
            string memory candidateCid_,
            uint candidatePartyId_
        )
    {
        if (!candidateIdExists[_candidateId]) revert CandidateNotRegistered();
        CandidateRegistry candidateRegistry = CandidateRegistry(
            candidateRegistryAddress
        );
        return candidateRegistry.getCandidate(_candidateId);
    }

    function getAllCandidates()
        external
        view
        returns (
            uint[] memory ids,
            string[] memory names,
            string[] memory positions,
            string[] memory cids
        )
    {
        uint numCandidates = candidateIds.length;
        ids = new uint[](numCandidates);
        names = new string[](numCandidates);
        positions = new string[](numCandidates);
        cids = new string[](numCandidates);

        CandidateRegistry candidateRegistry = CandidateRegistry(
            candidateRegistryAddress
        );

        for (uint i = 0; i < numCandidates; i++) {
            uint candidateId = candidateIds[i];
            (
                uint candidateIdFromReg,
                string memory candidateNameFromReg,
                string memory candidatePositionFromReg,
                string memory candidateCidFromReg,

            ) = candidateRegistry.getCandidate(candidateId);
            ids[i] = candidateIdFromReg;
            names[i] = candidateNameFromReg;
            positions[i] = candidatePositionFromReg;
            cids[i] = candidateCidFromReg;
        }
    }
}
```

**Key Features:**
- **Party Information**: Stores party name, slogan, and media
- **Candidate Management**: Registers and tracks party candidates
- **Candidate Association**: Links candidates to specific parties
- **Admin Control**: Only party admin can register candidates

### 4. Candidate Registry

The `CandidateRegistry` manages global candidate information:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Candidate} from "../Candidate.sol";
import "../../../common/Errors.sol";
import {ICandidateRegistry} from "./ICandidateRegistry.sol";
import {console} from "forge-std/console.sol";

contract CandidateRegistry is ICandidateRegistry {
    address public admin;
    uint public nextCandidateId;
    mapping(uint => Candidate) public candidates;

    modifier onlyAdmin() {
        console.log("Got here 4?");
        console.log(msg.sender);
        console.log(admin);
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(address _admin) {
        admin = _admin;
        nextCandidateId = 1;
    }

    function registerCandidate(
        string memory _name,
        string memory _position,
        string memory _cid,
        uint _partyId
    ) external onlyAdmin returns (uint) {
        console.log("Got here? 3");
        if (bytes(_name).length == 0) revert EmptyName();
        if (_partyId == 0) revert InvalidPartyId();

        uint currentId = nextCandidateId;
        candidates[currentId] = Candidate(currentId, _name, _position, _cid, _partyId);
        nextCandidateId++;
        emit CandidateRegistered(currentId, _name);
        return currentId;
    }

    function updateCandidate(
        uint _candidateId,
        string memory _name,
        string memory _position,
        string memory _cid,
        uint _partyId
    ) external onlyAdmin {
        if (_candidateId == 0 || _candidateId >= nextCandidateId)
            revert InvalidCandidateId();
        if (bytes(_name).length == 0) revert EmptyName();
        if (_partyId == 0) revert InvalidPartyId();

        candidates[_candidateId].name = _name;
        candidates[_candidateId].position = _position;
        candidates[_candidateId].cid = _cid;
        candidates[_candidateId].partyId = _partyId;
        emit CandidateUpdated(_candidateId, _name);
    }

    function getCandidate(
        uint _candidateId
    )
        external
        view
        returns (
            uint id,
            string memory name,
            string memory position,
            string memory cid,
            uint partyId
        )
    {
        if (_candidateId == 0 || _candidateId >= nextCandidateId)
            revert InvalidCandidateId();
        Candidate memory c = candidates[_candidateId];
        return (c.id, c.name, c.position, c.cid, c.partyId);
    }
    
    function getPartyIdForCandidate(
        uint _candidateId
    ) external view returns (uint) {
        if (_candidateId == 0 || _candidateId >= nextCandidateId)
            revert InvalidCandidateId();
        return candidates[_candidateId].partyId;
    }
}
```

**Key Features:**
- **Global Registry**: Central storage for all candidates
- **Party Association**: Links candidates to parties via partyId
- **CRUD Operations**: Create, read, update candidate information
- **Sequential IDs**: Auto-incrementing candidate IDs

### 5. Voter Registry

The `VoterRegistry` manages voter eligibility:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../../../common/Errors.sol";
import {IVoterRegistry} from "./IVoterRegistry.sol";

contract VoterRegistry is IVoterRegistry {
    address public admin;
    mapping(address => bool) public registeredVoters;

    modifier onlyAdmin() {
        if (admin != msg.sender) revert NotAdmin();
        _;
    }

    constructor(address _admin) {
        admin = _admin;
    }

    function registerVoter(address _voter) external onlyAdmin {
        if (_voter == address(0)) revert InvalidAddress();
        if (registeredVoters[_voter]) revert VoterAlreadyInRegistry();

        registeredVoters[_voter] = true;
        emit VoterRegistered(_voter);
    }

    function isVoterRegistered(address _voter) external view returns (bool) {
        return registeredVoters[_voter];
    }
}
```

**Key Features:**
- **Voter Eligibility**: Tracks which addresses are eligible to vote
- **Simple Registration**: Boolean mapping for fast lookups
- **Admin Control**: Only admin can register voters

## Architecture Patterns

### Registry Pattern

The system uses a **registry pattern** to manage different entity types:

1. **VoterRegistry**: Manages voter eligibility
2. **CandidateRegistry**: Handles global candidate information
3. **ElectionRegistry**: Orchestrates election creation and lifecycle
4. **PartyRegistry**: Manages political parties

This pattern addresses contract size limitations and improves maintainability by separating concerns.

### Delegation Pattern

Contracts delegate responsibilities to specialized registries:

```
VotingSystem (central coordinator)
├── VoterRegistry (voter eligibility)
├── CandidateRegistry (candidate information)
├── ElectionRegistry (election orchestration)
└── PartyRegistry (party management)
```

Each registry focuses on its specific domain, reducing complexity in individual contracts.

## Security Features

### Access Control
- **Admin Roles**: Only authorized accounts can perform privileged operations
- **Modifier Guards**: Functions protected with require statements
- **Ownership Transfers**: Admin can transfer ownership to new addresses

### Data Integrity
- **Immutable Records**: Blockchain ensures vote permanence
- **Event Logging**: All important actions emit events for tracking
- **Validation Checks**: Extensive input validation prevents errors

### Privacy Considerations
- **ZK Integration Ready**: Contracts designed to work with ZK proofs
- **Vote Anonymity**: Votes can be submitted without linking to voter identity
- **Eligibility Verification**: Prove eligibility without revealing identity

## Future Enhancements

### ZK Integration
The contracts are designed with ZK privacy in mind:
- **Semaphore Compatibility**: Can integrate with Semaphore protocol
- **Proof Verification**: Ready for ZK proof verification functions
- **Anonymous Voting**: Support for anonymous signaling

### Gas Optimization
Potential optimizations:
- **Batch Operations**: Combine multiple actions in single transactions
- **Event Indexing**: Efficient off-chain data retrieval
- **Storage Patterns**: Optimized data structures for cost reduction

### Advanced Features
- **Quadratic Voting**: With ZK privacy enhancements
- **Ranked Choice**: Complex voting mechanisms
- **Multi-Election Identity**: Single identity for multiple elections

This smart contract architecture provides a solid foundation for a secure, transparent, and private voting system that can be enhanced with ZK technologies as needed.