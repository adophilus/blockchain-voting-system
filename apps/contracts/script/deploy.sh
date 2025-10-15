#!/usr/bin/env bash


forge script \
  ./script/DeployVotingSystem.s.sol \
  --broadcast \
  --private-key $PRIVATE_KEY \
  --optimize \
  --rpc-url $RPC_URL 
