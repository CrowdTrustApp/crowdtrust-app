#!/bin/bash

pushd contracts
forge build
ABI=$(cat out/CrowdTrustV1.sol/CrowdTrustV1.json | jq '.abi')
popd

echo "export const CROWDTRUST_ABI = $ABI" > './web/app/src/util-app/blockchain/crowdtrust-abi.ts'
