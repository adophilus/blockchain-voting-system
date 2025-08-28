// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Election} from "../src/Election.sol";

contract ElectionTest is Test {
    Election public election;

    function setUp() public {
        election = new Election();
        election.setNumber(0);
    }

    function test_Increment() public {
        election.increment();
        assertEq(election.number(), 1);
    }

    function testFuzz_SetNumber(uint256 x) public {
        election.setNumber(x);
        assertEq(election.number(), x);
    }
}
