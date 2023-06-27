//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;
// import "@openzeppelin/contracts/access/AccessControl.sol";

contract WorkExperience  {
  /* bytes32 public constant EMPLOYEE_ROLE = keccak256("EMPLOYEE_ROLE");
  address employee_address;
  constructor(address _employee_address) {
    // _setupRole(DEFAULT_ADMIN_ROLE,_admin);
    employee_address = _employee_address;
    _setupRole(EMPLOYEE_ROLE,employee_address);
  }

  function _isEmployee() private view {
    require(hasRole(EMPLOYEE_ROLE, employee_address), "Caller is not an employee");
  }

  modifier OnlyEmployee() {
    _isEmployee();
    _;
  } */

  struct workexpInfo {
    string role;
    address organization;
    string startdate;
    string enddate;
    bool endorsed;
    string description;
    bool visible;
  }

  mapping(address => workexpInfo) workexpmap;
  address[] workexps;

  function addWorkExp(
    string memory _role,
    address _organization,
    string memory _startdate,
    string memory _enddate,
    string memory _description
  ) public {
    workexpInfo memory newworkexp;
    newworkexp.role = _role;
    newworkexp.organization = _organization;
    newworkexp.startdate = _startdate;
    newworkexp.enddate = _enddate;
    newworkexp.endorsed = false;
    newworkexp.visible = true;
    newworkexp.description = _description;
    workexpmap[_organization] = newworkexp;
    workexps.push(_organization);
    
  }


  function _isOrgExist() private view {
    require(workexpmap[msg.sender].organization != address(0x0), 'Organization does not exist!');
  }

  function endorseWorkExp() public {
    _isOrgExist();
    workexpmap[msg.sender].endorsed = true;
  }


  function getWorkExpByAddress(address _organization)
    private
    view
    returns (
      string memory,
      address,
      string memory,
      string memory,
      bool,
      string memory,
      bool
    )
  {
    return (
      workexpmap[_organization].role,
      workexpmap[_organization].organization,
      workexpmap[_organization].startdate,
      workexpmap[_organization].enddate,
      workexpmap[_organization].endorsed,
      workexpmap[_organization].description,
      workexpmap[_organization].visible
    );
  }

  function getWorkExpCount() public view returns (uint256) {
    return workexps.length;
  }

  function getWorkExpByIndex(uint256 _index)
    public
    view
    returns (
      string memory,
      address,
      string memory,
      string memory,
      bool,
      string memory,
      bool
    )
  {
    return getWorkExpByAddress(workexps[_index]);
  }

  function deleteWorkExp(address org) public {
    workexpmap[org].visible = false;
  }
}