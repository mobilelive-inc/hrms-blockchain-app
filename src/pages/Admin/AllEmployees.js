import React, { Component } from "react";
import { toast } from "react-toastify";
import EmployeeCard from "../../components/EmployeeCard";
import "./Admin.css";
import Admin from "../../abis/Admin.json";
import {getAllUsers} from "../../Apis/Admin"
//import LoadComp from "../../components/LoadComp";

export default class AllEmployees extends Component {
  state = {
    employees: [],
    loadcomp: false,
  };

  componentDidMount = async () => {
    this.setState({ loadcomp: true });
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    if (AdminData) {
      const employees = await getAllUsers();
      let usersData = employees.data.response.usersList;
      this.setState({ employees: usersData });
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    this.setState({ loadcomp: false });
  };

  render() {
    return  (
      <div className="admin">
        <h2 className="card-heading">All Registered Employees</h2>
        <br />
        {this.state.employees.reverse()?.map((employee, index) => (
          <EmployeeCard key={index} employee={employee} />
        ))}
        <br />
      </div>
    );
  }
}
