import { keccak256, toHex, stringToBytes } from 'viem';

/**
 * Finds the Solidity error signature (name and arguments) that produces a given 4-byte selector hash.
 * * In Solidity, a custom error's 4-byte selector is the first 4 bytes of the Keccak-256 hash of 
 * its signature (e.g., "MyError(uint256,string)").
 *
 * @param signatures An array of potential custom error signatures (e.g., ["Unauthorized()", "InvalidInput(uint256)"]).
 * @param targetHash The 4-byte hash (selector) you are looking for (e.g., "0xde2db189").
 * @returns The matching signature string, or null if no match is found.
 */
function findMatchingErrorSignature(signatures: string[], targetHash: string): string | null {
    // Ensure the target hash is standardized to 4 bytes and lowercase for reliable comparison
    const normalizedTargetHash = targetHash.toLowerCase().substring(0, 10); // e.g., "0xde2db189"

    console.log(`Searching for signature matching target hash: ${normalizedTargetHash}`);
    console.log('----------------------------------------------------');

    for (const signature of signatures) {
        // 1. Convert the signature string into a byte array
        const signatureBytes = stringToBytes(signature);

        // 2. Compute the Keccak-256 hash of the signature bytes
        const fullHash = keccak256(signatureBytes);

        // 3. Extract the 4-byte selector (first 8 characters including '0x')
        const selector = fullHash.toLowerCase().substring(0, 10);

        console.log(`Checking signature: ${signature}`);
        console.log(`  -> Full Hash: ${fullHash}`);
        console.log(`  -> Selector:  ${selector}`);
        
        // 4. Compare the generated selector with the target hash
        if (selector === normalizedTargetHash) {
            return signature;
        }
    }
    
    return null;
}

// --- Configuration ---

// The error hash you are trying to match from your transaction revert
const REVERT_HASH = "0xde2db189";

// A list of potential error signatures from your smart contracts.
// All errors from Errors.sol have been added below.
const CANDIDATE_SIGNATURES: string[] = [
    "NotAdmin()",
    "EmptyName()",
    "InvalidCandidateId()",
    "NotWithinElectionPeriod()",
    "NotRegisteredVoter()",
    "AlreadyVoted()",
    "ElectionNotEnded()",
    "ElectionAlreadyStarted()",
    "StartTimeNotInFuture()",
    "EndTimeBeforeStartTime()",
    "ElectionNotStarted()",
    "ErrorElectionEnded()", // This is the matching signature for 0xde2db189
    "InvalidPartyAddress()",
    "InvalidVoterAddress()",
    "VoterNotInRegistry()",
    "PartyNotParticipating()",
    "InvalidCandidate()",
    "CandidateAlreadyRegistered()",
    "CandidateNotRegistered()",
    "InvalidAddress()",
    "VoterAlreadyInRegistry()",
    "InvalidElectionId()",
    "InvalidPartyId()",
    "VoterNotRegisteredForElection()",
    "VoterAlreadyRegisteredForElection()",
];

// --- Execution ---

try {
    const matchingSignature = findMatchingErrorSignature(CANDIDATE_SIGNATURES, REVERT_HASH);

    if (matchingSignature) {
        console.log('\n====================================================');
        console.log(`✨ SUCCESS! The matching error signature is: ${matchingSignature}`);
        console.log(`This corresponds to the selector hash: ${REVERT_HASH}`);
        console.log('====================================================');
    } else {
        console.log('\n----------------------------------------------------');
        console.log(`No matching signature found for hash ${REVERT_HASH} in the provided list.`);
        console.log('Please add more potential error signatures to the CANDIDATE_SIGNATURES array.');
        console.log('----------------------------------------------------');
    }
} catch (error) {
    console.error("An error occurred during hash computation:", error);
}

