// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../OrganizationEndorser.sol";

contract OrganizationRegistry is AccessControl, Ownable  {
    address public admin;
    bytes32 public constant ORGANIZATION_ROLE = keccak256("ORGANIZATION_ROLE");
    constructor() {
        admin = msg.sender;
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
    }

    mapping(address => address) registeredOrganizationmap;
    address[] registeredOrganization;

    function registerOrganizationEndorser(
        address EthAddress,
        string memory Name,
        string memory Location,
        string memory Description
    ) public onlyOwner {
        OrganizationEndorser newOrganizationEndorser = new OrganizationEndorser(admin, EthAddress, Name, Location, Description);
        registeredOrganizationmap[EthAddress] = address(newOrganizationEndorser);
        registeredOrganization.push(EthAddress);
        grantRole(ORGANIZATION_ROLE, address(newOrganizationEndorser));
    }

    function isOrganizationEndorser(address _organizationEndorser) public view returns (bool) {
        return hasRole(ORGANIZATION_ROLE, registeredOrganizationmap[_organizationEndorser]);
    }

    function organizationEndorserCount() public view returns (uint256) {
        return registeredOrganization.length;
    }

    function getOrganizationEndorserContractByAddress(address _organizationEndorser) public view returns (address) {
        return registeredOrganizationmap[_organizationEndorser];
    }

    function getOrganizationEndorserContractByIndex(uint256 index) public view returns (address) {
        return getOrganizationEndorserContractByAddress(registeredOrganization[index]);
    }
}