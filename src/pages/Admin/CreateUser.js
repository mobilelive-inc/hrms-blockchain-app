import React, { useState } from "react";
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
import "./Admin.css";

<<<<<<< Updated upstream
class CreateUser extends Component {
  state = {
    name: "",
    location: "",
    ethAddress: "",
    description: "",
    role: 0,
    loading: false,
    errorMessage: "",
    scanQR: false,
  };

  roleOptions = [
    {
      key: "0",
      text: "No-Role-Selected",
      value: "0",
    },
    {
      key: "1",
      text: "Employee",
      value: "1",
    },
    {
      key: "2",
      text: "OrganizationEndorser",
      value: "2",
    },
=======


function CreateUser(props) {
  const [role, setRole] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [scanQR, setScanQR] = useState(false);

  const roleOptions = [
    { key: "employee", text: "Employee", value: "employee" },
    { key: "admin", text: "Admin", value: "admin" },
    { key: "pm", text: "Project Manager", value: "pm" },
>>>>>>> Stashed changes
  ];

  const handleDropdownSelect = (e, data) => {
    setRole(data.value);
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { id, value } = e.target;
    switch (id) {
      case "first_name":
        setFirstName(value);
        break;
      case "last_name":
        setLastName(value);
        break;
      case "userAddress":
        setUserAddress(value);
        break;
      case "email":
        setEmail(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< Updated upstream
    const { ethAddress, name, location, role, description } = this.state;
    if (!name || !location || !description || !role || !ethAddress) {
      toast.error("Please fill all the fields!!");
=======
    if (!first_name || !last_name || !role || !userAddress) {
      toast.error("Please fill in the required fields!!");
>>>>>>> Stashed changes
      return;
    }
    setLoading(true);
    setErrorMessage("");

    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
<<<<<<< Updated upstream
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);

      const owner = await admin.methods.owner().call();
      if (owner !== accounts[0]) {
        this.setState({
          errorMessage: "Sorry! You are not the Admin!!",
          loading: false,
        });
        return;
=======
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
        setLoading(false);
>>>>>>> Stashed changes
      }
      try {
        await admin.methods
          .registerUser(ethAddress, name, location, description, role)
          .send({ from: accounts[0] });
        toast.success("New user registered succressfully!!!!");
        this.props.history.push(
          `${role === "1" ? "/" : "/all-organization-endorser"}`
        );
        this.setState({
          name: "",
          location: "",
          ethAddress: "",
          description: "",
          role: 0,
        });
      } catch (err) {
        this.setState({ errorMessage: err.message });
      }
      this.setState({ loading: false });
    }
  };

  const closeScanQRModal = () => {
    setScanQR(false);
  };

  const handleAddAddress = (res) => {
    setUserAddress(res);
  };

<<<<<<< Updated upstream
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
                    id="location"
                    placeholder="Location"
                    autoComplete="off"
                    autoCorrect="off"
                    value={this.state.location}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <br />
                <Form.Field className="form-inputs-admin">
                  <input
                    id="description"
                    placeholder="Description"
                    autoComplete="off"
                    autoCorrect="off"
                    value={this.state.description}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <br />
                <Form.Field className="form-inputs-admin">
                  <Input action className="form-inputs-admin">
                    <input
                      id="ethAddress"
                      placeholder="0x0"
                      autoComplete="off"
                      autoCorrect="off"
                      value={this.state.ethAddress}
                      onChange={this.handleChange}
                    />
                    <Button
                      type="button"
                      content="QR"
                      icon="qrcode"
                      onClick={() => this.setState({ scanQR: true })}
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
=======
  return (
    <>
      <ScanQR
        isOpen={scanQR}
        closeScanQRModal={closeScanQRModal}
        handleAddAddress={handleAddAddress}
      />
      <div className="create-user">
        <Card className="card-style">
          <Card.Content>
            <Card.Header centered>
              <h2 className="card-heading">Register New User</h2>
            </Card.Header>
            <hr className="horizontal-line"></hr>
            <br></br>
            <Form error={!!errorMessage}>
              <Form.Field className="form-inputs-admin">
                <input
                  id="first_name"
                  placeholder="First Name"
                  autoComplete="off"
                  autoCorrect="off"
                  value={first_name}
                  onChange={handleChange}
                />
              </Form.Field>
              <br />
              <Form.Field className="form-inputs-admin">
                <input
                  id="last_name"
                  placeholder="Last Name"
                  autoComplete="off"
                  autoCorrect="off"
                  value={last_name}
                  onChange={handleChange}
                />
              </Form.Field>
              <br />
              <Form.Field className="form-inputs-admin">
                <input
                  id="email"
                  placeholder="Email"
                  autoComplete="off"
                  autoCorrect="off"
                  value={email}
                  onChange={handleChange}
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
                    value={userAddress}
                    onChange={handleChange}
                  />
                </Input>
              </Form.Field>
              <br />
              <Form.Field className="form-inputs-admin">
                <Dropdown
                  placeholder="Select Role"
                  fluid
                  selection
                  options={roleOptions}
                  onChange={handleDropdownSelect}
                />
              </Form.Field>
              <br />
              <Message
                error
                header="Oops!!"
                content={errorMessage}
              />
              <br />
              <div className="button-holder">
                <Button
                  className="button-css-admin"
                  type="submit"
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={loading}
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
>>>>>>> Stashed changes
}

export default withRouter(CreateUser);
