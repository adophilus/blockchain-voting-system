## Overview
This project is a blockchain-based voting system, primarily focused on smart contracts written in Solidity and a web application for user interaction. It utilizes a monorepo structure managed by pnpm.

The project consists of the following main components:

- **Smart Contracts (`apps/contracts`)**:
  - **Description**: Contains the core logic for the voting system, implemented as Solidity smart contracts. These contracts manage elections, candidates, parties, and voter registration.
  - **Notable technologies used**:
    - Solidity (for smart contracts)
    - Foundry (for smart contract development, testing, and deployment)

- **IPFS (`apps/ipfs`)**:
  - **Description**: A component for interacting with IPFS (InterPlanetary File System), likely for decentralized storage of election-related data or media.
  - **Notable technologies used**:
    - JavaScript/TypeScript (based on `package.json` in the directory)

- **Web Application (`apps/webapp`)**:
  - **Description**: The user-facing interface for the voting system, allowing users to register, vote, and view results. It includes administrative panels for managing elections.
  - **Notable technologies used**:
    - Next.js (React framework)
    - TypeScript
    - Tailwind CSS (for styling)
    - pnpm (package manager)

### Monorepo Structure and Tools

- **pnpm**: Used as the package manager for the monorepo, facilitating efficient dependency management and workspace organization.
- **Foundry**: The primary development framework for Solidity smart contracts, providing tools for testing, debugging, and deployment.
- **Next.js**: The framework for building the web application, offering server-side rendering and static site generation capabilities.

### Quick Sidenotes

- To run any script for a specific package, you can use `pnpm --filter <package-name> <script-name>`. For example, `pnpm --filter @blockchain-voting-system/contracts build` (assuming a package name like `@blockchain-voting-system/contracts`).
- The project uses a `.envrc` file, suggesting `direnv` is used for managing environment variables. Commands should ideally be run with `direnv exec . <command>`.

### Deployment Guide

Deployment details are not yet fully defined but will likely involve deploying smart contracts to a blockchain network and the web application to a hosting service.