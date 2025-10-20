// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Candidate} from "../Candidate.sol";
import "../../../common/Errors.sol";
import {ICandidateRegistry} from "./ICandidateRegistry.sol";
import {console} from "forge-std/console.sol";

contract CandidateRegistry is ICandidateRegistry {
    address public admin;
    uint public nextCandidateId;
    mapping(uint => Candidate) public candidates;

    modifier onlyAdmin() {
        console.log("Got here 4?");
        console.log(msg.sender);
        console.log(admin);
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(address _admin) {
        admin = _admin;
        nextCandidateId = 1;
    }

    function registerCandidate(
        string memory _name,
        string memory _position,
        string memory _cid,
        uint _partyId
    ) external onlyAdmin returns (uint) {
        console.log("Got here? 3");
        if (bytes(_name).length == 0) revert EmptyName();
        if (_partyId == 0) revert InvalidPartyId();

        uint currentId = nextCandidateId;
        candidates[currentId] = Candidate(currentId, _name, _position, _cid, _partyId);
        nextCandidateId++;
        emit CandidateRegistered(currentId, _name);
        return currentId;
    }

    function updateCandidate(
        uint _candidateId,
        string memory _name,
        string memory _position,
        string memory _cid,
        uint _partyId
    ) external onlyAdmin {
        if (_candidateId == 0 || _candidateId >= nextCandidateId)
            revert InvalidCandidateId();
        if (bytes(_name).length == 0) revert EmptyName();
        if (_partyId == 0) revert InvalidPartyId();

        candidates[_candidateId].name = _name;
        candidates[_candidateId].position = _position;
        candidates[_candidateId].cid = _cid;
        candidates[_candidateId].partyId = _partyId;
        emit CandidateUpdated(_candidateId, _name);
    }

    function getCandidate(
        uint _candidateId
    )
        external
        view
        returns (
            uint id,
            string memory name,
            string memory position,
            string memory cid,
            uint partyId
        )
    {
        if (_candidateId == 0 || _candidateId >= nextCandidateId)
            revert InvalidCandidateId();
        Candidate memory c = candidates[_candidateId];
        return (c.id, c.name, c.position, c.cid, c.partyId);
    }
    
    function getPartyIdForCandidate(
        uint _candidateId
    ) external view returns (uint) {
        if (_candidateId == 0 || _candidateId >= nextCandidateId)
            revert InvalidCandidateId();
        return candidates[_candidateId].partyId;
    }
}
