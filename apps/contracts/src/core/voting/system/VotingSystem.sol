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
        admin = _admin;
        voterRegistryAddress = _voterRegistryAddress;
        candidateRegistryAddress = _candidateRegistryAddress;
        electionRegistryAddress = _electionRegistryAddress;
        partyRegistryAddress = _partyRegistryAddress;
    }
}

