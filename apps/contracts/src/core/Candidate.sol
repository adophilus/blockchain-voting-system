// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

struct Candidate {
    uint id;
    string name;
    string position;
    string cid; // IPFS CID for candidate image or profile
}