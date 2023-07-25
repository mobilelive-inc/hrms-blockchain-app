<<<<<<< Updated upstream
import React, { Component } from "react";
import { toast } from "react-toastify";
import EmployeeCard from "../../components/EmployeeCard";
import "./Admin.css";
import Admin from "../../abis/Admin.json";
import LoadComp from "../../components/LoadComp";

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
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const employeeCount = await admin?.methods.employeeCount().call();

      const employees = await Promise.all(
        Array(parseInt(employeeCount))
          .fill()
          .map((ele, index) =>
            admin.methods.getEmployeeContractByIndex(index).call()
          )
      );
      this.setState({ employees });
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    this.setState({ loadcomp: false });
  };

  render() {
    return this.state.loadcomp ? (
      <LoadComp />
    ) : (
      <div className="admin">
        <h2 className="card-heading">All Registered Employees</h2>
        <br />
        {this.state.employees?.map((employee, index) => (
          <EmployeeCard key={index} employeeContractAddress={employee} />
        ))}
        <br />
      </div>
    );
  }
=======
import React, { useEffect, useState } from "react";
import EmployeeCard from "../../components/EmployeeCard";
import "./Admin.css";
import Admin from "../../abis/Admin.json";
import { getAllUsers } from "../../Apis/Admin";
import { getPerformanceApi } from "../../Apis/EmployeePerformanceApi";



export default function AllEmployees() {
  const [employees, setEmployees] = useState([]);
  // const [performances, setPerformances] = useState(null);
  const [performance, setPerformance] = useState(null);
  // const [loadcomp, setLoadcomp] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // setLoadcomp(true);
      const web3 = window.web3;
      const networkId = await web3.eth.net.getId();
      const AdminData = await Admin.networks[networkId];
      console.log(AdminData);
      const employeesData = await getAllUsers();
      const performance_info = await getPerformanceApi();
      // setPerformances(performance_info?.data);

      const performanceData = performance_info?.data.map((info) => ({ ...info }));
      setPerformance(performanceData);

      let usersData = employeesData.data.response.usersList;
      usersData = usersData.reverse();
      setEmployees(usersData);
      // setLoadcomp(false);
    };

    fetchData();
  }, []);

  return (
    <div className="admin">
      <h2 className="card-heading">All Registered Employees</h2>
      <br />
      {employees?.map(
        (employee, index) =>
          employee.first_name && (
            <EmployeeCard
              key={index}
              employee={employee}
              performance={performance[index]}
            />
          )
      )}
      <br />
    </div>
  );
>>>>>>> Stashed changes
}
