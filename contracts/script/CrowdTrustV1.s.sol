// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CrowdTrustV1} from "../src/CrowdTrustV1.sol";

contract CrowdTrustV1Script is Script {
    CrowdTrustV1 public crowdtrust;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        crowdtrust = new CrowdTrustV1();

        vm.stopBroadcast();
    }
}
