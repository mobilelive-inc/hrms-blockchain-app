import React, { useEffect, useState } from "react";
import EmployeeCard from "../../components/EmployeeCard";
import "./Admin.css";
import Admin from "../../abis/Admin.json";
import { getAllUsers } from "../../Apis/Admin";
import { getPerformanceApi } from "../../Apis/EmployeePerformanceApi";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";

export default function AllEmployees() {
  const [employees, setEmployees] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [loadcomp, setLoadcomp] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try{
      setLoadcomp(true);
      const web3 = window.web3;
      const networkId = await web3.eth.net.getId();
      const AdminData = await Admin.networks[networkId];
      console.log(AdminData);
      const employeesData = await getAllUsers();
      const performance_info = await getPerformanceApi();

      const performanceData = performance_info?.data.map((info) => ({ ...info }));
      setPerformance(performanceData);

      let usersData = employeesData.data.response.usersList;
      usersData = usersData.reverse();
      setEmployees(usersData);
      }
      catch(error){
        toast.error(error);
      }
      finally{
        setLoadcomp(false);
      }
    };

    fetchData();
  }, []);

  return (
    loadcomp? (
      <div className="loader-container">
      <CircularProgress/>
      </div>
    ) : (
      <div className="admin">
        <h2 className="card-heading">All Registered Employees</h2>
        <br />
        {employees?.map(
          (employee, index) =>
            employee.first_name && performance && performance[index] && (
              <EmployeeCard
                key={index}
                employee={employee}
                performance={performance[index]}
              />
            )
        )}
        <br />
      </div>
    )
  );
}
