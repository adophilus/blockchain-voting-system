// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Candidate.sol";

contract Party {
    string public name;
    string public slogan;
    string public cid; // IPFS CID for party logo or related media
    address public admin;
    uint public candidateCount;
    
    mapping(uint => Candidate) public candidates;
    mapping(string => bool) private candidateExists; // for duplicate name check
    
    event CandidateRegistered(uint indexed candidateId, string name);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }
    
    constructor(string memory _name, string memory _slogan, string memory _cid) {
        name = _name;
        slogan = _slogan;
        cid = _cid;
        admin = msg.sender;
    }
    
    function registerCandidate(string memory _name, string memory _position, string memory _cid) external onlyAdmin returns (uint) {
        require(bytes(_name).length > 0, "Candidate name cannot be empty");
        require(!candidateExists[_name], "Candidate already exists");
        
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, _name, _position, _cid);
        candidateExists[_name] = true;
        
        emit CandidateRegistered(candidateCount, _name);
        return candidateCount;
    }
    
    function getCandidate(
        uint _candidateId
    ) external view returns (uint id, string memory name, string memory position, string memory cid) {
        require(
            _candidateId > 0 && _candidateId <= candidateCount,
            "Invalid candidate ID"
        );
        Candidate memory c = candidates[_candidateId];
        return (c.id, c.name, c.position, c.cid);
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
        ids = new uint[](candidateCount);
        names = new string[](candidateCount);
        positions = new string[](candidateCount);
        cids = new string[](candidateCount);
        
        for (uint i = 1; i <= candidateCount; i++) {
            Candidate memory c = candidates[i];
            ids[i - 1] = c.id;
            names[i - 1] = c.name;
            positions[i - 1] = c.position;
            cids[i - 1] = c.cid;
        }
    }
}