import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  Button,
  Card,
  Dropdown,
  Form,
  Input,
  Message,
} from "semantic-ui-react";
import Admin from "../../abis/Admin.json";
import { toast } from "react-toastify";
import ScanQR from "../../components/ScanQR";
import { createUser } from "../../Apis/UsersApi";
import "./Admin.css";

class CreateUser extends Component {
  state = {
    role: "",
    first_name: "",
    last_name: "",
    industry: "",
    current_position: "",
    education: "",
    country: "",
    city: "",
    phone_number: "",
    dob: "",
    userAddress: "",
    email: "",

    description: "",

    loading: false,
    errorMessage: "",
    scanQR: false,
  };

  roleOptions = [
    { key: "employee", text: "Employee", value: "employee" },
    { key: "admin", text: "Admin", value: "admin" },
    { key: "pm", text: "Project Manager", value: "pm" },
  ];

  handleDropdownSelect = (e, data) => {
    this.setState({ role: data.value });
  };

  handleChange = (e) => {
    e.preventDefault();
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { role, first_name, last_name, userAddress, email } = this.state;
    if (!first_name || !last_name || !role || !userAddress) {
      toast.error("Please fill in the required fields!!");
      return;
    }
    this.setState({ loading: true, errorMessage: "" });
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    console.log("adminData: ", AdminData);
    const accounts = await web3.eth.getAccounts();
    const messageToR = `0x${Buffer.from(
      "Please confirm to verify info update",
      "utf8"
    ).toString("hex")}`;
    const signature = await web3.eth.personal.sign(messageToR, accounts[0]);
    const dataToSend = {
      userAddress: userAddress,
      signature: signature,
      role: role,
      first_name: first_name,
      last_name: last_name,
      email: email,
    };
    const response = await createUser(dataToSend);

    if (response?.data?.response?.transactionData) {
      const txData = response.data.response.transactionData;
      const transaction = {
        from: accounts[0],
        to: txData.to,
        value: txData.value,
        gas: txData.gas,
        gasPrice: txData.gasPrice,
        data: txData.data,
      };
      const receipt = await web3.eth.sendTransaction(transaction);
      if (receipt) {
        toast.success("User created successfully");
        console.log("receipt: ", receipt);
        this.setState({ loading: false });
      }
    } else {
      toast.error("Transaction data is missing in the response.");
    }
  };

  closeScanQRModal = () => {
    this.setState({ scanQR: false });
  };

  handleAddAddress = (res) => {
    this.setState({ ethAddress: res });
  };

  render() {
    return (
      <>
        <ScanQR
          isOpen={this.state.scanQR}
          closeScanQRModal={this.closeScanQRModal}
          handleAddAddress={this.handleAddAddress}
        />
        <div className="create-user">
          <Card className="card-style">
            <Card.Content>
              <Card.Header centered>
                <h2 className="card-heading">Register New User</h2>
              </Card.Header>
              <hr className="horizontal-line"></hr>
              <br></br>
              <Form error={!!this.state.errorMessage}>
                <Form.Field className="form-inputs-admin">
                  <input
                    id="first_name"
                    placeholder="First Name"
                    autoComplete="off"
                    autoCorrect="off"
                    value={this.state.first_name}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <br />
                <Form.Field className="form-inputs-admin">
                  <input
                    id="last_name"
                    placeholder="Last Name"
                    autoComplete="off"
                    autoCorrect="off"
                    value={this.state.last_name}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <br />
                <Form.Field className="form-inputs-admin">
                  <input
                    id="email"
                    placeholder="Email"
                    autoComplete="off"
                    autoCorrect="off"
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <br />
                <Form.Field className="form-inputs-admin">
                  <Input action className="form-inputs-admin">
                    <input
                      id="userAddress"
                      placeholder="User's Address"
                      autoComplete="off"
                      autoCorrect="off"
                      value={this.state.userAddress}
                      onChange={this.handleChange}
                    />
                  </Input>
                </Form.Field>
                <br />
                <Form.Field className="form-inputs-admin">
                  <Dropdown
                    placeholder="Select Role"
                    fluid
                    selection
                    options={this.roleOptions}
                    onChange={this.handleDropdownSelect}
                  />
                </Form.Field>
                <br />
                <Message
                  error
                  header="Oops!!"
                  content={this.state.errorMessage}
                />
                <br />
                <div className="button-holder">
                  <Button
                    className="button-css-admin"
                    type="submit"
                    onClick={this.handleSubmit}
                    loading={this.state.loading}
                    disabled={this.state.loading}
                  >
                    Register
                  </Button>
                </div>
              </Form>
            </Card.Content>
          </Card>
        </div>
      </>
    );
  }
}

export default withRouter(CreateUser);
