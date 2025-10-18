// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IVoterRegistry} from "../../voter/registry/IVoterRegistry.sol";
import {ICandidateRegistry} from "../../candidate/registry/ICandidateRegistry.sol";
import {IElectionRegistry} from "../../election/registry/IElectionRegistry.sol";
import {IPartyRegistry} from "../../party/registry/IPartyRegistry.sol";
import {IParty} from "../../party/IParty.sol";
import "../../../common/Errors.sol";
import {IVotingSystem} from "./IVotingSystem.sol";

contract VotingSystem is IVotingSystem {
    address public admin;
    address public voterRegistryAddress;
    address public candidateRegistryAddress;
    address public electionRegistryAddress;
    address public partyRegistryAddress;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(
        address _voterRegistryAddress,
        address _candidateRegistryAddress,
        address _electionRegistryAddress,
        address _partyRegistryAddress,
        address _admin
    ) {
        voterRegistryAddress = _voterRegistryAddress;
        candidateRegistryAddress = _candidateRegistryAddress;
        electionRegistryAddress = _electionRegistryAddress;
        partyRegistryAddress = _partyRegistryAddress;
        admin = _admin;
    }

    /**
     * Registers a candidate both globally and with a specific party
     * This function coordinates the two-step process:
     * 1. Register candidate globally in CandidateRegistry
     * 2. Register candidate with specific party
     */
    function registerCandidateForParty(
        uint _partyId,
        string memory _name,
        string memory _position,
        string memory _cid
    ) external onlyAdmin returns (uint candidateId) {
        // Step 1: Register candidate globally in CandidateRegistry
        ICandidateRegistry candidateRegistry = ICandidateRegistry(candidateRegistryAddress);
        candidateId = candidateRegistry.registerCandidate(_name, _position, _cid);
        
        // Step 2: Register candidate with the specific party
        IPartyRegistry partyRegistry = IPartyRegistry(partyRegistryAddress);
        address partyAddress = partyRegistry.getParty(_partyId);
        IParty party = IParty(partyAddress);
        party.registerCandidate(candidateId);
        
        return candidateId;
    }
}