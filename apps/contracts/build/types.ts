//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CandidateRegistry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const candidateRegistryAbi = [
  {
    type: 'constructor',
    inputs: [{ name: '_admin', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'admin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'candidates',
    outputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'position', internalType: 'string', type: 'string' },
      { name: 'cid', internalType: 'string', type: 'string' },
      { name: 'partyId', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_candidateId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getCandidate',
    outputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'position', internalType: 'string', type: 'string' },
      { name: 'cid', internalType: 'string', type: 'string' },
      { name: 'partyId', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_candidateId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPartyIdForCandidate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'nextCandidateId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_position', internalType: 'string', type: 'string' },
      { name: '_cid', internalType: 'string', type: 'string' },
      { name: '_partyId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'registerCandidate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_candidateId', internalType: 'uint256', type: 'uint256' },
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_position', internalType: 'string', type: 'string' },
      { name: '_cid', internalType: 'string', type: 'string' },
      { name: '_partyId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateCandidate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'candidateId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'CandidateRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'candidateId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'CandidateUpdated',
  },
  { type: 'error', inputs: [], name: 'EmptyName' },
  { type: 'error', inputs: [], name: 'InvalidCandidateId' },
  { type: 'error', inputs: [], name: 'InvalidPartyId' },
  { type: 'error', inputs: [], name: 'NotAdmin' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Election
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const electionAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_description', internalType: 'string', type: 'string' },
      { name: '_cid', internalType: 'string', type: 'string' },
      {
        name: '_voterRegistryAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: '_admin', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_party', internalType: 'address', type: 'address' }],
    name: 'addParty',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'admin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cid',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'description',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'electionEnded',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'electionStarted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'endElection',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'endTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getElectionResults',
    outputs: [
      { name: '_parties', internalType: 'address[]', type: 'address[]' },
      {
        name: '_candidateIds',
        internalType: 'uint256[][]',
        type: 'uint256[][]',
      },
      { name: '_voteCounts', internalType: 'uint256[][]', type: 'uint256[][]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_party', internalType: 'address', type: 'address' },
      { name: '_candidateId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getVoteCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'hasVoted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'participatingParties',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'participatingPartyAddresses',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'partyCandidateVoteCounts',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_voter', internalType: 'address', type: 'address' }],
    name: 'registerVoterForElection',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'registeredVoters',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_startTime', internalType: 'uint256', type: 'uint256' },
      { name: '_endTime', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'startElection',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'startTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_party', internalType: 'address', type: 'address' },
      { name: '_candidateId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'voterRegistryAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'ElectionEnded' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'startTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'endTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ElectionStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'party',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'PartyAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'party',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'candidateId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'VoteCast',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'VoterRegistered',
  },
  { type: 'error', inputs: [], name: 'AlreadyVoted' },
  { type: 'error', inputs: [], name: 'ElectionAlreadyStarted' },
  { type: 'error', inputs: [], name: 'ElectionNotEnded' },
  { type: 'error', inputs: [], name: 'ElectionNotStarted' },
  { type: 'error', inputs: [], name: 'EndTimeBeforeStartTime' },
  { type: 'error', inputs: [], name: 'ErrorElectionEnded' },
  { type: 'error', inputs: [], name: 'InvalidCandidate' },
  { type: 'error', inputs: [], name: 'InvalidPartyAddress' },
  { type: 'error', inputs: [], name: 'NotAdmin' },
  { type: 'error', inputs: [], name: 'NotWithinElectionPeriod' },
  { type: 'error', inputs: [], name: 'PartyNotParticipating' },
  { type: 'error', inputs: [], name: 'StartTimeNotInFuture' },
  { type: 'error', inputs: [], name: 'VoterAlreadyRegisteredForElection' },
  { type: 'error', inputs: [], name: 'VoterNotInRegistry' },
  { type: 'error', inputs: [], name: 'VoterNotRegisteredForElection' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ElectionRegistry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const electionRegistryAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_voterRegistryAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: '_admin', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'admin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_description', internalType: 'string', type: 'string' },
      { name: '_cid', internalType: 'string', type: 'string' },
    ],
    name: 'createElection',
    outputs: [
      { name: 'electionId', internalType: 'uint256', type: 'uint256' },
      { name: 'electionAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'electionCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'elections',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_electionId', internalType: 'uint256', type: 'uint256' }],
    name: 'getElection',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getElectionCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isElection',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'voterRegistryAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'electionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'electionAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ElectionCreated',
  },
  { type: 'error', inputs: [], name: 'InvalidElectionId' },
  { type: 'error', inputs: [], name: 'NotAdmin' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Party
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const partyAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_slogan', internalType: 'string', type: 'string' },
      { name: '_cid', internalType: 'string', type: 'string' },
      {
        name: '_candidateRegistryAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: '_admin', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'admin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'candidateCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'candidateIds',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'candidateRegistryAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cid',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAllCandidates',
    outputs: [
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'names', internalType: 'string[]', type: 'string[]' },
      { name: 'positions', internalType: 'string[]', type: 'string[]' },
      { name: 'cids', internalType: 'string[]', type: 'string[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_candidateId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getCandidate',
    outputs: [
      { name: 'candidateId_', internalType: 'uint256', type: 'uint256' },
      { name: 'candidateName_', internalType: 'string', type: 'string' },
      { name: 'candidatePosition_', internalType: 'string', type: 'string' },
      { name: 'candidateCid_', internalType: 'string', type: 'string' },
      { name: 'candidatePartyId_', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_candidateId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'registerCandidate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'slogan',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'candidateId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'CandidateRegistered',
  },
  { type: 'error', inputs: [], name: 'CandidateAlreadyRegistered' },
  { type: 'error', inputs: [], name: 'CandidateNotRegistered' },
  { type: 'error', inputs: [], name: 'InvalidCandidateId' },
  { type: 'error', inputs: [], name: 'NotAdmin' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PartyRegistry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const partyRegistryAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_candidateRegistryAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: '_admin', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'admin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'candidateRegistryAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_slogan', internalType: 'string', type: 'string' },
      { name: '_cid', internalType: 'string', type: 'string' },
    ],
    name: 'createParty',
    outputs: [
      { name: 'partyId', internalType: 'uint256', type: 'uint256' },
      { name: 'partyAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_partyId', internalType: 'uint256', type: 'uint256' }],
    name: 'getParty',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPartyCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isParty',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'parties',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'partyCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'partyId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'partyAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'PartyCreated',
  },
  { type: 'error', inputs: [], name: 'InvalidPartyId' },
  { type: 'error', inputs: [], name: 'NotAdmin' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VoterRegistry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const voterRegistryAbi = [
  {
    type: 'constructor',
    inputs: [{ name: '_admin', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'admin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_voter', internalType: 'address', type: 'address' }],
    name: 'isVoterRegistered',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_voter', internalType: 'address', type: 'address' }],
    name: 'registerVoter',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'registeredVoters',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'VoterRegistered',
  },
  { type: 'error', inputs: [], name: 'InvalidAddress' },
  { type: 'error', inputs: [], name: 'NotAdmin' },
  { type: 'error', inputs: [], name: 'VoterAlreadyInRegistry' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VotingSystem
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const votingSystemAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_voterRegistryAddress',
        internalType: 'address',
        type: 'address',
      },
      {
        name: '_candidateRegistryAddress',
        internalType: 'address',
        type: 'address',
      },
      {
        name: '_electionRegistryAddress',
        internalType: 'address',
        type: 'address',
      },
      {
        name: '_partyRegistryAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: '_admin', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'admin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'candidateRegistryAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'electionRegistryAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'partyRegistryAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'voterRegistryAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'candidateId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'CandidateRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'electionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'electionAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ElectionCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'partyId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'partyAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'PartyCreated',
  },
] as const
