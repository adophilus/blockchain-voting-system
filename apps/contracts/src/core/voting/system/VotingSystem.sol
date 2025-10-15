// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Election} from "../../election/Election.sol";
import {Party} from "../../party/Party.sol";
import {VoterRegistry} from "../../voter/registry/VoterRegistry.sol";
import {CandidateRegistry} from "../../candidate/registry/CandidateRegistry.sol";
import "../../../common/Errors.sol";
import {IVotingSystem} from "./IVotingSystem.sol";
import {console} from "forge-std/console.sol";

contract VotingSystem is IVotingSystem {
    address public admin;
    uint public electionCount;
    uint public partyCount;

    mapping(uint => Election) internal _elections;
    mapping(uint => Party) internal _parties;

    function elections(uint _electionId) external view returns (address) {
        return address(_elections[_electionId]);
    }

    function parties(uint _partyId) external view returns (address) {
        return address(_parties[_partyId]);
    }
    address public voterRegistryAddress;
    address public candidateRegistryAddress;

    modifier onlyAdmin() {
        console.log("VotingSystem.onlyAdmin: BEGIN");
        console.log(admin);
        console.log(msg.sender);
        console.log("VotingSystem.onlyAdmin: END");
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(
        address _voterRegistryAddress,
        address _candidateRegistryAddress
    ) {
        admin = msg.sender;
        voterRegistryAddress = _voterRegistryAddress;
        candidateRegistryAddress = _candidateRegistryAddress;
    }

    function createElection(
        string memory _name,
        string memory _description,
        string memory _cid
    ) external onlyAdmin returns (uint) {
        electionCount++;
        _elections[electionCount] = new Election(
            admin,
            _name,
            _description,
            _cid,
            voterRegistryAddress
        );

        emit ElectionCreated(electionCount, address(_elections[electionCount]));
        return electionCount;
    }

    function createParty(
        string memory _name,
        string memory _slogan,
        string memory _cid
    ) external onlyAdmin returns (uint) {
        partyCount++;
        _parties[partyCount] = new Party(
            _name,
            _slogan,
            _cid,
            candidateRegistryAddress,
            admin
        );

        emit PartyCreated(partyCount, address(_parties[partyCount]));
        return partyCount;
    }

    function registerCandidate(
        string memory _name,
        string memory _position,
        string memory _cid
    ) external onlyAdmin returns (uint) {
        CandidateRegistry candidateRegistry = CandidateRegistry(
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
        CandidateRegistry candidateRegistry = CandidateRegistry(
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
        CandidateRegistry candidateRegistry = CandidateRegistry(
            candidateRegistryAddress
        );
        return candidateRegistry.getCandidate(_candidateId);
    }

    function isVoterVerified(address _voter) external view returns (bool) {
        VoterRegistry voterRegistry = VoterRegistry(voterRegistryAddress);
        return voterRegistry.isVoterRegistered(_voter);
    }

    function registerVoter(address _voter) external onlyAdmin {
        VoterRegistry voterRegistry = VoterRegistry(voterRegistryAddress);
        voterRegistry.registerVoter(_voter);
    }

    function getElection(uint _electionId) external view returns (address) {
        if (_electionId == 0 || _electionId > electionCount)
            revert InvalidElectionId();
        return address(_elections[_electionId]);
    }

    function getParty(uint _partyId) external view returns (address) {
        if (_partyId == 0 || _partyId > partyCount) revert InvalidPartyId();
        return address(_parties[_partyId]);
    }

    function registerVoterForElection(
        uint _electionId,
        address _voter
    ) external onlyAdmin {
        if (_electionId == 0 || _electionId > electionCount)
            revert InvalidElectionId();
        Election election = _elections[_electionId];
        election.registerVoterForElection(_voter);
    }
}
