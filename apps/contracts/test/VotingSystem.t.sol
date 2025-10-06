// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {VotingSystem} from "../src/core/VotingSystem.sol";

contract VotingSystemTest is Test {
    VotingSystem public votingSystem;

    function setUp() public {
        votingSystem = new VotingSystem();
    }

    function test_VotingSystemCreation() public view {
        assertEq(votingSystem.admin(), address(this));
    }

    function test_CreateElection() public {
        uint electionId = votingSystem.createElection(
            "Test Election",
            "Description",
            "QmTestElectionCID"
        );
        assertEq(electionId, 1);
        assertEq(votingSystem.electionCount(), 1);

        address electionAddress = votingSystem.getElection(1);
        assertNotEq(electionAddress, address(0));
    }

    function test_CreateParty() public {
        uint partyId = votingSystem.createParty(
            "Test Party",
            "Test Slogan",
            "QmTestPartyCID"
        );
        assertEq(partyId, 1);
        assertEq(votingSystem.partyCount(), 1);

        address partyAddress = votingSystem.getParty(1);
        assertNotEq(partyAddress, address(0));
    }

    function test_RevertWhen_GetInvalidElection() public {
        vm.expectRevert("Invalid election ID");
        votingSystem.getElection(999);
    }

    function test_RevertWhen_GetInvalidParty() public {
        vm.expectRevert("Invalid party ID");
        votingSystem.getParty(999);
    }
}
