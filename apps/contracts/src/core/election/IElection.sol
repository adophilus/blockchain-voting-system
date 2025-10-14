// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IElection {
    event ElectionStarted(uint startTime, uint endTime);
    event PartyAdded(address indexed party);
    event VoterRegistered(address indexed voter);
    event VoteCast(
        address indexed voter,
        address indexed party,
        uint candidateId
    );
    event ElectionEnded();

    function admin() external view returns (address);
    function startTime() external view returns (uint);
    function endTime() external view returns (uint);
    function electionStarted() external view returns (bool);
    function electionEnded() external view returns (bool);
    function name() external view returns (string memory);
    function description() external view returns (string memory);
    function cid() external view returns (string memory);
    function voterRegistryAddress() external view returns (address);
    function participatingParties(address) external view returns (bool);
    function participatingPartyAddresses(uint) external view returns (address);
    function partyCandidateVoteCounts(address, uint) external view returns (uint);
    function registeredVoters(address) external view returns (bool);
    function hasVoted(address) external view returns (bool);

    function startElection(uint _startTime, uint _endTime) external;
    function endElection() external;
    function addParty(address _party) external;
    function registerVoterForElection(address _voter) external;
    function vote(address _party, uint _candidateId) external;
    function getVoteCount(address _party, uint _candidateId) external view returns (uint);
    function getElectionResults() external view returns (address[] memory _parties, uint[][] memory _candidateIds, uint[][] memory _voteCounts);
}