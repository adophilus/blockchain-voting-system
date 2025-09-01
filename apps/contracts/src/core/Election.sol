// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Voter.sol";
import "../core/Party.sol";

contract Election {
    address public admin;
    uint public startTime;
    uint public endTime;
    bool public electionStarted;
    bool public electionEnded;
    string public cid; // IPFS CID for election-related media
    
    // Mapping of parties participating in this election
    mapping(address => bool) public participatingParties;
    mapping(address => mapping(uint => uint)) public partyCandidateVoteCounts; // party => candidateId => voteCount
    
    // Voter management
    mapping(address => Voter) public voters;
    
    event ElectionStarted(uint startTime, uint endTime);
    event PartyAdded(address indexed party);
    event VoterRegistered(address indexed voter);
    event VoteCast(address indexed voter, address indexed party, uint candidateId);
    event ElectionEnded();
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }
    
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
    
    modifier onlyAfterElection() {
        require(block.timestamp > endTime, "Election not ended");
        _;
    }
    
    constructor(address _admin, string memory _cid) {
        admin = _admin;
        cid = _cid;
    }
    
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
    
    function endElection() external onlyAdmin onlyAfterElection {
        electionEnded = true;
        emit ElectionEnded();
    }
    
    function addParty(address _party) external onlyAdmin {
        require(electionStarted, "Election not started");
        require(!electionEnded, "Election ended");
        require(_party != address(0), "Invalid party address");
        
        participatingParties[_party] = true;
        emit PartyAdded(_party);
    }
    
    function registerVoter(address _voter) external onlyAdmin {
        require(!voters[_voter].registered, "Already registered");
        require(_voter != address(0), "Invalid voter address");
        voters[_voter] = Voter(true, false);
        emit VoterRegistered(_voter);
    }
    
    function vote(
        address _party,
        uint _candidateId
    ) external onlyRegisteredVoter hasNotVoted onlyDuringElection {
        require(participatingParties[_party], "Party not participating in this election");
        
        // Verify that the candidate exists in the party
        Party party = Party(_party);
        (uint id, , , ) = party.getCandidate(_candidateId);
        require(id == _candidateId, "Invalid candidate");
        
        voters[msg.sender].voted = true;
        partyCandidateVoteCounts[_party][_candidateId]++;
        
        emit VoteCast(msg.sender, _party, _candidateId);
    }
    
    function getVoteCount(address _party, uint _candidateId) external view returns (uint) {
        return partyCandidateVoteCounts[_party][_candidateId];
    }
    
    function getElectionResults() 
        external 
        view 
        onlyAfterElection 
        returns (
            address[] memory parties,
            uint[][] memory candidateIds,
            uint[][] memory voteCounts
        )
    {
        // This is a simplified implementation
        // In a real implementation, we would need to track all parties that participated
        // and all candidates that received votes
        // For now, we'll return empty arrays
        parties = new address[](0);
        candidateIds = new uint[][](0);
        voteCounts = new uint[][](0);
    }
}