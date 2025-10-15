// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {VotingSystem} from "../src/core/voting/system/VotingSystem.sol";
import {VoterRegistry} from "../src/core/voter/registry/VoterRegistry.sol";
import {CandidateRegistry} from "../src/core/candidate/registry/CandidateRegistry.sol";
import "../src/common/Errors.sol";

contract VotingSystemTest is Test {
    VotingSystem public votingSystem;
    VoterRegistry public voterRegistry;
    CandidateRegistry public candidateRegistry;

    function setUp() public {
        voterRegistry = new VoterRegistry();
        candidateRegistry = new CandidateRegistry();
        votingSystem = new VotingSystem(
            address(voterRegistry),
            address(candidateRegistry)
        );
    }

    function test_VotingSystemCreation() public view {
        assertEq(votingSystem.admin(), address(this));
        assertEq(votingSystem.voterRegistryAddress(), address(voterRegistry));
        assertEq(
            votingSystem.candidateRegistryAddress(),
            address(candidateRegistry)
        );
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
        vm.expectRevert(InvalidElectionId.selector);
        votingSystem.getElection(999);
    }

    function test_RevertWhen_GetInvalidParty() public {
        vm.expectRevert(InvalidPartyId.selector);
        votingSystem.getParty(999);
    }
}

