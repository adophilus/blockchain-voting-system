// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IPartyRegistry {
    event PartyCreated(uint indexed partyId, address partyAddress);

    function partyCount() external view returns (uint);
    function parties(uint) external view returns (address);
    function isParty(address) external view returns (bool);
    function candidateRegistryAddress() external view returns (address);

    function createParty(
        string memory _name,
        string memory _slogan,
        string memory _cid
    ) external returns (uint partyId, address partyAddress);
    
    function getParty(uint _partyId) external view returns (address);
    function getPartyCount() external view returns (uint);
}