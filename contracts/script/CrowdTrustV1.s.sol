// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CrowdTrustV1} from "../src/CrowdTrustV1.sol";
import "forge-std/console2.sol";

contract CrowdTrustV1Script is Script {
    CrowdTrustV1 public crowdtrust;
    address user1 = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

    function setUp() public {}

    function run() public {
        vm.startBroadcast(user1);

        crowdtrust = new CrowdTrustV1();

        address payable tester = payable(0x886fFE3D8B8851eCDf48888D9c630afd95c85fD1);
        tester.transfer(3e18);

        vm.stopBroadcast();
    }
}
