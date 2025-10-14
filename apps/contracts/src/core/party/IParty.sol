// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IParty {
    event CandidateRegistered(uint indexed candidateId, string name);

    function name() external view returns (string memory);
    function slogan() external view returns (string memory);
    function cid() external view returns (string memory);
    function admin() external view returns (address);
    function candidateRegistryAddress() external view returns (address);
    function candidateCount() external view returns (uint);

    function registerCandidate(uint _candidateId) external returns (uint);
    function getCandidate(uint _candidateId) external view returns (uint candidateId_, string memory candidateName_, string memory candidatePosition_, string memory candidateCid_);
    function getAllCandidates() external view returns (uint[] memory ids, string[] memory names, string[] memory positions, string[] memory cids);
}