// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Errors.sol";

contract VoterRegistry {
    address public admin;
    mapping(address => bool) public verifiedVoters;

    event VoterVerified(address indexed voter);
    event VoterUnverified(address indexed voter);

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function verifyVoter(address _voter) external onlyAdmin {
        if (_voter == address(0)) revert InvalidAddress();
        if (verifiedVoters[_voter]) revert VoterAlreadyVerified();
        verifiedVoters[_voter] = true;
        emit VoterVerified(_voter);
    }

    function unverifyVoter(address _voter) external onlyAdmin {
        if (_voter == address(0)) revert InvalidAddress();
        if (!verifiedVoters[_voter]) revert VoterNotVerified();
        verifiedVoters[_voter] = false;
        emit VoterUnverified(_voter);
    }

    function isVoterVerified(address _voter) external view returns (bool) {
        return verifiedVoters[_voter];
    }
}
