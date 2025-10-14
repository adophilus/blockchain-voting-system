#!/usr/bin/env bash


forge script \
  ./script/VotingSystem.s.sol \
  --broadcast \
  --private-key $PRIVATE_KEY \
  --optimize \
  --rpc-url $RPC_URL 
