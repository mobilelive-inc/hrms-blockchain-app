//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;
import "@openzeppelin/contracts/access/AccessControl.sol";

contract OrganizationEndorser is AccessControl {
  bytes32 public constant ORGANIZATION_ROLE = keccak256("ORGANIZATION_ROLE");

  // address admin;
  string name;
  address organization_address;
  string description;
  string location;

  function _isOrganization() private view{
    require(hasRole(ORGANIZATION_ROLE, organization_address), "Caller is not an organization");
  }

  modifier onlyOrganization() {
    _isOrganization();
    _;
  }

  constructor(
    address _admin,
    address _organization_address,
    string memory _name,
    string memory _description,
    string memory _location
  ) {
    _setupRole(DEFAULT_ADMIN_ROLE, _admin);
    _setupRole(ORGANIZATION_ROLE, _organization_address);
    name = _name;
    organization_address = _organization_address;
    description = _description;
    location = _location;
  }

  function getOrganizationInfo()
    public
    view
    returns (
      string memory,
      address,
      string memory,
      string memory
    )
  {
    return (name, organization_address, description, location);
  }

  address[] allEmployees;

  function addEmployees(address employee_address) public onlyOrganization {
    allEmployees.push(employee_address);
  }

  function totalEmployees() public view returns (uint256) {
    return allEmployees.length;
  }

  function getEmployeeByIndex(uint256 index) public view returns (address) {
    return allEmployees[index];
  }
}
