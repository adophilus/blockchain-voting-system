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
error VoterAlreadyRegistered();
error InvalidVoterAddress();
error VoterNotVerified();
error PartyNotParticipating();
error InvalidCandidate();
error CandidateAlreadyRegistered();
error CandidateNotRegistered();
error InvalidAddress();
error VoterAlreadyVerified();
error InvalidElectionId();
error InvalidPartyId();