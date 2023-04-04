// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;
import "../Employee.sol";

contract EmployeeRegistry {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    mapping(address => address) registeredEmployeesmap;
    address[] registeredEmployees;

    function registerEmployee(
        address EthAddress,
        string memory Name,
        string memory Location,
        string memory Description
    ) public onlyOwner {
        Employee newEmployee = new Employee(owner, EthAddress, Name, Location, Description);
        registeredEmployeesmap[EthAddress] = address(newEmployee);
        registeredEmployees.push(EthAddress);
    }

    function isEmployee(address _employeeAddress) public view returns (bool) {
        return registeredEmployeesmap[_employeeAddress] != address(0x0);
    }

    function employeeCount() public view returns (uint256) {
        return registeredEmployees.length;
    }

    function getEmployeeContractByAddress(address _employee) public view returns (address) {
        return registeredEmployeesmap[_employee];
    }

    function getEmployeeContractByIndex(uint256 index) public view returns (address) {
        return getEmployeeContractByAddress(registeredEmployees[index]);
    }
}
