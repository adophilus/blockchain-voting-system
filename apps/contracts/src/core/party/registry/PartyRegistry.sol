// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Party} from "../Party.sol";
import {CandidateRegistry} from "../../candidate/registry/CandidateRegistry.sol";
import {InvalidPartyId, NotAdmin} from "../../../common/Errors.sol";
import "./IPartyRegistry.sol";
import {AccessControl} from "openzeppelin-contracts/contracts/access/AccessControl.sol";

contract PartyRegistry is IPartyRegistry, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    uint public partyCount;
    mapping(uint => address) public parties;
    mapping(address => bool) public isParty;

    address public candidateRegistryAddress;

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, __msgSender()), NotAdmin());
        _;
    }

    function __msgSender() internal view virtual returns (address) {
        return tx.origin;
    }

    constructor(address _candidateRegistryAddress, address _primaryAdmin, address _secondaryAdmin) {
        _grantRole(ADMIN_ROLE, _primaryAdmin);
        if (_secondaryAdmin != address(0)) {
            _grantRole(ADMIN_ROLE, _secondaryAdmin);
        }
        candidateRegistryAddress = _candidateRegistryAddress;
    }

    function createParty(
        string memory _name,
        string memory _slogan,
        string memory _cid
    ) external onlyAdmin returns (uint partyId, address partyAddress) {
        partyCount++;
        Party newParty = new Party(
            _name,
            _slogan,
            _cid,
            candidateRegistryAddress,
            msg.sender // admin
        );
        
        parties[partyCount] = address(newParty);
        isParty[address(newParty)] = true;
        
        emit PartyCreated(partyCount, address(newParty));
        return (partyCount, address(newParty));
    }

    function getParty(uint _partyId) external view returns (address) {
        if (_partyId == 0 || _partyId > partyCount) revert InvalidPartyId();
        return parties[_partyId];
    }

    function getPartyCount() external view returns (uint) {
        return partyCount;
    }
}