// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../election/Election.sol";
import "../party/Party.sol";
import "../voter/registry/VoterRegistry.sol";
import "../candidate/registry/CandidateRegistry.sol";
import "../../../common/Errors.sol";
import "./IVotingSystem.sol";

contract VotingSystem is IVotingSystem {
    address public admin;
    uint public electionCount;
    uint public partyCount;
    
    mapping(uint => Election) public elections;
    mapping(uint => Party) public parties;
    address public voterRegistryAddress;
    address public candidateRegistryAddress;
    
    event ElectionCreated(uint indexed electionId, address electionAddress);
    event PartyCreated(uint indexed partyId, address partyAddress);
    
    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }
    
    constructor(address _voterRegistryAddress, address _candidateRegistryAddress) {
        admin = msg.sender;
        voterRegistryAddress = _voterRegistryAddress;
        candidateRegistryAddress = _candidateRegistryAddress;
    }
    
    function createElection(string memory _name, string memory _description, string memory _cid) external onlyAdmin returns (uint) {
        electionCount++;
        elections[electionCount] = new Election(admin, _name, _description, _cid, voterRegistryAddress);
        
        emit ElectionCreated(electionCount, address(elections[electionCount]));
        return electionCount;
    }
    
    function createParty(string memory _name, string memory _slogan, string memory _cid) external onlyAdmin returns (uint) {
        partyCount++;
        parties[partyCount] = new Party(_name, _slogan, _cid, candidateRegistryAddress, admin);
        
        emit PartyCreated(partyCount, address(parties[partyCount]));
        return partyCount;
    }

    function registerCandidate(string memory _name, string memory _position, string memory _cid) external onlyAdmin returns (uint) {
        CandidateRegistry candidateRegistry = CandidateRegistry(candidateRegistryAddress);
        return candidateRegistry.registerCandidate(_name, _position, _cid);
    }

    function updateCandidate(uint _candidateId, string memory _name, string memory _position, string memory _cid) external onlyAdmin {
        CandidateRegistry candidateRegistry = CandidateRegistry(candidateRegistryAddress);
        candidateRegistry.updateCandidate(_candidateId, _name, _position, _cid);
    }

    function getCandidate(uint _candidateId) external view returns (uint, string memory, string memory, string memory) {
        CandidateRegistry candidateRegistry = CandidateRegistry(candidateRegistryAddress);
        return candidateRegistry.getCandidate(_candidateId);
    }

    function isVoterVerified(address _voter) external view returns (bool) {
        VoterRegistry voterRegistry = VoterRegistry(voterRegistryAddress);
        return voterRegistry.isVoterRegistered(_voter);
    }

    function registerVoter(address _voter) external onlyAdmin {
        VoterRegistry voterRegistry = VoterRegistry(voterRegistryAddress);
        voterRegistry.registerVoter(_voter);
    }
    
    function getElection(uint _electionId) external view returns (address) {
        if (_electionId == 0 || _electionId > electionCount) revert InvalidElectionId();
        return address(elections[_electionId]);
    }
    
    function getParty(uint _partyId) external view returns (address) {
        if (_partyId == 0 || _partyId > partyCount) revert InvalidPartyId();
        return address(parties[_partyId]);
    }

    function registerVoterForElection(uint _electionId, address _voter) external onlyAdmin {
        if (_electionId == 0 || _electionId > electionCount) revert InvalidElectionId();
        Election election = elections[_electionId];
        election.registerVoterForElection(_voter);
    }
}
