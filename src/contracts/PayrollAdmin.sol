pragma solidity >=0.5.0 <0.9.0;

contract PayrollAdmin {
  address admin;
  string name;
  address payroll_admin_address;

  constructor(
    address _admin,
    address _payroll_admin_address,
    string memory _name
  ) public {
    admin = _admin;
    name = _name;
    payroll_admin_address = _payroll_admin_address;
  }

  function getPayrollAdminInfo()
    public
    view
    returns (
      string memory,
      address
    )
  {
    return (name, payroll_admin_address);
  }

  address[] allEmployees;

  function addEmployees(address employee_address) public {
    require(msg.sender == payroll_admin_address, "Only owner can perform this action");
    allEmployees.push(employee_address);
  }

  function totalEmployees() public view returns (uint256) {
    return allEmployees.length;
  }

  function getEmployeeByIndex(uint256 index) public view returns (address) {
    return allEmployees[index];
  }
}
