

#!/bin/bash

source /root/.bashrc
anvil --chain-id 1337 --host 0.0.0.0 &

sleep 1
forge script ./script/CrowdTrustV1.s.sol:CrowdTrustV1Script --rpc-url "http://127.0.0.1:8545" --private-key "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
