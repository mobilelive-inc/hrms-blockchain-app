// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;
import "../OrganizationEndorser.sol";

contract OrganizationRegistry {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    mapping(address => address) registeredOrganizationmap;
    address[] registeredOrganization;

    function registerOrganizationEndorser(
        address EthAddress,
        string memory Name,
        string memory Location,
        string memory Description
    ) public onlyOwner {
        OrganizationEndorser newOrganizationEndorser = new OrganizationEndorser(owner, EthAddress, Name, Location, Description);
        registeredOrganizationmap[EthAddress] = address(newOrganizationEndorser);
        registeredOrganization.push(EthAddress);
    }

    function isOrganizationEndorser(address _organizationEndorser) public view returns (bool) {
        return registeredOrganizationmap[_organizationEndorser] != address(0x0);
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
