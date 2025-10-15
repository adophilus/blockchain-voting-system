// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Candidate} from "../Candidate.sol";
import "../../../common/Errors.sol";
import {ICandidateRegistry} from "./ICandidateRegistry.sol";
import {AccessControl} from "openzeppelin-contracts/contracts/access/AccessControl.sol";

contract CandidateRegistry is ICandidateRegistry, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    uint public nextCandidateId;
    mapping(uint => Candidate) public candidates;

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, __msgSender()), NotAdmin());
        _;
    }

    function __msgSender() internal view virtual returns (address) {
        return tx.origin;
    }

    constructor(address _admin) {
        _grantRole(ADMIN_ROLE, _admin);
        nextCandidateId = 1;
    }

    function registerCandidate(
        string memory _name,
        string memory _position,
        string memory _cid
    ) external onlyAdmin returns (uint) {
        if (bytes(_name).length == 0) revert EmptyName();
        // In a real system, you might want to check for duplicate names or other unique identifiers
        // For simplicity, we'll allow multiple candidates with the same name for now, but with unique IDs

        uint currentId = nextCandidateId;
        candidates[currentId] = Candidate(currentId, _name, _position, _cid);
        nextCandidateId++;
        emit CandidateRegistered(currentId, _name);
        return currentId;
    }

    function updateCandidate(
        uint _candidateId,
        string memory _name,
        string memory _position,
        string memory _cid
    ) external onlyAdmin {
        if (_candidateId == 0 || _candidateId >= nextCandidateId)
            revert InvalidCandidateId();
        if (bytes(_name).length == 0) revert EmptyName();

        candidates[_candidateId].name = _name;
        candidates[_candidateId].position = _position;
        candidates[_candidateId].cid = _cid;
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
            string memory cid
        )
    {
        if (_candidateId == 0 || _candidateId >= nextCandidateId)
            revert InvalidCandidateId();
        Candidate memory c = candidates[_candidateId];
        return (c.id, c.name, c.position, c.cid);
    }
}
