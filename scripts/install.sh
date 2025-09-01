#!/bin/bash

echo "Installing Blockchain Voting System dependencies..."

# Check if nix is installed
if ! command -v nix &> /dev/null
then
    echo "Nix could not be found. Please install it first:"
    echo "  Visit: https://nixos.org/download.html"
    exit 1
fi

# Check if direnv is installed
if ! command -v direnv &> /dev/null
then
    echo "direnv could not be found. Please install it first:"
    echo "  Visit: https://direnv.net/"
    exit 1
fi

# Check if process-compose is installed
if ! command -v process-compose &> /dev/null
then
    echo "process-compose could not be found. Please install it first:"
    echo "  Visit: https://github.com/F1bonacc1/process-compose"
    exit 1
fi

# Initialize nix flake
echo "Initializing Nix flake..."
nix flake update

# Enter the development environment
echo "Entering development environment..."
direnv allow
eval "$(direnv export bash)"

# Install pnpm dependencies
echo "Installing pnpm dependencies..."
pnpm install

echo "Installation complete!"
echo "Run 'pnpm dev' to start the development environment"