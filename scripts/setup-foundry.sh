#!/usr/bin/env bash

curl -L https://foundry.paradigm.xyz | bash
echo 'PATH="/root/.foundry/bin:$PATH"' >> ~/.bashrc
echo ~/.bashrc
foundryup

