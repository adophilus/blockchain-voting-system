// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Election.sol";
import "./Party.sol";
import "./VoterRegistry.sol";
import "./CandidateRegistry.sol";
import "./Errors.sol";

contract VotingSystem {
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
    
    constructor() {
        admin = msg.sender;
        VoterRegistry voterRegistry = new VoterRegistry();
        voterRegistryAddress = address(voterRegistry);
        CandidateRegistry candidateRegistry = new CandidateRegistry();
        candidateRegistryAddress = address(candidateRegistry);
    }
    
    function createElection(string memory _name, string memory _description, string memory _cid) external onlyAdmin returns (uint) {
        electionCount++;
        elections[electionCount] = new Election(admin, _name, _description, _cid, voterRegistryAddress);
        
        emit ElectionCreated(electionCount, address(elections[electionCount]));
        return electionCount;
    }
    
    function createParty(string memory _name, string memory _slogan, string memory _cid) external onlyAdmin returns (uint) {
        partyCount++;
        parties[partyCount] = new Party(_name, _slogan, _cid, candidateRegistryAddress);
        
        emit PartyCreated(partyCount, address(parties[partyCount]));
        return partyCount;
    }
    
    function getElection(uint _electionId) external view returns (address) {
        if (_electionId == 0 || _electionId > electionCount) revert InvalidElectionId();
        return address(elections[_electionId]);
    }
    
    function getParty(uint _partyId) external view returns (address) {
        if (_partyId == 0 || _partyId > partyCount) revert InvalidPartyId();
        return address(parties[_partyId]);
    }
}