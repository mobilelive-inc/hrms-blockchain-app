const Admin = artifacts.require("Admin");
const Skills = artifacts.require("Skills");
const WorkExperience = artifacts.require("WorkExperience");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Admin);
  const admin = await Admin.deployed();
  await deployer.deploy(Skills);
  const skills = await Skills.deployed();
  await deployer.deploy(WorkExperience);
  const workExperience = await WorkExperience.deployed();
  console.log(admin.address, skills.address, workExperience.address);
};
