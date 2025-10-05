// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Candidate.sol";
import "./CandidateRegistry.sol";

contract Party {
    string public name;
    string public slogan;
    string public cid; // IPFS CID for party logo or related media
    address public admin;
    address public candidateRegistryAddress;
    uint public candidateCount;
    
    uint[] public candidateIds;
    mapping(uint => bool) private candidateIdExists;
    
    event CandidateRegistered(uint indexed candidateId, string name);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }
    
    constructor(string memory _name, string memory _slogan, string memory _cid, address _candidateRegistryAddress) {
        name = _name;
        slogan = _slogan;
        cid = _cid;
        admin = msg.sender;
        candidateRegistryAddress = _candidateRegistryAddress;
    }
    
    function registerCandidate(uint _candidateId) external onlyAdmin returns (uint) {
        CandidateRegistry candidateRegistry = CandidateRegistry(candidateRegistryAddress);
        (uint id, string memory name, , ) = candidateRegistry.getCandidate(_candidateId);
        require(id == _candidateId, "Invalid candidate ID from registry");
        require(!candidateIdExists[_candidateId], "Candidate already registered in this party");
        
        candidateIds.push(_candidateId);
        candidateIdExists[_candidateId] = true;
        candidateCount++;
        
        emit CandidateRegistered(_candidateId, name);
        return _candidateId;
    }
    
    function getCandidate(
        uint _candidateId
    ) external view returns (uint id, string memory name, string memory position, string memory cid) {
        require(candidateIdExists[_candidateId], "Candidate not registered in this party");
        CandidateRegistry candidateRegistry = CandidateRegistry(candidateRegistryAddress);
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

        CandidateRegistry candidateRegistry = CandidateRegistry(candidateRegistryAddress);

        for (uint i = 0; i < numCandidates; i++) {
            uint candidateId = candidateIds[i];
            (uint id, string memory name, string memory position, string memory cid) = candidateRegistry.getCandidate(candidateId);
            ids[i] = id;
            names[i] = name;
            positions[i] = position;
            cids[i] = cid;
        }
    }
}