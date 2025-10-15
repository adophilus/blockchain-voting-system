// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IVotingSystem {
    event ElectionCreated(uint indexed electionId, address electionAddress);
    event PartyCreated(uint indexed partyId, address partyAddress);

    function electionCount() external view returns (uint);
    function partyCount() external view returns (uint);
    function elections(uint) external view returns (address);
    function parties(uint) external view returns (address);
    function voterRegistryAddress() external view returns (address);
    function candidateRegistryAddress() external view returns (address);

    function createElection(string memory _name, string memory _description, string memory _cid) external returns (uint);
    function createParty(string memory _name, string memory _slogan, string memory _cid) external returns (uint);
    function registerCandidate(string memory _name, string memory _position, string memory _cid) external returns (uint);
    function updateCandidate(uint _candidateId, string memory _name, string memory _position, string memory _cid) external;
    function getCandidate(uint _candidateId) external view returns (uint, string memory, string memory, string memory);
    function isVoterVerified(address _voter) external view returns (bool);
    function registerVoter(address _voter) external;
    function getElection(uint _electionId) external view returns (address);
    function getParty(uint _partyId) external view returns (address);
    function registerVoterForElection(uint _electionId, address _voter) external;
}
