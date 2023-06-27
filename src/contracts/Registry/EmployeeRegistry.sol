// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../Employee.sol";

contract EmployeeRegistry is AccessControl, Ownable {
    address public admin;
    bytes32 public constant EMPLOYEE_ROLE = keccak256("EMPLOYEE_ROLE");

    constructor() {
        admin = msg.sender;
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
    }

    mapping(address => address) registeredEmployeesmap;
    address[] registeredEmployees;

    function registerEmployee(
        address EthAddress,
        string memory Name,
        string memory Location,
        string memory Description
    ) public onlyOwner {
        Employee newEmployee = new Employee(admin, EthAddress, Name, Location, Description);
        registeredEmployeesmap[EthAddress] = address(newEmployee);
        registeredEmployees.push(EthAddress);
        grantRole(EMPLOYEE_ROLE, address(newEmployee));
    }

    function isEmployee(address _employeeAddress) public view returns (bool) {
        return hasRole(EMPLOYEE_ROLE, registeredEmployeesmap[_employeeAddress]);
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