// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../PayrollAdmin.sol";

contract PayrollAdminRegistry is AccessControl, Ownable  {
    address public admin;
    bytes32 public constant PAYROLL_ADMIN_ROLE = keccak256("PAYROLL_ADMIN_ROLE");
    constructor() {
        admin = msg.sender;
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
    }

    mapping(address => address) public registeredPayrollAdminmap;
    address[] public payrollAdmins;

    function registerPayrollAdmin(address ethAddress, string memory name) public onlyOwner {
        PayrollAdmin newPayrollAdmin = new PayrollAdmin(admin, ethAddress, name);
        registeredPayrollAdminmap[ethAddress] = address(newPayrollAdmin);
        payrollAdmins.push(ethAddress);
        grantRole(PAYROLL_ADMIN_ROLE, address(newPayrollAdmin));
    }

    function isPayrollAdmin(address ethAddress) public view returns (bool) {
        return hasRole(PAYROLL_ADMIN_ROLE, registeredPayrollAdminmap[ethAddress]);
    }

    function payrollAdminCount() public view returns (uint256) {
        return payrollAdmins.length;
    }

    function getPayrollAdminContractByAddress(address ethAddress) public view returns (address) {
        return registeredPayrollAdminmap[ethAddress];
    }

    function getPayrollAdminContractByIndex(uint256 index) public view returns (address) {
        return getPayrollAdminContractByAddress(payrollAdmins[index]);
    }
}