//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Employee is AccessControl {
  bytes32 public constant EMPLOYEE_ROLE = keccak256("EMPLOYEE_ROLE");

  address employee_address;
  string description;
  string location;
  uint256[] public overallEndorsement;
  uint256 endorsecount;
  string name;

  constructor(
    address _admin,
    address _employee_address,
    string memory _name,
    string memory _description,
    string memory _location
  ) {
    // admin = _admin;
    _setupRole(DEFAULT_ADMIN_ROLE,_admin);
    _setupRole(EMPLOYEE_ROLE,_employee_address);
    name = _name;
    employee_address = _employee_address;
    description = _description;
    location = _location;
    endorsecount = 0;
  }

  function _onlyEmployee() private view {
    require(hasRole(EMPLOYEE_ROLE, employee_address), "Caller is not an employee");
  }

  modifier OnlyEmployee() {
    _onlyEmployee();
    _;
  }

  function getEmployeeInfo()
    public
    view
    returns (
      address,
      string memory,
      string memory,
      string memory,
      uint256,
      uint256
    )
  {
    return (employee_address, name, description, location, 0, endorsecount);
  }

  function editInfo(
    string memory _name,
    string memory _descrip,
    string memory _location
  ) public OnlyEmployee {
    name = _name;
    description = _descrip;
    location = _location;
  }

  /*********************************************************SKILLS SECTION**********************************************************/

  struct skillInfo {
    string name;
    uint256 overall_percentage;
    string experience;
    bool endorsed;
    address endorser_address;
    string review;
    bool visible;
  }

  mapping(string => skillInfo) skillmap;
  string[] skills;

  function addSkill(string memory _name, string memory _experience)
    public
    OnlyEmployee
  {
    skillInfo memory employeeSkillSet;
    employeeSkillSet.name = _name;
    employeeSkillSet.experience = _experience;
    employeeSkillSet.overall_percentage = 0;
    employeeSkillSet.endorsed = false;
    employeeSkillSet.visible = true;
    skillmap[_name] = employeeSkillSet;
    skills.push(_name);
  }

  function endorseSkill(
    string memory _name,
    uint256 _overall_percentage,
    string memory _review
  ) public {
    require(skillmap[_name].visible, 'Skill is not visible!');
    skillmap[_name].overall_percentage = _overall_percentage;
    overallEndorsement.push(_overall_percentage);
    endorsecount = endorsecount + 1;
    skillmap[_name].endorsed = true;
    skillmap[_name].endorser_address = msg.sender;
    skillmap[_name].review = _review;
  }

  function getSkillByName(string memory _name)
    private
    view
    returns (
      string memory,
      uint256,
      string memory,
      bool,
      address,
      string memory,
      bool
    )
  {
    return (
      skillmap[_name].name,
      skillmap[_name].overall_percentage,
      skillmap[_name].experience,
      skillmap[_name].endorsed,
      skillmap[_name].endorser_address,
      skillmap[_name].review,
      skillmap[_name].visible
    );
  }

  function getSkillCount() public view returns (uint256) {
    return skills.length;
  }

  function getSkillByIndex(uint256 _index)
    public
    view
    returns (
      string memory,
      uint256,
      string memory,
      bool,
      address,
      string memory,
      bool
    )
  {
    return getSkillByName(skills[_index]);
  }

  function deleteSkill(string memory _name) public OnlyEmployee {
    skillmap[_name].visible = !skillmap[_name].visible;
  }

  /*********************************************************CERTIFICATION SECTION**********************************************************/

  struct certificationInfo {
    string name;
    address organization;
    uint256 score;
    bool endorsed;
    bool visible;
  }

  mapping(string => certificationInfo) certificationmap;
  string[] certifications;

  function addCertification(
    string memory _name,
    address _organization,
    uint256 _score
  ) public OnlyEmployee {
    certificationInfo memory newcertificationInfo;
    newcertificationInfo.name = _name;
    newcertificationInfo.organization = _organization;
    newcertificationInfo.score = _score;
    newcertificationInfo.endorsed = false;
    newcertificationInfo.visible = true;
    certificationmap[_name] = newcertificationInfo;
    certifications.push(_name);
  }

  function endorseCertification(string memory _name) public {
    require(msg.sender == certificationmap[_name].organization, 'Caller is not organization');
    certificationmap[_name].endorsed = true;
  }

  function getCertificationByName(string memory _name)
    private
    view
    returns (
      string memory,
      address,
      uint256,
      bool,
      bool
    )
  {
    return (
      certificationmap[_name].name,
      certificationmap[_name].organization,
      certificationmap[_name].score,
      certificationmap[_name].endorsed,
      certificationmap[_name].visible
    );
  }

  function getCertificationCount() public view returns (uint256) {
    return certifications.length;
  }

  function getCertificationByIndex(uint256 _index)
    public
    view
    returns (
      string memory,
      address,
      uint256,
      bool,
      bool
    )
  {
    return getCertificationByName(certifications[_index]);
  }

  function deleteCertification(string memory _name) public OnlyEmployee {
    certificationmap[_name].visible = !certificationmap[_name].visible;
  }


  /********************************************************************Education Section********************************************************************/

  struct educationInfo {
    address institute;
    string startdate;
    string enddate;
    bool endorsed;
    string description;
  }

  mapping(address => educationInfo) educationmap;
  address[] educations;

  function addEducation(
    address _institute,
    string memory _startdate,
    string memory _enddate,
    string memory _description
  ) public OnlyEmployee {
    educationInfo memory newEducation;
    newEducation.institute = _institute;
    newEducation.startdate = _startdate;
    newEducation.enddate = _enddate;
    newEducation.endorsed = false;
    newEducation.description = _description;
    educationmap[_institute] = newEducation;
    educations.push(_institute);
  }

  function endorseEducation() public {
    require(educationmap[msg.sender].institute != address(0x0), 'institute does not exist!');
    educationmap[msg.sender].endorsed = true;
  }

  function getEducationByAddress(address _institute)
    private
    view
    returns (
      address,
      string memory,
      string memory,
      bool,
      string memory
    )
  {
    return (
      educationmap[_institute].institute,
      educationmap[_institute].startdate,
      educationmap[_institute].enddate,
      educationmap[_institute].endorsed,
      educationmap[_institute].description
    );
  }

  function getEducationCount() public view returns (uint256) {
    return educations.length;
  }

  function getEducationByIndex(uint256 _index)
    public
    view
    returns (
      address,
      string memory,
      string memory,
      bool,
      string memory
    )
  {
    return getEducationByAddress(educations[_index]);
  }
}
