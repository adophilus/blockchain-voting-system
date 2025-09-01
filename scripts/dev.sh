#!/bin/bash

# Start the development environment with process-compose
echo "Starting development environment..."

# Check if process-compose is installed
if ! command -v process-compose &> /dev/null
then
    echo "process-compose could not be found. Please install it first:"
    echo "  Visit: https://github.com/F1bonacc1/process-compose"
    exit 1
fi

# Check if we're in the nix development environment
if [[ -z "$IN_NIX_SHELL" ]]; then
    echo "Warning: Not in Nix development environment. Entering now..."
    exec direnv exec . bash -c "process-compose up"
fi

# Create IPFS directory if it doesn't exist
mkdir -p ~/.ipfs

# Start process-compose
process-compose up