// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {VotingSystem} from "../src/core/voting/system/VotingSystem.sol";
import {VoterRegistry} from "../src/core/voter/registry/VoterRegistry.sol";
import {CandidateRegistry} from "../src/core/candidate/registry/CandidateRegistry.sol";
import {ElectionRegistry} from "../src/core/election/registry/ElectionRegistry.sol";
import {PartyRegistry} from "../src/core/party/registry/PartyRegistry.sol";
import "../src/common/Errors.sol";

contract DeployVotingSystemScript is Script {
    VotingSystem public votingSystem;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        VoterRegistry voterRegistry = new VoterRegistry(msg.sender);
        CandidateRegistry candidateRegistry = new CandidateRegistry(msg.sender);
        
        // Deploy voting system first with placeholder registry addresses
        votingSystem = new VotingSystem(
            address(voterRegistry),
            address(candidateRegistry),
            address(0), // Will set these after creating registries
            address(0), // Will set these after creating registries
            msg.sender
        );

        ElectionRegistry electionRegistry = new ElectionRegistry(address(voterRegistry), msg.sender, address(votingSystem));
        PartyRegistry partyRegistry = new PartyRegistry(address(candidateRegistry), msg.sender, address(votingSystem));

        // Update registry addresses in voting system
        votingSystem.setElectionRegistry(address(electionRegistry));
        votingSystem.setPartyRegistry(address(partyRegistry));

        vm.stopBroadcast();
    }
}

