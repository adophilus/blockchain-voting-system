# Development Tasks and Flow

This document outlines the refined flow of operations for the Blockchain Voting System, incorporating considerations for a more comprehensive system design. It also includes questions raised during the review process to ensure all aspects are addressed.

## Review Questions

During the review of the initial flow, the following questions and considerations were raised:









## Refined Flow of Operations

Based on the above considerations, here is a refined flow of operations for the Blockchain Voting System:

1.  **Admin creates an election:** The administrator initiates a new election by specifying its name, a detailed description, the official start and end times (Unix timestamps), and an IPFS Content Identifier (CID) for any election-related media or information. Candidates define their own positions.

2.  **Admin creates political parties:** For each political entity participating in the election, the administrator creates a new `Party` contract. This involves providing the party's name, a slogan, and an IPFS CID for its logo or other related media.

3.  **Admin adds parties to the election:** The administrator then associates the newly created `Party` contracts with the specific election. This step registers which parties are officially participating in the current election.

4.  **Admin registers candidates to parties:** Within each participating party, the administrator registers individual candidates. For each candidate, their name, the position they are running for, and an IPFS CID for their detailed profile or image are provided.

5.  **Admin registers voters to the election:** The administrator registers eligible voters by providing their unique blockchain addresses. For the current scope of this project, the voter's address serves as their primary identification for registration.

6.  **Voters cast their votes:** During the active election period, voters access the web application (e.g., via a provided voting link). They connect their blockchain wallet, which serves as their authentication mechanism (the system verifies if the connected address is a registered voter). Once authenticated, voters can select their preferred party and candidate, and then submit a transaction to the `Election.vote` function on the blockchain.

7.  **Admin ends the election:** After the `endTime` of the election has passed, the administrator explicitly calls the `endElection()` function on the `Election` contract to formally conclude the voting period.

8.  **Election results are tallied and displayed:** Once the election has officially ended, the web application retrieves the final vote counts and results by calling the `getElectionResults()` function on the `Election` contract. This function now returns a comprehensive breakdown of votes per candidate within each participating party. These results are then presented to the public in a clear and transparent manner.