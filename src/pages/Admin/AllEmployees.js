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
}
