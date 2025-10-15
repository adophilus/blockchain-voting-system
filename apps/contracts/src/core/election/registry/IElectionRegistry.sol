// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IElectionRegistry {
    event ElectionCreated(uint indexed electionId, address electionAddress);

    function electionCount() external view returns (uint);
    function elections(uint) external view returns (address);
    function isElection(address) external view returns (bool);
    function voterRegistryAddress() external view returns (address);

    function createElection(
        string memory _name,
        string memory _description,
        string memory _cid
    ) external returns (uint electionId, address electionAddress);
    
    function getElection(uint _electionId) external view returns (address);
    function getElectionCount() external view returns (uint);
}