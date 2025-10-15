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
        ElectionRegistry electionRegistry = new ElectionRegistry(
            address(voterRegistry),
            msg.sender
        );
        PartyRegistry partyRegistry = new PartyRegistry(
            address(candidateRegistry),
            msg.sender
        );

        votingSystem = new VotingSystem(
            address(voterRegistry),
            address(candidateRegistry),
            address(electionRegistry),
            address(partyRegistry),
            msg.sender
        );

        vm.stopBroadcast();
    }
}
