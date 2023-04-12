//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Employee.sol";
import "./OrganizationEndorser.sol";
import "./PayrollAdmin.sol";

contract Admin is AccessControl, Ownable {
address public admin;
bytes32 public constant EMPLOYEE_ROLE = keccak256("EMPLOYEE_ROLE");
bytes32 public constant ORGANIZATION_ROLE = keccak256("ORGANIZATION_ROLE");
bytes32 public constant PAYROLL_ADMIN_ROLE = keccak256("PAYROLL_ADMIN_ROLE");

  constructor() public {
    admin = msg.sender;
    _setupRole(DEFAULT_ADMIN_ROLE, admin);
  }

  function transferOwnership(address newOwner) public override onlyOwner {
    require(newOwner != address(0), "Invalid address");
    _transferOwnership(newOwner);
  }

  mapping(address => address) registeredEmployeesmap;
  mapping(address => address) registeredOrganizationmap;
  mapping(address => address) registeredPayrollAdminmap;
  address[] registeredEmployees;
  address[] registeredOrganization;
  address[] registeredPayrollAdmin;

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
    } else if(Role == 2) {
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
    }else if(Role == 3){
      PayrollAdmin newPayrollAdmin = new PayrollAdmin(
        admin,
        EthAddress,
        Name
      );
      registeredPayrollAdminmap[EthAddress] = address(newPayrollAdmin);
      registeredPayrollAdmin.push(EthAddress);
      grantRole(PAYROLL_ADMIN_ROLE, address(newPayrollAdmin));
    }
  }

  /****************************************************************USER SECTION**************************************************/

  function isEmployee(address _employeeAddress) public view returns (bool) {
    return hasRole(EMPLOYEE_ROLE, registeredEmployeesmap[_employeeAddress]);
  }

  function isOrganizationEndorser(address _organizationEndorser)
    public
    view
    returns (bool)
  {
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

  function isPayrollAdmin(address _payrollAddress) public view returns (bool) {
    return hasRole(PAYROLL_ADMIN_ROLE, registeredPayrollAdminmap[_payrollAddress]);
  }

  function payrollAdminCount() public view returns (uint256) {
    return registeredPayrollAdmin.length;
  }

  function getPayrollContractByAddress(address _payrollAdmin)
    public
    view
    returns (address)
  {
    return registeredPayrollAdminmap[_payrollAdmin];
  }

  function getPayrollContractByIndex(uint256 index)
    public
    view
    returns (address)
  {
    return getPayrollContractByAddress(registeredPayrollAdmin[index]);
  }
  
}
