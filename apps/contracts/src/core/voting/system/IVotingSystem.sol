// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IVotingSystem {
    event ElectionCreated(uint indexed electionId, address electionAddress);
    event PartyCreated(uint indexed partyId, address partyAddress);
    event CandidateRegistered(uint indexed candidateId, string name);

    function admin() external view returns (address);
    function voterRegistryAddress() external view returns (address);
    function candidateRegistryAddress() external view returns (address);
    function electionRegistryAddress() external view returns (address);
    function partyRegistryAddress() external view returns (address);

    // Only essential functions that don't duplicate registry functionality
}