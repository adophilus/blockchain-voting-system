// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {Party} from "../src/core/party/Party.sol";
import {CandidateRegistry} from "../src/core/candidate/registry/CandidateRegistry.sol";
import {Config} from "./Config.sol";
import "../src/common/Errors.sol";

contract PartyTest is Test {
    Party public party;
    CandidateRegistry public candidateRegistry;

    function setUp() public {
        vm.startPrank(Config.ADMIN);

        candidateRegistry = new CandidateRegistry(msg.sender);
        party = new Party(
            "Test Party",
            "Test Slogan",
            "QmTestPartyCID",
            address(candidateRegistry),
            Config.ADMIN
        );
    }

    function test_PartyCreation() public view {
        assertEq(party.name(), "Test Party");
        assertEq(party.slogan(), "Test Slogan");
        assertEq(party.cid(), "QmTestPartyCID");
    }

    function test_RegisterCandidate() public {
        uint registeredCandidateId = candidateRegistry.registerCandidate(
            "John Doe",
            "President",
            "QmTestCandidateCID"
        );
        uint candidateId = party.registerCandidate(registeredCandidateId);
        assertEq(candidateId, registeredCandidateId);
        assertEq(party.candidateCount(), 1);

        (
            uint id,
            string memory name,
            string memory position,
            string memory cid
        ) = party.getCandidate(registeredCandidateId);
        assertEq(id, registeredCandidateId);
        assertEq(name, "John Doe");
        assertEq(position, "President");
        assertEq(cid, "QmTestCandidateCID");
    }

    function test_RevertWhen_RegisterCandidateDuplicateName() public {
        uint candidateId1 = candidateRegistry.registerCandidate(
            "John Doe",
            "President",
            "QmTestCandidateCID1"
        );
        party.registerCandidate(candidateId1);
        vm.expectRevert(CandidateAlreadyRegistered.selector);
        party.registerCandidate(candidateId1);
    }

    function test_GetAllCandidates() public {
        uint candidateId1 = candidateRegistry.registerCandidate(
            "John Doe",
            "President",
            "QmTestCandidateCID1"
        );
        party.registerCandidate(candidateId1);
        uint candidateId2 = candidateRegistry.registerCandidate(
            "Jane Smith",
            "Vice President",
            "QmTestCandidateCID2"
        );
        party.registerCandidate(candidateId2);

        (
            uint[] memory ids,
            string[] memory names,
            string[] memory positions,
            string[] memory cids
        ) = party.getAllCandidates();
        assertEq(ids.length, 2);
        assertEq(names.length, 2);
        assertEq(positions.length, 2);
        assertEq(cids.length, 2);

        assertEq(ids[0], candidateId1);
        assertEq(names[0], "John Doe");
        assertEq(positions[0], "President");
        assertEq(cids[0], "QmTestCandidateCID1");

        assertEq(ids[1], candidateId2);
        assertEq(names[1], "Jane Smith");
        assertEq(positions[1], "Vice President");
        assertEq(cids[1], "QmTestCandidateCID2");
    }
}
