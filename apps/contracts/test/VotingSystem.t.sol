// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {VotingSystem} from "../src/core/voting/system/VotingSystem.sol";
import {VoterRegistry} from "../src/core/voter/registry/VoterRegistry.sol";
import {CandidateRegistry} from "../src/core/candidate/registry/CandidateRegistry.sol";
import {ElectionRegistry} from "../src/core/election/registry/ElectionRegistry.sol";
import {PartyRegistry} from "../src/core/party/registry/PartyRegistry.sol";
import "../src/common/Errors.sol";
import {Config} from "./Config.sol";

contract VotingSystemTest is Test {
    VotingSystem public votingSystem;
    VoterRegistry public voterRegistry;
    CandidateRegistry public candidateRegistry;
    ElectionRegistry public electionRegistry;
    PartyRegistry public partyRegistry;

    function setUp() public {
        voterRegistry = new VoterRegistry(address(this));
        candidateRegistry = new CandidateRegistry(address(this));
        electionRegistry = new ElectionRegistry(
            address(voterRegistry),
            Config.ADMIN
        );
        partyRegistry = new PartyRegistry(
            address(candidateRegistry),
            Config.ADMIN
        );

        votingSystem = new VotingSystem(
            address(voterRegistry),
            address(candidateRegistry),
            address(electionRegistry),
            address(partyRegistry),
            Config.ADMIN
        );
    }

    function test_VotingSystemCreation() public view {
        assertEq(votingSystem.voterRegistryAddress(), address(voterRegistry));
        assertEq(
            votingSystem.candidateRegistryAddress(),
            address(candidateRegistry)
        );
        assertEq(
            votingSystem.electionRegistryAddress(),
            address(electionRegistry)
        );
        assertEq(votingSystem.partyRegistryAddress(), address(partyRegistry));
    }

    function test_CreateElection() public {
        vm.startPrank(Config.ADMIN);

        (uint electionId, ) = electionRegistry.createElection(
            "Test Election",
            "Description",
            "QmTestElectionCID"
        );
        assertEq(electionId, 1);
        assertEq(electionRegistry.getElectionCount(), 1);

        address electionAddress = electionRegistry.getElection(1);
        assertNotEq(electionAddress, address(0));
    }

    function test_CreateParty() public {
        vm.startPrank(Config.ADMIN);
        
        (uint partyId, ) = partyRegistry.createParty(
            "Test Party",
            "Test Slogan",
            "QmTestPartyCID"
        );
        assertEq(partyId, 1);
        assertEq(partyRegistry.getPartyCount(), 1);

        address partyAddress = partyRegistry.getParty(1);
        assertNotEq(partyAddress, address(0));
    }

    function test_RevertWhen_GetInvalidElection() public {
        vm.expectRevert(InvalidElectionId.selector);
        electionRegistry.getElection(999);
    }

    function test_RevertWhen_GetInvalidParty() public {
        vm.expectRevert(InvalidPartyId.selector);
        partyRegistry.getParty(999);
    }
}
