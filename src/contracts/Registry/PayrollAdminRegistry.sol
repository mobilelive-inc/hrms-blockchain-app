// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;
import "../PayrollAdmin.sol";

contract PayrollAdminRegistry {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    mapping(address => address) public registeredPayrollAdmins;
    address[] public payrollAdmins;

    function registerPayrollAdmin(address ethAddress, string memory name) public onlyOwner {
        PayrollAdmin newPayrollAdmin = new PayrollAdmin(owner, ethAddress, name);
        registeredPayrollAdmins[ethAddress] = address(newPayrollAdmin);
        payrollAdmins.push(ethAddress);
    }

    function isPayrollAdmin(address ethAddress) public view returns (bool) {
        return registeredPayrollAdmins[ethAddress] != address(0x0);
    }

    function payrollAdminCount() public view returns (uint256) {
        return payrollAdmins.length;
    }

    function getPayrollAdminContractByAddress(address ethAddress) public view returns (address) {
        return registeredPayrollAdmins[ethAddress];
    }

    function getPayrollAdminContractByIndex(uint256 index) public view returns (address) {
        return getPayrollAdminContractByAddress(payrollAdmins[index]);
    }
}
