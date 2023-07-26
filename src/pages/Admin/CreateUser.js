import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { Button, Card, Dropdown, Form, Input, Message } from "semantic-ui-react";
import Admin from "../../abis/Admin.json"; // Check if the import path is correct
import { toast } from "react-toastify";
import ScanQR from "../../components/ScanQR";
import { createUser } from "../../Apis/UsersApi";
import "./Admin.css";

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

    if (!first_name || !last_name || !role || !userAddress) {
      toast.error("Please fill in the required fields!!");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const web3 = window.web3;
      const networkId = await web3.eth.net.getId();
      const AdminData = Admin.networks[networkId]; // Check if AdminData is not null
      console.log(AdminData);

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
        }
      } else {
        toast.error("Transaction data is missing in the response.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }

    setLoading(false);
  };

  const closeScanQRModal = () => {
    setScanQR(false);
  };

  const handleAddAddress = (res) => {
    setUserAddress(res);
  };

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
              <Message error header="Oops!!" content={errorMessage} />
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
}

export default withRouter(CreateUser);
