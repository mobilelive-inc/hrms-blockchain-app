pragma solidity >=0.5.0 <0.9.0;

import "./Registry/EmployeeRegistry.sol";
import "./Registry/OrganizationRegistry.sol";
import "./Registry/PayrollAdminRegistry.sol";

contract Admin {
    address public owner;
    EmployeeRegistry public employeeRegistry;
    OrganizationRegistry public organizationRegistry;
    PayrollAdminRegistry public payrollAdminRegistry;

    constructor() public {
        owner = msg.sender;
        employeeRegistry = new EmployeeRegistry();
        organizationRegistry = new OrganizationRegistry();
        payrollAdminRegistry = new PayrollAdminRegistry();
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    function registerUser(
        address ethAddress,
        string memory name,
        string memory location,
        string memory description,
        uint256 role
    ) public onlyOwner {
        if (role == 1) {
            employeeRegistry.registerEmployee(ethAddress, name, location, description);
        } else if (role == 2) {
            organizationRegistry.registerOrganizationEndorser(ethAddress, name, location, description);
        } else if (role == 3) {
            payrollAdminRegistry.registerPayrollAdmin(ethAddress, name);
        }
    }

    /****************************************************************USER SECTION**************************************************/

    function isEmployee(address employeeAddress) public view returns (bool) {
        return employeeRegistry.isEmployee(employeeAddress);
    }

    function isOrganizationEndorser(address organizationEndorser) public view returns (bool) {
        return organizationRegistry.isOrganizationEndorser(organizationEndorser);
    }

    function employeeCount() public view returns (uint256) {
        return employeeRegistry.employeeCount();
    }

    function getEmployeeContractByAddress(address employee) public view returns (address) {
        return employeeRegistry.getEmployeeContractByAddress(employee);
    }

    function getEmployeeContractByIndex(uint256 index) public view returns (address) {
        return employeeRegistry.getEmployeeContractByIndex(index);
    }

    function organizationEndorserCount() public view returns (uint256) {
        return organizationRegistry.organizationEndorserCount();
    }

    function getOrganizationContractByAddress(address organization) public view returns (address) {
        return organizationRegistry.getOrganizationEndorserContractByAddress(organization);
    }

    function getOrganizationContractByIndex(uint256 index) public view returns (address) {
        return organizationRegistry.getOrganizationEndorserContractByIndex(index);
    }

    function isPayrollAdmin(address payrollAdmin) public view returns (bool) {
        return payrollAdminRegistry.isPayrollAdmin(payrollAdmin);
    }

    function payrollAdminCount() public view returns (uint256) {
        return payrollAdminRegistry.payrollAdminCount();
    }

    function getPayrollAdminContractByAddress(address payrollAdmin) public view returns (address) {
        return payrollAdminRegistry.getPayrollAdminContractByAddress(payrollAdmin);
    }

    function getPayrollAdminContractByIndex(uint256 index) public view returns (address) {
        return payrollAdminRegistry.getPayrollAdminContractByIndex(index);
    }
}
