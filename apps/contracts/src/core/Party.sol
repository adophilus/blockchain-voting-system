// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Candidate.sol";
import "./CandidateRegistry.sol";
import "./Errors.sol";

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
        if (msg.sender != admin) revert NotAdmin();
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
        (uint candidateIdFromReg, string memory candidateNameFromReg, , ) = candidateRegistry.getCandidate(_candidateId);
        if (candidateIdFromReg != _candidateId) revert InvalidCandidateId();
        if (candidateIdExists[_candidateId]) revert CandidateAlreadyRegistered();
        
        candidateIds.push(_candidateId);
        candidateIdExists[_candidateId] = true;
        candidateCount++;
        
        emit CandidateRegistered(_candidateId, candidateNameFromReg);
        return _candidateId;
    }
    
    function getCandidate(
        uint _candidateId
    ) external view returns (uint candidateId_, string memory candidateName_, string memory candidatePosition_, string memory candidateCid_) {
        if (!candidateIdExists[_candidateId]) revert CandidateNotRegistered();
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
            (uint candidateIdFromReg, string memory candidateNameFromReg, string memory candidatePositionFromReg, string memory candidateCidFromReg) = candidateRegistry.getCandidate(candidateId);
            ids[i] = candidateIdFromReg;
            names[i] = candidateNameFromReg;
            positions[i] = candidatePositionFromReg;
            cids[i] = candidateCidFromReg;
        }
    }
}