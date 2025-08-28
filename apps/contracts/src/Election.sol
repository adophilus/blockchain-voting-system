// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Election {
    address public admin;
    uint public candidateCount;

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(string => bool) private candidateExists; // optional, for duplicate name check

    event CandidateRegistered(uint indexed candidateId, string name);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Admin functions
    function registerCandidate(string memory _name) external onlyAdmin {
        require(bytes(_name).length > 0, "Candidate name cannot be empty");
        require(!candidateExists[_name], "Candidate already exists");

        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, _name, 0);
        candidateExists[_name] = true;

        emit CandidateRegistered(candidateCount, _name);
    }

    struct Voter {
        bool registered;
        bool voted;
    }
    mapping(address => Voter) public voters;
    event VoterRegistered(address indexed voter);

    function registerVoter(address _voter) external onlyAdmin {
        require(_voter != admin, "Admin cannot be a voter");
        require(!voters[_voter].registered, "Already registered");
        require(_voter != address(0), "Invalid voter address");
        voters[_voter] = Voter(true, false);
        emit VoterRegistered(_voter);
    }

    uint public startTime;
    uint public endTime;
    bool public electionStarted;
    event ElectionStarted(uint startTime, uint endTime);

    function startElection(uint _startTime, uint _endTime) external onlyAdmin {
        require(!electionStarted, "Election already started");
        require(
            _startTime >= block.timestamp,
            "Start time must be in the future"
        );
        require(_endTime > _startTime, "End time must be after start time");

        startTime = _startTime;
        endTime = _endTime;
        electionStarted = true;

        emit ElectionStarted(_startTime, _endTime);
    }

    function getCurrentTime() public view returns (uint) {
        return block.timestamp;
    }

    // voter functions
    modifier onlyDuringElection() {
        require(
            block.timestamp >= startTime && block.timestamp <= endTime,
            "Not within election period"
        );
        _;
    }

    modifier onlyRegisteredVoter() {
        require(voters[msg.sender].registered, "Not a registered voter");
        _;
    }

    modifier hasNotVoted() {
        require(!voters[msg.sender].voted, "Already voted");
        _;
    }

    event VoteCast(address indexed voter, uint candidateId);

    function vote(
        uint _candidateId
    ) external onlyRegisteredVoter hasNotVoted onlyDuringElection {
        require(
            _candidateId > 0 && _candidateId <= candidateCount,
            "Invalid candidate"
        );

        voters[msg.sender].voted = true;
        candidates[_candidateId].voteCount++;

        emit VoteCast(msg.sender, _candidateId);
    }

    /// public view functions
    function getCandidate(
        uint _candidateId
    ) external view returns (uint id, string memory name, uint voteCount) {
        require(
            _candidateId > 0 && _candidateId <= candidateCount,
            "Invalid candidate ID"
        );
        Candidate memory c = candidates[_candidateId];
        return (c.id, c.name, c.voteCount);
    }

    function getAllCandidates()
        external
        view
        returns (
            uint[] memory ids,
            string[] memory names,
            uint[] memory voteCounts
        )
    {
        ids = new uint[](candidateCount);
        names = new string[](candidateCount);
        voteCounts = new uint[](candidateCount);

        for (uint i = 1; i <= candidateCount; i++) {
            Candidate memory c = candidates[i];
            ids[i - 1] = c.id;
            names[i - 1] = c.name;
            voteCounts[i - 1] = c.voteCount;
        }
    }

    // Election results functions
    modifier onlyAfterElection() {
        require(block.timestamp > endTime, "Election not ended");
        _;
    }

    function getResults(
        uint _candidateId
    )
        external
        view
        onlyAfterElection
        returns (string memory name, uint voteCount)
    {
        require(
            _candidateId > 0 && _candidateId <= candidateCount,
            "Invalid candidate"
        );
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.name, candidate.voteCount);
    }

    function getWinner()
        external
        view
        onlyAfterElection
        returns (uint winnerId, string memory winnerName, uint winnerVotes)
    {
        uint highestVotes = 0;
        uint winningCandidateId = 0;

        for (uint i = 1; i <= candidateCount; i++) {
            if (candidates[i].voteCount > highestVotes) {
                highestVotes = candidates[i].voteCount;
                winningCandidateId = i;
            }
        }

        require(winningCandidateId != 0, "No votes cast");

        Candidate memory winner = candidates[winningCandidateId];
        return (winner.id, winner.name, winner.voteCount);
    }

    // Utility/Internal Functions (or Modifiers)
    modifier onlyDuringVoting() {
        require(
            block.timestamp >= startTime && block.timestamp <= endTime,
            "Not during voting period"
        );
        _;
    }
}

