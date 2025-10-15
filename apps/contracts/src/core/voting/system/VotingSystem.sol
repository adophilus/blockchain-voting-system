// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Election} from "../../election/Election.sol";
import {Party} from "../../party/Party.sol";
import {IVoterRegistry} from "../../voter/registry/IVoterRegistry.sol";
import {ICandidateRegistry} from "../../candidate/registry/ICandidateRegistry.sol";
import {IElectionRegistry} from "../../election/registry/IElectionRegistry.sol";
import {IPartyRegistry} from "../../party/registry/IPartyRegistry.sol";
import "../../../common/Errors.sol";
import {IVotingSystem} from "./IVotingSystem.sol";
import {console} from "forge-std/console.sol";
import {AccessControl} from "openzeppelin-contracts/contracts/access/AccessControl.sol";

contract VotingSystem is IVotingSystem, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    address public voterRegistryAddress;
    address public candidateRegistryAddress;
    address public electionRegistryAddress;
    address public partyRegistryAddress;

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, __msgSender()), NotAdmin());
        _;
    }

    function __msgSender() internal view virtual returns (address) {
        return tx.origin;
    }

    constructor(
        address _voterRegistryAddress,
        address _candidateRegistryAddress,
        address _electionRegistryAddress,
        address _partyRegistryAddress,
        address _admin
    ) {
        _grantRole(ADMIN_ROLE, _admin);
        voterRegistryAddress = _voterRegistryAddress;
        candidateRegistryAddress = _candidateRegistryAddress;
        electionRegistryAddress = _electionRegistryAddress;
        partyRegistryAddress = _partyRegistryAddress;
    }

    function createElection(
        string memory _name,
        string memory _description,
        string memory _cid
    ) external onlyAdmin returns (uint) {
        (uint electionId, address electionAddress) = IElectionRegistry(electionRegistryAddress).createElection(
            _name,
            _description,
            _cid
        );

        emit ElectionCreated(electionId, electionAddress);
        return electionId;
    }

    function createParty(
        string memory _name,
        string memory _slogan,
        string memory _cid
    ) external onlyAdmin returns (uint) {
        (uint partyId, address partyAddress) = IPartyRegistry(partyRegistryAddress).createParty(
            _name,
            _slogan,
            _cid
        );

        emit PartyCreated(partyId, partyAddress);
        return partyId;
    }

    function registerCandidate(
        string memory _name,
        string memory _position,
        string memory _cid
    ) external onlyAdmin returns (uint) {
        ICandidateRegistry candidateRegistry = ICandidateRegistry(
            candidateRegistryAddress
        );
        return candidateRegistry.registerCandidate(_name, _position, _cid);
    }

    function updateCandidate(
        uint _candidateId,
        string memory _name,
        string memory _position,
        string memory _cid
    ) external onlyAdmin {
        ICandidateRegistry candidateRegistry = ICandidateRegistry(
            candidateRegistryAddress
        );
        candidateRegistry.updateCandidate(_candidateId, _name, _position, _cid);
    }

    function getCandidate(
        uint _candidateId
    )
        external
        view
        returns (uint, string memory, string memory, string memory)
    {
        ICandidateRegistry candidateRegistry = ICandidateRegistry(
            candidateRegistryAddress
        );
        return candidateRegistry.getCandidate(_candidateId);
    }

    function isVoterVerified(address _voter) external view returns (bool) {
        IVoterRegistry voterRegistry = IVoterRegistry(voterRegistryAddress);
        return voterRegistry.isVoterRegistered(_voter);
    }

    function registerVoter(address _voter) external onlyAdmin {
        IVoterRegistry voterRegistry = IVoterRegistry(voterRegistryAddress);
        voterRegistry.registerVoter(_voter);
    }

    function getElection(uint _electionId) external view returns (address) {
        return IElectionRegistry(electionRegistryAddress).getElection(_electionId);
    }

    function getParty(uint _partyId) external view returns (address) {
        return IPartyRegistry(partyRegistryAddress).getParty(_partyId);
    }

    function registerVoterForElection(
        uint _electionId,
        address _voter
    ) external onlyAdmin {
        address electionAddress = IElectionRegistry(electionRegistryAddress).getElection(_electionId);
        if (electionAddress == address(0)) revert InvalidElectionId();
        Election election = Election(electionAddress);
        election.registerVoterForElection(_voter);
    }

    function elections(uint _electionId) external view returns (address) {
        return IElectionRegistry(electionRegistryAddress).getElection(_electionId);
    }

    function setElectionRegistry(address _newRegistry) external onlyAdmin {
        electionRegistryAddress = _newRegistry;
    }
    
    function setPartyRegistry(address _newRegistry) external onlyAdmin {
        partyRegistryAddress = _newRegistry;
    }

    function parties(uint _partyId) external view returns (address) {
        return IPartyRegistry(partyRegistryAddress).getParty(_partyId);
    }
    
    function electionCount() external view returns (uint) {
        return IElectionRegistry(electionRegistryAddress).getElectionCount();
    }

    function partyCount() external view returns (uint) {
        return IPartyRegistry(partyRegistryAddress).getPartyCount();
    }
}
