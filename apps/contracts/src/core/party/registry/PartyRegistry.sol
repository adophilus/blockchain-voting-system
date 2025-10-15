// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Party} from "../Party.sol";
import {CandidateRegistry} from "../../candidate/registry/CandidateRegistry.sol";
import {InvalidPartyId, NotAdmin} from "../../../common/Errors.sol";
import "./IPartyRegistry.sol";

contract PartyRegistry is IPartyRegistry {
    address public admin;
    uint public partyCount;
    mapping(uint => address) public parties;
    mapping(address => bool) public isParty;

    address public candidateRegistryAddress;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(
        address _candidateRegistryAddress,
        address _admin
    ) {
        candidateRegistryAddress = _candidateRegistryAddress;
        admin = _admin;
    }

    function createParty(
        string memory _name,
        string memory _slogan,
        string memory _cid
    ) external onlyAdmin returns (uint partyId, address partyAddress) {
        partyCount++;
        Party newParty = new Party(
            _name,
            _slogan,
            _cid,
            candidateRegistryAddress,
            msg.sender // admin
        );

        parties[partyCount] = address(newParty);
        isParty[address(newParty)] = true;

        emit PartyCreated(partyCount, address(newParty));
        return (partyCount, address(newParty));
    }

    function getParty(uint _partyId) external view returns (address) {
        if (_partyId == 0 || _partyId > partyCount) revert InvalidPartyId();
        return parties[_partyId];
    }

    function getPartyCount() external view returns (uint) {
        return partyCount;
    }
}

