// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {CrowdTrustV1} from "../src/CrowdTrustV1.sol";

contract CrowdTrustV1Test is Test {
    CrowdTrustV1 public crowdtrust;

    address user1 = 0x0000000000000000000000000000000000000001;
    uint64 start;
    uint64 end;
    uint256 goal;
    uint64 project_id;

    function setUp() public {
        hoax(user1, 5 ether);
        crowdtrust = new CrowdTrustV1();
        start = uint64(block.timestamp + 10 days);
        end = uint64(block.timestamp + 40 days);
        goal = 50e18;
        project_id = crowdtrust.createProject("My Project", start, end, goal);
    }

    function test_CreateProject() public view {
        assertEq(crowdtrust.version(), "1");
        CrowdTrustV1.ProjectView memory project = crowdtrust.getProject(1);
        assertEq(project.name, "My Project");
        assertEq(project.start_time, start);
        assertEq(project.end_time, end);
        assertEq(project.goal, goal);
        assertEq(project.total_pledged, 0);
    }

    function test_BackProjectEarlyError() public {
        vm.startPrank(user1);
        vm.expectRevert(bytes("Project inactive"));
        crowdtrust.backProject{value: 1e18}(project_id);
    }

    function test_BackProjectLateError() public {
        vm.startPrank(user1);
        vm.warp(end + 86400);
        vm.expectRevert(bytes("Project over"));
        crowdtrust.backProject{value: 1e18}(project_id);
    }

    function test_BackProject() public {
        vm.startPrank(user1);
        vm.warp(start + 86400);
        crowdtrust.backProject{value: 1e18}(project_id);

        uint256 pledge = crowdtrust.getPledge(project_id, user1);
        CrowdTrustV1.ProjectView memory project = crowdtrust.getProject(project_id);
        assertEq(pledge, 1e18, "Incorrect pledge");
        assertEq(project.total_pledged, 1e18, "Incorrect total_pledged");
        assertEq(address(crowdtrust).balance, 1e18, "Wrong project balance");
        assertEq(user1.balance, 4e18, "Wrong user balance");
    }

    function test_RefundProject() public {
        vm.startPrank(user1);
        vm.warp(start + 86400);
        crowdtrust.backProject{value: 1e18}(project_id);
        crowdtrust.refund(project_id, 1e18);

        uint256 pledge = crowdtrust.getPledge(project_id, user1);
        CrowdTrustV1.ProjectView memory project = crowdtrust.getProject(project_id);
        assertEq(pledge, 0, "Incorrect pledge");
        assertEq(project.total_pledged, 0, "Incorrect total_pledged");
        assertEq(address(crowdtrust).balance, 0, "Wrong project balance");
        assertEq(user1.balance, 5e18, "Wrong user balance");
    }

    function test_RefundProjectLateFail() public {
        vm.startPrank(user1);
        vm.warp(start + 86400);
        crowdtrust.backProject{value: 1e18}(project_id);

        vm.warp(end + 86400);
        vm.expectRevert(bytes("Project over"));
        crowdtrust.refund(project_id, 1e18);
    }

    function test_RefundProjectExcessFail() public {
        vm.startPrank(user1);
        vm.warp(start + 86400);
        crowdtrust.backProject{value: 1e18}(project_id);

        vm.expectRevert(bytes("Refund exceeds value"));
        crowdtrust.refund(project_id, 2e18);
    }
}
