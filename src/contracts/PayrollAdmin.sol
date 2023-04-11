//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;
import "@openzeppelin/contracts/access/AccessControl.sol";

contract PayrollAdmin  is AccessControl {
  bytes32 public constant PAYROLL_ADMIN_ROLE = keccak256("PAYROLL_ADMIN_ROLE");
  // address admin;
  string name;
  address payroll_admin_address;

  constructor(
    address _admin,
    address _payroll_admin_address,
    string memory _name
  ) public {
    // admin = _admin;
    _setupRole(DEFAULT_ADMIN_ROLE,_admin);
    _setupRole(PAYROLL_ADMIN_ROLE,_payroll_admin_address);
    name = _name;
    payroll_admin_address = _payroll_admin_address;
  }

  modifier OnlyPayrollAdmin() {
    // require(msg.sender == employee_address);
    require(hasRole(PAYROLL_ADMIN_ROLE, payroll_admin_address), "Caller is not an payroll admin");
    _;
  }

  function getPayrollAdminInfo()
    public
    view
    returns (
      string memory,
      address
    )
  {
    return (name, payroll_admin_address);
  }

  address[] allEmployees;

  function addEmployees(address employee_address) public OnlyPayrollAdmin {
    // require(msg.sender == payroll_admin_address, "Only owner can perform this action");
    allEmployees.push(employee_address);
  }

  function totalEmployees() public view returns (uint256) {
    return allEmployees.length;
  }

  function getEmployeeByIndex(uint256 index) public view returns (address) {
    return allEmployees[index];
  }
}