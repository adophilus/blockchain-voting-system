// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {VotingSystem} from "../src/core/VotingSystem.sol";
import {VoterRegistry} from "../src/core/VoterRegistry.sol";
import {CandidateRegistry} from "../src/core/CandidateRegistry.sol";

contract VotingSystemScript is Script {
    VotingSystem public votingSystem;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        VoterRegistry voterRegistry = new VoterRegistry();
        CandidateRegistry candidateRegistry = new CandidateRegistry();

        votingSystem = new VotingSystem(address(voterRegistry), address(candidateRegistry));

        vm.stopBroadcast();
    }
}