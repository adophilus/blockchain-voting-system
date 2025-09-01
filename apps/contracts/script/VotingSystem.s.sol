// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {ElectionManager} from "../src/core/ElectionManager.sol";

contract VotingSystemScript is Script {
    ElectionManager public electionManager;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        electionManager = new ElectionManager();

        vm.stopBroadcast();
    }
}