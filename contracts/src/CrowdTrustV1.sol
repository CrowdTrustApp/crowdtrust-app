// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract CrowdTrustV1 {
    bool private _entered;

    modifier nonReentrant() {
        require(!_entered, "re-entrant blocked");
        _entered = true;
        _;
        _entered = false;
    }

    event Create(uint64 indexed project_id, address indexed owner);
    event Refund(uint64 indexed project_id, address indexed owner, uint256 amount);
    event Back(uint64 indexed project_id, address indexed owner, uint256 amount);

    struct Project {
        string name;
        uint64 start_time;
        uint64 end_time;
        uint256 goal;
        uint256 total_pledged;
        mapping(address => uint256) pledges;
    }

    struct ProjectView {
        string name;
        uint64 start_time;
        uint64 end_time;
        uint256 goal;
        uint256 total_pledged;
    }

    string public version;
    mapping(uint64 => Project) public projects;
    uint64 public next_id = 1;

    constructor() {
        version = "1";
    }

    function getProject(uint64 id) public view returns (ProjectView memory) {
        ProjectView memory project;
        project.name = projects[id].name;
        project.start_time = projects[id].start_time;
        project.end_time = projects[id].end_time;
        project.goal = projects[id].goal;
        project.total_pledged = projects[id].total_pledged;
        return project;
    }

    function getPledge(uint64 project_id, address backer) public view returns (uint256) {
        return projects[project_id].pledges[backer];
    }

    function createProject(string calldata name, uint64 start_time, uint64 end_time, uint256 goal)
        public
        returns (uint64)
    {
        uint64 id = next_id;
        projects[id].name = name;
        projects[id].start_time = start_time;
        projects[id].end_time = end_time;
        projects[id].goal = goal;
        projects[id].total_pledged = 0;
        next_id += 1;
        emit Create(id, msg.sender);
        return id;
    }

    function backProjectFor(uint64 project_id, address backer) public payable {
        require(block.timestamp > projects[project_id].start_time, "Project inactive");
        require(block.timestamp < projects[project_id].end_time, "Project over");
        require(msg.value > 0, "Missing payment");

        projects[project_id].total_pledged += msg.value;
        projects[project_id].pledges[backer] += msg.value;

        emit Back(project_id, backer, msg.value);
    }

    function backProject(uint64 project_id) public payable {
        backProjectFor(project_id, msg.sender);
    }

    function refund(uint64 project_id, uint256 amount) public nonReentrant {
        require(block.timestamp > projects[project_id].start_time, "Project inactive");
        require(block.timestamp < projects[project_id].end_time, "Project over");
        require(projects[project_id].pledges[msg.sender] >= amount, "Refund exceeds value");
        projects[project_id].total_pledged -= amount;
        projects[project_id].pledges[msg.sender] -= amount;

        (bool success,) = msg.sender.call{value: amount}("");
        require(success, "Refund failed");

        emit Refund(project_id, msg.sender, amount);
    }
}
