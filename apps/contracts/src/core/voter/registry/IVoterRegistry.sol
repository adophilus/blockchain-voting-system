// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IVoterRegistry {
    event VoterRegistered(address indexed voter);

    function admin() external view returns (address);
    function registeredVoters(address) external view returns (bool);

    function registerVoter(address _voter) external;
    function isVoterRegistered(address _voter) external view returns (bool);
}