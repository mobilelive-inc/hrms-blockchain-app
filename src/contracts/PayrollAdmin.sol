pragma solidity >=0.5.0 <0.9.0;

contract PayrollAdmin {
  address admin;
  string name;
  address payroll_admin_address;
  // string description;
  string location;

  constructor(
    address _admin,
    address _payroll_admin_address,
    string memory _name,
    // string memory _description,
    string memory _location
  ) public {
    admin = _admin;
    name = _name;
    payroll_admin_address = _payroll_admin_address;
    // description = _description;
    location = _location;
  }

  function getPayrollAdminInfo()
    public
    view
    returns (
      string memory,
      address,
      // string memory,
      string memory
    )
  {
    return (name, payroll_admin_address, location);
  }

  address[] allEmployees;

  function addEmployees(address employee_address) public {
    require(msg.sender == payroll_admin_address);
    allEmployees.push(employee_address);
  }

  function totalEmployees() public view returns (uint256) {
    return allEmployees.length;
  }

  function getEmployeeByIndex(uint256 index) public view returns (address) {
    return allEmployees[index];
  }
}
