// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {Party} from "../src/core/Party.sol";

contract PartyTest is Test {
    Party public party;
    
    function setUp() public {
        party = new Party("Test Party", "Test Slogan", "QmTestPartyCID");
    }
    
    function test_PartyCreation() public view {
        assertEq(party.name(), "Test Party");
        assertEq(party.slogan(), "Test Slogan");
        assertEq(party.cid(), "QmTestPartyCID");
        assertEq(party.admin(), address(this));
    }
    
    function test_RegisterCandidate() public {
        uint candidateId = party.registerCandidate("John Doe", "President", "QmTestCandidateCID");
        assertEq(candidateId, 1);
        assertEq(party.candidateCount(), 1);
        
        (uint id, string memory name, string memory position, string memory cid) = party.getCandidate(1);
        assertEq(id, 1);
        assertEq(name, "John Doe");
        assertEq(position, "President");
        assertEq(cid, "QmTestCandidateCID");
    }
    
    function test_RevertWhen_RegisterCandidateDuplicateName() public {
        party.registerCandidate("John Doe", "President", "QmTestCandidateCID1");
        vm.expectRevert("Candidate already exists");
        party.registerCandidate("John Doe", "Vice President", "QmTestCandidateCID2");
    }
    
    function test_GetAllCandidates() public {
        party.registerCandidate("John Doe", "President", "QmTestCandidateCID1");
        party.registerCandidate("Jane Smith", "Vice President", "QmTestCandidateCID2");
        
        (uint[] memory ids, string[] memory names, string[] memory positions, string[] memory cids) = party.getAllCandidates();
        assertEq(ids.length, 2);
        assertEq(names.length, 2);
        assertEq(positions.length, 2);
        assertEq(cids.length, 2);
        
        assertEq(ids[0], 1);
        assertEq(names[0], "John Doe");
        assertEq(positions[0], "President");
        assertEq(cids[0], "QmTestCandidateCID1");
        
        assertEq(ids[1], 2);
        assertEq(names[1], "Jane Smith");
        assertEq(positions[1], "Vice President");
        assertEq(cids[1], "QmTestCandidateCID2");
    }
}