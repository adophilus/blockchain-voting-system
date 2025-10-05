// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {ElectionManager} from "../src/core/ElectionManager.sol";

contract VotingSystemTest is Test {
    ElectionManager public electionManager;
    
    function setUp() public {
        electionManager = new ElectionManager();
    }
    
    function test_ElectionManagerCreation() public view {
        assertEq(electionManager.admin(), address(this));
    }
    
    function test_CreateElection() public {
        uint electionId = electionManager.createElection("Test Election", "Description", "QmTestElectionCID");
        assertEq(electionId, 1);
        assertEq(electionManager.electionCount(), 1);
        
        address electionAddress = electionManager.getElection(1);
        assertNotEq(electionAddress, address(0));
    }
    
    function test_CreateParty() public {
        uint partyId = electionManager.createParty("Test Party", "Test Slogan", "QmTestPartyCID");
        assertEq(partyId, 1);
        assertEq(electionManager.partyCount(), 1);
        
        address partyAddress = electionManager.getParty(1);
        assertNotEq(partyAddress, address(0));
    }
    
    function test_RevertWhen_GetInvalidElection() public {
        vm.expectRevert("Invalid election ID");
        electionManager.getElection(999);
    }
    
    function test_RevertWhen_GetInvalidParty() public {
        vm.expectRevert("Invalid party ID");
        electionManager.getParty(999);
    }
}