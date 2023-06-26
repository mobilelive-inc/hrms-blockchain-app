import React, { Component } from "react";
import Employee from "../abis/Employee.json";
import Admin from "../abis/Admin.json";
import { toast } from "react-toastify";
import "./SkillCard.css";

export default class SkillCard extends Component {
  state = {
    colour: ["#b6e498", "#61dafb", "#764abc", "#83cd29", "#00d1b2"],
  };
  checkExistence(value) {
    return value ? value : "-------";
  }

  removeSkill = async (name) => {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    const accounts = await web3.eth.getAccounts();
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const employeeContractAddress = await admin?.methods
        ?.getEmployeeContractByAddress(accounts[0])
        .call();
      const EmployeeContract = await new web3.eth.Contract(
        Employee.abi,
        employeeContractAddress
      );
      await EmployeeContract?.methods
        ?.deleteSkill(name)
        .send({ from: accounts[0] });
      toast.success("Skill deleted successfully!!");
      window.location.reload(false);
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
  };

  render() {
    const skill = this.props.skill;
    return (
      <div className="skill-des">
        {this.props.update && (
          <span
            className="delete-button-skill"
            onClick={(e) => this.removeSkill(skill.name)}
          >
            {!skill.visible ? (
              <i class="fas fa-eye-slash"></i>
            ) : (
              <i class="fas fa-eye"></i>
            )}
          </span>
        )}
          <div>
            <div>
                  <div key={skill?.title}>
                    <p style={{ color: "black", fontWeight: "bold" }}>
                      {this.checkExistence(skill?.title)}
                    </p>
                    <small style={{ color: "black", fontWeight: "bold" }}>
                      {this.checkExistence(skill?.experience)}
                    </small>
                  </div>
            </div>

          </div>
      </div>
    );
  }
}
