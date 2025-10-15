// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Election} from "../Election.sol";
import {VoterRegistry} from "../../voter/registry/VoterRegistry.sol";
import {InvalidElectionId, NotAdmin} from "../../../common/Errors.sol";
import "./IElectionRegistry.sol";
import {AccessControl} from "openzeppelin-contracts/contracts/access/AccessControl.sol";

contract ElectionRegistry is IElectionRegistry, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    uint public electionCount;
    mapping(uint => address) public elections;
    mapping(address => bool) public isElection;

    address public voterRegistryAddress;

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, __msgSender()), NotAdmin());
        _;
    }

    function __msgSender() internal view virtual returns (address) {
        return tx.origin;
    }

    constructor(address _voterRegistryAddress, address _primaryAdmin, address _secondaryAdmin) {
        _grantRole(ADMIN_ROLE, _primaryAdmin);
        if (_secondaryAdmin != address(0)) {
            _grantRole(ADMIN_ROLE, _secondaryAdmin);
        }
        voterRegistryAddress = _voterRegistryAddress;
    }

    function createElection(
        string memory _name,
        string memory _description,
        string memory _cid
    ) external onlyAdmin returns (uint electionId, address electionAddress) {
        electionCount++;
        Election newElection = new Election(
            msg.sender, // admin
            _name,
            _description,
            _cid,
            voterRegistryAddress
        );
        
        elections[electionCount] = address(newElection);
        isElection[address(newElection)] = true;
        
        emit ElectionCreated(electionCount, address(newElection));
        return (electionCount, address(newElection));
    }

    function getElection(uint _electionId) external view returns (address) {
        if (_electionId == 0 || _electionId > electionCount) revert InvalidElectionId();
        return elections[_electionId];
    }

    function getElectionCount() external view returns (uint) {
        return electionCount;
    }
}