//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Registry/EmployeeRegistry.sol";
import "./Registry/OrganizationRegistry.sol";
import "./Registry/PayrollAdminRegistry.sol";

contract Admin is AccessControl, Ownable {
address public admin;
EmployeeRegistry public employeeRegistry;
OrganizationRegistry public organizationRegistry;
PayrollAdminRegistry public payrollAdminRegistry;

  constructor()  {
    admin = msg.sender;
    _setupRole(DEFAULT_ADMIN_ROLE, admin);
    employeeRegistry = new EmployeeRegistry();
    organizationRegistry = new OrganizationRegistry();
    payrollAdminRegistry = new PayrollAdminRegistry();
  }

  function transferOwnership(address newOwner) public override onlyOwner {
    require(newOwner != address(0), "Invalid address");
    _transferOwnership(newOwner);
  }

  function registerUser(
    address EthAddress,
    string memory Name,
    string memory Location,
    string memory Description,
    uint256 Role
  ) public onlyOwner {

    if (Role == 1) {
        employeeRegistry.registerEmployee(EthAddress, Name, Location, Description);
    } else if (Role == 2) {
        organizationRegistry.registerOrganizationEndorser(EthAddress, Name, Location, Description);
    } else if (Role == 3) {
        payrollAdminRegistry.registerPayrollAdmin(EthAddress, Name);
    }
  }

  /****************************************************************USER SECTION**************************************************/

  function isEmployee(address _employeeAddress) public view returns (bool) {
    return employeeRegistry.isEmployee(_employeeAddress);
  }

  function isOrganizationEndorser(address _organizationEndorser)
    public
    view
    returns (bool)
  {
    return organizationRegistry.isOrganizationEndorser(_organizationEndorser);
  }

  function employeeCount() public view returns (uint256) {
    return employeeRegistry.employeeCount();
  }

  function getEmployeeContractByAddress(address _employee)
    public
    view
    returns (address)
  {
    return employeeRegistry.getEmployeeContractByAddress(_employee);
  }

  function getEmployeeContractByIndex(uint256 index)
    public
    view
    returns (address)
  {
    return employeeRegistry.getEmployeeContractByIndex(index);
  }

  function OrganizationEndorserCount() public view returns (uint256) {
    return organizationRegistry.organizationEndorserCount();
  }

  function getOrganizationContractByAddress(address _organization)
    public
    view
    returns (address)
  {
    return organizationRegistry.getOrganizationEndorserContractByAddress(_organization);
  }

  function getOrganizationContractByIndex(uint256 index)
    public
    view
    returns (address)
  {
    return organizationRegistry.getOrganizationEndorserContractByIndex(index);
  }

  function isPayrollAdmin(address _payrollAddress) public view returns (bool) {
    return payrollAdminRegistry.isPayrollAdmin(_payrollAddress);
  }

  function payrollAdminCount() public view returns (uint256) {
    return payrollAdminRegistry.payrollAdminCount();
  }

  function getPayrollContractByAddress(address _payrollAdmin)
    public
    view
    returns (address)
  {
    return payrollAdminRegistry.getPayrollAdminContractByAddress(_payrollAdmin);
  }

  function getPayrollContractByIndex(uint256 index)
    public
    view
    returns (address)
  {
    return payrollAdminRegistry.getPayrollAdminContractByIndex(index);
  }
  
}
