// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../../../common/Errors.sol";
import {IVoterRegistry} from "./IVoterRegistry.sol";

contract VoterRegistry is IVoterRegistry {
    address public admin;
    mapping(address => bool) public registeredVoters;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerVoter(address _voter) external onlyAdmin {
        if (_voter == address(0)) revert InvalidAddress();
        if (registeredVoters[_voter]) revert VoterAlreadyInRegistry();
        registeredVoters[_voter] = true;
        emit VoterRegistered(_voter);
    }

    function isVoterRegistered(address _voter) external view returns (bool) {
        return registeredVoters[_voter];
    }
}
