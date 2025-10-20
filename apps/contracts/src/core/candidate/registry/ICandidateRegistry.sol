// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ICandidateRegistry {
    event CandidateRegistered(uint indexed candidateId, string name);
    event CandidateUpdated(uint indexed candidateId, string name);

    function nextCandidateId() external view returns (uint);

    function candidates(
        uint
    )
        external
        view
        returns (
            uint id,
            string memory name,
            string memory position,
            string memory cid,
            uint partyId
        );

    function registerCandidate(
        string memory _name,
        string memory _position,
        string memory _cid,
        uint _partyId
    ) external returns (uint);

    function updateCandidate(
        uint _candidateId,
        string memory _name,
        string memory _position,
        string memory _cid,
        uint _partyId
    ) external;

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
        );
        
    function getPartyIdForCandidate(
        uint _candidateId
    ) external view returns (uint);
}
