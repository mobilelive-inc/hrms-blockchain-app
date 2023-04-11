import React, { Component } from "react";
import { toast } from "react-toastify";
import Admin from "../../abis/Admin.json";
import LoadComp from "../../components/LoadComp";
import PayrollAdminCard from "../../components/PayrollAdminCard";

export default class AllPayrollAdmins extends Component {
  state = {
    orgends: [],
    loadcomp: false,
  };

  componentDidMount = async () => {
    this.setState({ loadcomp: true });
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const payrollAdminCount = await admin?.methods
        .payrollAdminCount()
        .call();
      const payrollAdmins = await Promise.all(
        Array(parseInt(payrollAdminCount))
          .fill()
          .map((ele, index) =>
            admin.methods.getPayrollContractByIndex(index).call()
          )
      );
      this.setState({ payrollAdmins });
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
        <h2 className="card-heading">All Registered Payroll Admin</h2>
        <br />
        {this.state.payrollAdmins?.map((payrollAdmin, index) => (
          <PayrollAdminCard key={index} PayrollAdminContractAddress={payrollAdmin} />
        ))}
        <br />
      </div>
    );
  }
}