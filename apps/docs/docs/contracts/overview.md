# Smart Contracts Overview

This section provides an overview of the smart contracts developed for the Blockchain Voting System. The contracts are written in Solidity and deployed on a compatible blockchain network.

## Contract Architecture: Modular Design

The smart contract suite employs a modular design approach, where core entities of the voting system are encapsulated within their own dedicated Solidity contracts. This "hybrid" structure enhances clarity, maintainability, and reusability by separating concerns.

Specifically, the following core entities each have their own contract, located in `apps/contracts/src/core/`:

*   **`Candidate.sol`**: Manages candidate-specific data and logic.
*   **`Election.sol`**: Handles election parameters, state, and voting mechanisms.
*   **`Party.sol`**: Defines political parties and their associated information.
*   **`Voter.sol`**: Manages voter registration, verification, and eligibility.

This separation allows for independent development, testing, and potential upgrades of each component, while the main `VotingSystem.sol` contract orchestrates interactions between these core modules.

### `Voter.sol`

This file defines the `Voter` struct, which is a fundamental data structure used to manage voter status within the election system. It is not a contract itself, but rather a blueprint for voter objects.

**Key Fields:**

*   `registered` (bool): Indicates whether a voter has been officially registered for an election.
*   `voted` (bool): Tracks whether a registered voter has already cast their vote in a particular election.

### `Candidate.sol`

This file defines the `Candidate` struct, representing a candidate participating in an election. Similar to `Voter.sol`, this is a data structure definition, not a deployable contract.

**Key Fields:**

*   `id` (uint): A unique identifier for the candidate within their party.
*   `name` (string): The full name of the candidate.
*   `position` (string): The position the candidate is running for (e.g., "President", "Secretary").
*   `cid` (string): An IPFS Content Identifier (CID) pointing to additional candidate information, such as an image or detailed profile.

### `Party.sol`

The `Party` contract manages political parties, their details, and the candidates associated with them. Each `Party` contract is deployed independently and is responsible for its own set of candidates.

**State Variables:**

*   `name` (string): The name of the political party.
*   `slogan` (string): The party's slogan.
*   `cid` (string): An IPFS Content Identifier (CID) for the party's logo or other related media.
*   `admin` (address): The address of the administrator who deployed this party contract and has privileges to register candidates.
*   `candidateCount` (uint): A counter for the total number of candidates registered under this party.
*   `candidates` (mapping(uint => Candidate)): A mapping from a candidate ID to their `Candidate` struct.
*   `candidateExists` (mapping(string => bool)): A private mapping to prevent duplicate candidate names.

**Events:**

*   `CandidateRegistered(uint indexed candidateId, string name)`: Emitted when a new candidate is successfully registered.

**Functions:**

*   `constructor(string memory _name, string memory _slogan, string memory _cid)`: Initializes the party with a name, slogan, CID, and sets the deployer as the admin.
*   `registerCandidate(string memory _name, string memory _position, string memory _cid) external onlyAdmin returns (uint)`: Allows the admin to register a new candidate for the party. Requires a unique candidate name.
*   `getCandidate(uint _candidateId) external view returns (uint id, string memory name, string memory position, string memory cid)`: Retrieves the details of a specific candidate by their ID.
*   `getAllCandidates() external view returns (uint[] memory ids, string[] memory names, string memory positions, string memory cids)`: Returns arrays containing the details of all registered candidates for the party.

### `Election.sol`

The `Election` contract manages the lifecycle of a single election, including its start and end times, participating parties, voter registration, and vote casting. It relies on the `Voter` struct and interacts with `Party` contracts.

**State Variables:**

*   `admin` (address): The address of the election administrator, typically the deployer of this contract.
*   `startTime` (uint): The Unix timestamp when the election officially begins.
*   `endTime` (uint): The Unix timestamp when the election officially ends.
*   `electionStarted` (bool): A flag indicating whether the election has started.
*   `electionEnded` (bool): A flag indicating whether the election has ended.
*   `cid` (string): An IPFS Content Identifier (CID) for election-related media or information.
*   `participatingParties` (mapping(address => bool)): A mapping to track which `Party` contracts are participating in this election.
*   `partyCandidateVoteCounts` (mapping(address => mapping(uint => uint))): Stores the vote counts for each candidate within each participating party. `partyAddress => candidateId => voteCount`.
*   `voters` (mapping(address => Voter)): Manages the registration and voting status of individual voters using the `Voter` struct.

**Events:**

*   `ElectionStarted(uint startTime, uint endTime)`: Emitted when the election officially begins.
*   `PartyAdded(address indexed party)`: Emitted when a party is successfully added to the election.
*   `VoterRegistered(address indexed voter)`: Emitted when a voter is successfully registered.
*   `VoteCast(address indexed voter, address indexed party, uint candidateId)`: Emitted when a voter successfully casts a vote.
*   `ElectionEnded()`: Emitted when the election officially ends.

**Modifiers:**

*   `onlyAdmin()`: Restricts function access to the `admin` address.
*   `onlyDuringElection()`: Ensures a function can only be called during the active election period.
*   `onlyRegisteredVoter()`: Ensures a function can only be called by a registered voter.
*   `hasNotVoted()`: Ensures a function can only be called by a registered voter who has not yet voted.
*   `onlyAfterElection()`: Ensures a function can only be called after the election has ended.

**Functions:**

*   `constructor(address _admin, string memory _cid)`: Initializes the election with an administrator and an IPFS CID.
*   `startElection(uint _startTime, uint _endTime) external onlyAdmin`: Sets the start and end times for the election and marks it as started.
*   `endElection() external onlyAdmin onlyAfterElection`: Marks the election as ended.
*   `addParty(address _party) external onlyAdmin`: Adds a `Party` contract to the list of participating parties.
*   `registerVoter(address _voter) external onlyAdmin`: Registers a voter for the election.
*   `vote(address _party, uint _candidateId) external onlyRegisteredVoter hasNotVoted onlyDuringElection`: Allows a registered and unvoted voter to cast a vote for a specific candidate in a party.
*   `getVoteCount(address _party, uint _candidateId) external view returns (uint)`: Returns the current vote count for a given candidate in a party.
*   `getElectionResults() external view onlyAfterElection returns (address[] memory parties, uint[][] memory candidateIds, uint[][] memory voteCounts)`: (Currently a simplified implementation) Returns the results of the election after it has ended.

### `ElectionManager.sol`

The `ElectionManager` contract serves as the central hub for creating and managing elections and political parties within the blockchain voting system. It acts as a factory for `Election` and `Party` contracts.

**State Variables:**

*   `admin` (address): The address of the administrator who deployed this contract and has the authority to create new elections and parties.
*   `electionCount` (uint): A counter for the total number of elections created through this manager.
*   `partyCount` (uint): A counter for the total number of parties created through this manager.
*   `elections` (mapping(uint => Election)): A mapping from an election ID to its corresponding `Election` contract address.
*   `parties` (mapping(uint => Party)): A mapping from a party ID to its corresponding `Party` contract address.

**Events:**

*   `ElectionCreated(uint indexed electionId, address electionAddress)`: Emitted when a new election contract is successfully created.
*   `PartyCreated(uint indexed partyId, address partyAddress)`: Emitted when a new party contract is successfully created.

**Modifiers:**

*   `onlyAdmin()`: Restricts function access to the `admin` address.

**Functions:**

*   `constructor()`: Sets the deployer of this contract as the `admin`.
*   `createElection(string memory _cid) external onlyAdmin returns (uint)`: Creates a new `Election` contract, assigns it a unique ID, and returns the ID. The `_cid` parameter is an IPFS CID for election-related media.
*   `createParty(string memory _name, string memory _slogan, string memory _cid) external onlyAdmin returns (uint)`: Creates a new `Party` contract, assigns it a unique ID, and returns the ID. The `_name`, `_slogan`, and `_cid` parameters are for the party's details.
*   `getElection(uint _electionId) external view returns (address)`: Retrieves the address of an `Election` contract given its ID.
*   `getParty(uint _partyId) external view returns (address)`: Retrieves the address of a `Party` contract given its ID.


### `Election.sol`

The `Election` contract manages the lifecycle of a single election, including its start and end times, participating parties, voter registration, and vote casting. It relies on the `Voter` struct and interacts with `Party` contracts.

**State Variables:**

*   `admin` (address): The address of the election administrator, typically the deployer of this contract.
*   `startTime` (uint): The Unix timestamp when the election officially begins.
*   `endTime` (uint): The Unix timestamp when the election officially ends.
*   `electionStarted` (bool): A flag indicating whether the election has started.
*   `electionEnded` (bool): A flag indicating whether the election has ended.
*   `cid` (string): An IPFS Content Identifier (CID) for election-related media or information.
*   `participatingParties` (mapping(address => bool)): A mapping to track which `Party` contracts are participating in this election.
*   `partyCandidateVoteCounts` (mapping(address => mapping(uint => uint))): Stores the vote counts for each candidate within each participating party. `partyAddress => candidateId => voteCount`.
*   `voters` (mapping(address => Voter)): Manages the registration and voting status of individual voters using the `Voter` struct.

**Events:**

*   `ElectionStarted(uint startTime, uint endTime)`: Emitted when the election officially begins.
*   `PartyAdded(address indexed party)`: Emitted when a party is successfully added to the election.
*   `VoterRegistered(address indexed voter)`: Emitted when a voter is successfully registered.
*   `VoteCast(address indexed voter, address indexed party, uint candidateId)`: Emitted when a voter successfully casts a vote.
*   `ElectionEnded()`: Emitted when the election officially ends.

**Modifiers:**

*   `onlyAdmin()`: Restricts function access to the `admin` address.
*   `onlyDuringElection()`: Ensures a function can only be called during the active election period.
*   `onlyRegisteredVoter()`: Ensures a function can only be called by a registered voter.
*   `hasNotVoted()`: Ensures a function can only be called by a registered voter who has not yet voted.
*   `onlyAfterElection()`: Ensures a function can only be called after the election has ended.

**Functions:**

*   `constructor(address _admin, string memory _cid)`: Initializes the election with an administrator and an IPFS CID.
*   `startElection(uint _startTime, uint _endTime) external onlyAdmin`: Sets the start and end times for the election and marks it as started.
*   `endElection() external onlyAdmin onlyAfterElection`: Marks the election as ended.
*   `addParty(address _party) external onlyAdmin`: Adds a `Party` contract to the list of participating parties.
*   `registerVoter(address _voter) external onlyAdmin`: Registers a voter for the election.
*   `vote(address _party, uint _candidateId) external onlyRegisteredVoter hasNotVoted onlyDuringElection`: Allows a registered and unvoted voter to cast a vote for a specific candidate in a party.
*   `getVoteCount(address _party, uint _candidateId) external view returns (uint)`: Returns the current vote count for a given candidate in a party.
*   `getElectionResults() external view onlyAfterElection returns (address[] memory parties, uint[][] memory candidateIds, uint[][] memory voteCounts)`: (Currently a simplified implementation) Returns the results of the election after it has ended.