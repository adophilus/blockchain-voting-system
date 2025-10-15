// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {Election} from "../src/core/election/Election.sol";
import {Party} from "../src/core/party/Party.sol";
import {VoterRegistry} from "../src/core/voter/registry/VoterRegistry.sol";
import "../src/common/Errors.sol";

contract ElectionTest is Test {
    Election public election;
    VoterRegistry public voterRegistry;

    function setUp() public {
        voterRegistry = new VoterRegistry();
        election = new Election(
            address(this),
            "Test Election",
            "Description",
            "QmTestElectionCID",
            address(voterRegistry)
        );
    }

    function test_ElectionCreation() public view {
        assertEq(election.admin(), address(this));
        assertEq(election.cid(), "QmTestElectionCID");
        assertEq(election.name(), "Test Election");
        assertEq(election.description(), "Description");
    }

    function test_StartElection() public {
        uint startTime = block.timestamp + 100;
        uint endTime = block.timestamp + 200;

        election.startElection(startTime, endTime);

        assertEq(election.startTime(), startTime);
        assertEq(election.endTime(), endTime);
        assertTrue(election.electionStarted());
    }

    function test_RevertWhen_StartElectionInvalidTimes() public {
        uint startTime = block.timestamp + 100;
        uint endTime = block.timestamp + 50; // End time before start time

        vm.expectRevert(EndTimeBeforeStartTime.selector);
        election.startElection(startTime, endTime);
    }

    function test_AddParty() public {
        address testParty = address(0x1234);
        election.startElection(block.timestamp + 100, block.timestamp + 200);
        election.addParty(testParty);

        assertTrue(election.participatingParties(testParty));
    }
}
