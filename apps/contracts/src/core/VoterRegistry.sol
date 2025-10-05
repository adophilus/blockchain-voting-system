// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract VoterRegistry {
    address public admin;
    mapping(address => bool) public verifiedVoters;

    event VoterVerified(address indexed voter);
    event VoterUnverified(address indexed voter);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function verifyVoter(address _voter) external onlyAdmin {
        require(_voter != address(0), "Invalid address");
        require(!verifiedVoters[_voter], "Voter already verified");
        verifiedVoters[_voter] = true;
        emit VoterVerified(_voter);
    }

    function unverifyVoter(address _voter) external onlyAdmin {
        require(_voter != address(0), "Invalid address");
        require(verifiedVoters[_voter], "Voter not verified");
        verifiedVoters[_voter] = false;
        emit VoterUnverified(_voter);
    }

    function isVoterVerified(address _voter) external view returns (bool) {
        return verifiedVoters[_voter];
    }
}
