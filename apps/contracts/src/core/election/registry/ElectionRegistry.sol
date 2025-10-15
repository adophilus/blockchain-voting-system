// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Election} from "../Election.sol";
import {VoterRegistry} from "../../voter/registry/VoterRegistry.sol";
import {InvalidElectionId, NotAdmin} from "../../../common/Errors.sol";
import "./IElectionRegistry.sol";

contract ElectionRegistry is IElectionRegistry {
    uint public electionCount;
    mapping(uint => address) public elections;
    mapping(address => bool) public isElection;
    address public admin;

    address public voterRegistryAddress;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(address _voterRegistryAddress, address _admin) {
        voterRegistryAddress = _voterRegistryAddress;
        admin = _admin;
    }

    function createElection(
        string memory _name,
        string memory _description,
        string memory _cid
    ) external onlyAdmin returns (uint electionId, address electionAddress) {
        electionCount++;
        Election newElection = new Election(
            _name,
            _description,
            _cid,
            voterRegistryAddress,
            msg.sender
        );

        elections[electionCount] = address(newElection);
        isElection[address(newElection)] = true;

        emit ElectionCreated(electionCount, address(newElection));
        return (electionCount, address(newElection));
    }

    function getElection(uint _electionId) external view returns (address) {
        if (_electionId == 0 || _electionId > electionCount)
            revert InvalidElectionId();
        return elections[_electionId];
    }

    function getElectionCount() external view returns (uint) {
        return electionCount;
    }
}

