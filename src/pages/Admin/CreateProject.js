import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button, Card, Form, Message } from "semantic-ui-react";
import Admin from "../../abis/Admin.json";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import ScanQR from "../../components/ScanQR";
import { createProject } from "../../Apis/Project";
import { getUserApi } from "../../Apis/UsersApi";
import "./Admin.css";

class CreateProject extends Component {
  state = {
    name: "",
    description: "",
    client: "",
    start_date: "",
    end_date: "",
    loading: false,
    errorMessage: "",
    adminAddress: "",
    tokenId: null,
    userInfo: null,
    scanQR: false,
  };

  componentDidMount = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    await this.getUserInfo(accounts[0]);
    this.setState({ adminAddress: accounts[0] });
  };

  getUserInfo = async (address) => {
    await getUserApi(address).then((response) => {
      this.setState({ tokenId: response?.data?.response?.userInfo?.tokenId });
      this.setState({ userInfo: response?.data?.response?.userInfo });
    });
  };
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
    const { name, description, client, start_date, end_date, tokenId } =
      this.state;
    if (!name || !description || !client || !start_date || !end_date) {
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
      userAddress: this.state.adminAddress,
      tokenId: tokenId,
      signature: signature,
      name: name,
      description: description,
      client: client,
      start_date: start_date,
      end_date: end_date,
    };
    const response = await createProject(dataToSend);

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
      console.log("receipt: ", receipt);
      this.setState({ loading: false });
    } else {
      console.error("Transaction data is missing in the response.");
    }
  };

  handleChangeStartDate = (date) => {
    this.setState({ start_date: date });
  };

  handleChangeEndDate = (date) => {
    this.setState({ end_date: date });
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
                <h2 className="card-heading">Add new Project</h2>
              </Card.Header>
              <hr className="horizontal-line"></hr>
              <br></br>
              <Form error={!!this.state.errorMessage}>
                <Form.Field className="form-inputs-admin">
                  <input
                    id="name"
                    placeholder="Name"
                    autoComplete="off"
                    autoCorrect="off"
                    value={this.state.name}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <br />
                              
                <Form.Field className="form-inputs-admin">
                  <input
                    id="client"
                    placeholder="Client"
                    autoComplete="off"
                    autoCorrect="off"
                    value={this.state.client}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <br />
                <Form.Field
                  style={{ display: "flex", justifyContent: "center" }}
                  className="form-inputs-admin"
                >
                  <DatePicker
                    id="start_date"
                    placeholderText="Start Date"
                    autoComplete="off"
                    selected={this.state.start_date}
                    onChange={this.handleChangeStartDate}
                    className="date-style"
                    maxDate={this.state.end_date}
                  />

                  <DatePicker
                    id="end_date"
                    placeholderText="End Date"
                    autoComplete="off"
                    selected={this.state.end_date}
                    onChange={this.handleChangeEndDate}
                    minDate={this.state.start_date}
                    className="date-style"
                  />
                </Form.Field>
                <br/>
                <Form.Field className="form-inputs-admin">
                  <textarea
                    id="description"
                    placeholder="Description"
                    autoComplete="off"
                    autoCorrect="off"
                    value={this.state.description}
                    onChange={this.handleChange}
                  ></textarea>
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

export default withRouter(CreateProject);
