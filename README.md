# Blockchain Based Voting System

## Overview

This project is a demonstration of how smart contracts can be employed in voting processes.

## Contracts

## Requirements

### In general
- [A web browser](https://www.google.com/chrome/)

### For Linux/WSL
- [direnv](https://direnv.net)
- [nix](https://github.com/DeterminateSystems/nix-installer)

### For Windows
- [nodejs](https://nodejs.org/en)
- [vite](https://vite.dev)
- [pnpm](https://pnpm.io)
- [foundry](https://book.getfoundry.sh)


## Development

### On Linux/WSL
- Install nix
- Install direnv
- Run the following command in the terminal
  ```bash
  cd '<project directory>'
  direnv allow # Only required the first time
  # Direnv should auto run
  pnpm install
  pnpm dev
  ```

### On Windows
- Install nodejs
- Install pnpm
- Install foundry
- Run the following in powershell
  ```powershell
  pnpm install
  pnpm dev
  ```
