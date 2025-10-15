// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {Election} from "../src/core/election/Election.sol";
import {Party} from "../src/core/party/Party.sol";
import {VoterRegistry} from "../src/core/voter/registry/VoterRegistry.sol";
import {Config} from "./Config.sol";
import "../src/common/Errors.sol";

contract ElectionTest is Test {
    Election public election;
    VoterRegistry public voterRegistry;

    function setUp() public {
        voterRegistry = new VoterRegistry(Config.ADMIN);
        election = new Election(
            "Test Election",
            "Description",
            "QmTestElectionCID",
            address(voterRegistry),
            Config.ADMIN
        );
    }

    function test_ElectionCreation() public view {
        assertEq(election.cid(), "QmTestElectionCID");
        assertEq(election.name(), "Test Election");
        assertEq(election.description(), "Description");
    }

    function test_StartElection() public {
        vm.startPrank(Config.ADMIN);

        uint startTime = block.timestamp + 100;
        uint endTime = block.timestamp + 200;

        election.startElection(startTime, endTime);

        assertEq(election.startTime(), startTime);
        assertEq(election.endTime(), endTime);
        assertTrue(election.electionStarted());
    }

    function test_RevertWhen_StartElectionInvalidTimes() public {
        vm.startPrank(Config.ADMIN);

        uint startTime = block.timestamp + 100;
        uint endTime = block.timestamp + 50; // End time before start time

        vm.expectRevert(EndTimeBeforeStartTime.selector);
        election.startElection(startTime, endTime);
    }

    function test_AddParty() public {
        vm.startPrank(Config.ADMIN);

        address testParty = address(0x1234);
        election.startElection(block.timestamp + 100, block.timestamp + 200);
        election.addParty(testParty);

        assertTrue(election.participatingParties(testParty));
    }
}
