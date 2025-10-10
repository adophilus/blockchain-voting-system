// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

error NotAdmin();
error EmptyName();
error InvalidCandidateId();
error NotWithinElectionPeriod();
error NotRegisteredVoter();
error AlreadyVoted();
error ElectionNotEnded();
error ElectionAlreadyStarted();
error StartTimeNotInFuture();
error EndTimeBeforeStartTime();
error ElectionNotStarted();
error ErrorElectionEnded();
error InvalidPartyAddress();
error InvalidVoterAddress();
error VoterNotRegistered();
error PartyNotParticipating();
error InvalidCandidate();
error CandidateAlreadyRegistered();
error CandidateNotRegistered();
error InvalidAddress();
error VoterAlreadyRegistered();
error InvalidElectionId();
error InvalidPartyId();
error VoterNotRegisteredForElection();
error VoterAlreadyRegisteredForElection();