import React, { Component } from "react";
import "./OrgEndCard.css";
import PayrollAdmin from "../abis/PayrollAdmin.json";
import { Card } from "semantic-ui-react";

export default class PayrollAdminCard extends Component {
  state = {
    payrollAdminInfo: {},
    // allEmployeesInOrg: [],
  };

  componentDidMount = async () => {
    const web3 = window.web3;
    const PayrollAdminContract = await new web3.eth.Contract(
      PayrollAdmin.abi,
      this.props.PayrollAdminContractAddress
    );

    const payrollAdminData = await PayrollAdminContract.methods
      .getPayrollAdminInfo()
      .call();
    const payrollAdminInfo = {
      ethAddress: payrollAdminData[1],
      name: payrollAdminData[0],
      location: payrollAdminData[2],
      description: payrollAdminData[3],
    };

    /*const employeeCount = await PayrollAdminContract.methods.totalEmployees().call();
     const allEmployeesInOrg = await Promise.all(
      Array(parseInt(employeeCount))
        .fill()
        .map((ele, index) =>
          PayrollAdminContract.methods.getEmployeeByIndex(index).call()
        )
    ); */
    this.setState({ payrollAdminInfo });
  };

  render() {
    return (
      <Card className="organization-card">
        <Card.Content>
          <Card.Header>
            <span>{this.state.payrollAdminInfo?.name}</span>
            <small>{this.state.payrollAdminInfo?.ethAddress}</small>
          </Card.Header>
          <br></br>
          <div>
            <p>
              <em>Location : </em>
              <span style={{ color: "#c5c6c7" }}>
                {this.state.payrollAdminInfo?.location}
              </span>
            </p>
          </div>
          <br />
          <div>
            <em>Description :</em>
            <p style={{ color: "#c5c6c7" }}>
              {this.state.payrollAdminInfo?.description}
            </p>
          </div>
          <br />
          {/* <div>
            <p>
              <em>Employee Count: </em>
              <span style={{ color: "#c5c6c7" }}>
                {this.state.allEmployeesInOrg?.length}
              </span>
            </p>
          </div> */}
        </Card.Content>
      </Card>
    );
  }
}