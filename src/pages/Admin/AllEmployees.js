import React, { Component } from "react";
import EmployeeCard from "../../components/EmployeeCard";
import "./Admin.css";
import Admin from "../../abis/Admin.json";
import { getAllUsers } from "../../Apis/Admin";
import { getPerformanceApi } from "../../Apis/EmployeePerformanceApi";
//import LoadComp from "../../components/LoadComp";

export default class AllEmployees extends Component {
  state = {
    employees: [],
    performances: null,
    performance: null,
    loadcomp: false,
  };

  componentDidMount = async () => {
    this.setState({ loadcomp: true });
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    console.log(AdminData);
    const employees = await getAllUsers();
    const performance_info = await getPerformanceApi();
    this.setState({ performances: performance_info?.data });

    const performance = performance_info?.data.map((info) => ({ ...info }));
    this.setState({ performance: performance });

    let usersData = employees.data.response.usersList;
    usersData = usersData.reverse();
    this.setState({ employees: usersData });
    this.setState({ loadcomp: false });
    
  };

  render() {
    return (
      <div className="admin">
        <h2 className="card-heading">All Registered Employees</h2>
        <br />
        {this.state.employees?.map(
          (employee, index) =>
            employee.first_name && (
              <EmployeeCard
                key={index}
                employee={employee}
                performance={this.state.performance[index]}
              />
            )
        )}
        <br />
      </div>
    );
  }
}
