//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Employee.sol";
import "./OrganizationEndorser.sol";

contract Admin is AccessControl, Ownable {
address public admin;
bytes32 public constant EMPLOYEE_ROLE = keccak256("EMPLOYEE_ROLE");
bytes32 public constant ORGANIZATION_ROLE = keccak256("ORGANIZATION_ROLE");

  constructor() public {
    admin = msg.sender;
    _setupRole(DEFAULT_ADMIN_ROLE, admin);
    // _setupRole(ADMIN_ROLE, _admin);
  }

  function transferOwnership(address newOwner) public override onlyOwner {
    require(newOwner != address(0), "Invalid address");
    _transferOwnership(newOwner);
  }

  mapping(address => address) registeredEmployeesmap;
  mapping(address => address) registeredOrganizationmap;
  address[] registeredEmployees;
  address[] registeredOrganization;

  function registerUser(
    address EthAddress,
    string memory Name,
    string memory Location,
    string memory Description,
    uint256 Role
  ) public onlyOwner {
    if (Role == 1) {
      Employee newEmployee = new Employee(
        admin,
        EthAddress,
        Name,
        Location,
        Description
      );
      registeredEmployeesmap[EthAddress] = address(newEmployee);
      registeredEmployees.push(EthAddress);
      grantRole(EMPLOYEE_ROLE, address(newEmployee));
    } else {
      OrganizationEndorser newOrganizationEndorser = new OrganizationEndorser(
        admin,
        EthAddress,
        Name,
        Location,
        Description
      );
      registeredOrganizationmap[EthAddress] = address(newOrganizationEndorser);
      registeredOrganization.push(EthAddress);
      grantRole(ORGANIZATION_ROLE, address(newOrganizationEndorser));
    }
  }

  /****************************************************************USER SECTION**************************************************/

  function isEmployee(address _employeeAddress) public view returns (bool) {
    // return registeredEmployeesmap[_employeeAddress] != address(0x0);
    return hasRole(EMPLOYEE_ROLE, registeredEmployeesmap[_employeeAddress]);
  }

  function isOrganizationEndorser(address _organizationEndorser)
    public
    view
    returns (bool)
  {
    // return registeredOrganizationmap[_organizationEndorser] != address(0x0);
      return hasRole(ORGANIZATION_ROLE, registeredOrganizationmap[_organizationEndorser]);
  }

  function employeeCount() public view returns (uint256) {
    return registeredEmployees.length;
  }

  function getEmployeeContractByAddress(address _employee)
    public
    view
    returns (address)
  {
    return registeredEmployeesmap[_employee];
  }

  function getEmployeeContractByIndex(uint256 index)
    public
    view
    returns (address)
  {
    return getEmployeeContractByAddress(registeredEmployees[index]);
  }

  function OrganizationEndorserCount() public view returns (uint256) {
    return registeredOrganization.length;
  }

  function getOrganizationContractByAddress(address _organization)
    public
    view
    returns (address)
  {
    return registeredOrganizationmap[_organization];
  }

  function getOrganizationContractByIndex(uint256 index)
    public
    view
    returns (address)
  {
    return getOrganizationContractByAddress(registeredOrganization[index]);
  }
}
