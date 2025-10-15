// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../../../common/Errors.sol";
import {IVoterRegistry} from "./IVoterRegistry.sol";
import {AccessControl} from "openzeppelin-contracts/contracts/access/AccessControl.sol";

contract VoterRegistry is IVoterRegistry, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    mapping(address => bool) public registeredVoters;

    modifier onlyAdmin() {
        _checkRole(ADMIN_ROLE);
        _;
    }

    constructor(address _admin) {
        _grantRole(ADMIN_ROLE, _admin);
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
