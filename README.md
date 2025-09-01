# Blockchain Voting System

A decentralized voting system built on blockchain technology.

## Development Environment

This project uses Process Compose to manage the local development environment. It orchestrates multiple services including:

1. IPFS Node (via Nix package)
2. Smart Contracts Development Environment
3. Web Application Development Server

### Prerequisites

- [Nix](https://nixos.org/download.html) with flakes enabled
- [direnv](https://direnv.net/)
- [Process Compose](https://github.com/F1bonacc1/process-compose)

### Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd blockchain-voting-system
   ```

2. Enable direnv:
   ```bash
   direnv allow
   ```

3. Install dependencies:
   ```bash
   ./scripts/install.sh
   ```

### Running the Development Environment

To start all services in development mode:

```bash
pnpm dev
```

This will start:
- IPFS node
- Smart contract development environment
- Web application development server

### Running Individual Services

You can also run individual services:

```bash
# Run only the smart contracts development environment
pnpm dev:contracts

# Run only the web application development server
pnpm dev:webapp
```

## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```