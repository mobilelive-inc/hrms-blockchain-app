import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button, Form, Modal, Header } from "semantic-ui-react";
import Admin from "../../abis/Admin.json";
// import { toast } from "react-toastify";
// import { getProjects } from "../../Apis/Project";
import { getUserApi } from "../../Apis/UsersApi";
import { getAllUsers } from "../../Apis/Admin";
import { addResource } from "../../Apis/Project";
import "./Admin.css";

class AddResources extends Component {
  state = {
    resource_name: "",
    allocation_type:"",
    resource_token: null,
    loading: false,
    errorMessage: "",
    adminAddress: "",
    users: [],
    tokenId: null,
    projectId: null,
    userInfo: null,
    scanQR: false,
  };

  componentDidMount = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    await this.getUserInfo(accounts[0]);
    this.setState({ adminAddress: accounts[0] });
    const employees = await getAllUsers();
    console.log("employees: ", employees?.data?.response?.usersList);
    this.setState({ users: employees?.data?.response?.usersList });
    console.log("a: ", this.props.index);
  };

  getUserInfo = async (address) => {
    await getUserApi(address).then((response) => {
      this.setState({ tokenId: response?.data?.response?.userInfo?.tokenId });
      this.setState({ userInfo: response?.data?.response?.userInfo });
    });
  };

  handleChange = (e) => {
    e.preventDefault();
    this.setState({
      [e.target.id]: e.target.value,
    });
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    const { resource_name, adminAddress, allocation_type,resource_token } =
      this.state;
    // if (!resource_name) {
    //   toast.error("Please fill in the required fields!!");
    //   return;
    // }
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
      userAddress: adminAddress,
      signature: signature,
      allocated_by: this.state.tokenId,
      allocation_type: allocation_type,
      resource_name:resource_name,
      resource_token:resource_token
    };
    console.log("data: ", dataToSend);
    const response = await addResource(dataToSend);

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

  closeScanQRModal = () => {
    this.setState({ scanQR: false });
  };

  handleAddAddress = (res) => {
    this.setState({ ethAddress: res });
  };
  allocation_option = [
    { key: "full_time", text: "Full Time", value: "full_time" },
    { key: "part_time", text: "Part Time", value: "part_time" },
    { key: "contract", text: "Contract", value: "contract" },
  ];
  render() {
    const { users } = this.state;

    // Create an array of options for the dropdown fields
    const userOptions = users.map((user) => ({
      key: user.userAddress,
      value: user.userAddress,
      text: user.name,
    }));

    return (
      <Modal
        as={Form}
        onSubmit={(e) => this.handleSubmit(e)}
        open={this.props.isOpen}
        size="tiny"
        className="modal-des"
      >
        <Header
          className="modal-heading"
          icon="pencil"
          content="Add Resource"
          as="h2"
        />
        <Modal.Content className="modal-content">
          <Form className="form-inputs">
            <Form.Field className="form-inputs">
              <Form.Dropdown
                id="resource_name"
                placeholder="Resource Name"
                options={userOptions}
                // value={resource_name}
                onChange={(e, { value }) =>
                  this.setState({ resource_name: value })
                }
                
              />
            </Form.Field>
            <Form.Field className="form-inputs">
            <Form.Dropdown
                id="allocation_type"
                placeholder="Allocation Type"
                autoComplete="off"
                autoCorrect="off"
                options={this.allocation_option}
                onChange={(e, { value }) =>
                  this.setState({ allocation_type: value })
                }
              />
            </Form.Field>
            
          </Form>
        </Modal.Content>
        <Modal.Actions className="modal-actions">
          <Button
            className="close-button"
            type="button"
            color="red"
            icon="times"
            content="Close"
            onClick={() => this.props.closeResourceModal()}
          />
          <Button
            className="button-css"
            type="submit"
            color="green"
            icon="save"
            content="Save"
            loading={this.state.loading}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default withRouter(AddResources);
