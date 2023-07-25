import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Button, Card, Form, Message } from "semantic-ui-react";
import Admin from "../../abis/Admin.json";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
// import ScanQR from "../../components/ScanQR";
import { createProject } from "../../Apis/Project";
import { getUserApi } from "../../Apis/UsersApi";
import "./Admin.css";


function CreateProject(props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [client, setClient] = useState("");
  const [start_date, setStartDate] = useState(null);
  const [end_date, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [adminAddress, setAdminAddress] = useState("");
  const [tokenId, setTokenId] = useState(null);
  // const [userInfo, setUserInfo] = useState(null);
  // const [scanQR, setScanQR] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      await getUserInfo(accounts[0]);
      setAdminAddress(accounts[0]);
    };

    fetchData();
  }, []);

  const getUserInfo = async (address) => {
    await getUserApi(address).then((response) => {
      setTokenId(response?.data?.response?.userInfo?.tokenId);
      // setUserInfo(response?.data?.response?.userInfo);
    });
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { id, value } = e.target;
    switch (id) {
      case "name":
        setName(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "client":
        setClient(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !client || !start_date || !end_date) {
      toast.error("Please fill in the required fields!!");
      return;
    }
    setLoading(true);
    setErrorMessage("");
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
      setLoading(false);
    } else {
      console.error("Transaction data is missing in the response.");
    }
  };

  const handleChangeStartDate = (date) => {
    setStartDate(date);
  };

  const handleChangeEndDate = (date) => {
    setEndDate(date);
  };

  // const closeScanQRModal = () => {
  //   setScanQR(false);
  // };

  // const handleAddAddress = (res) => {
  //   setEthAddress(res);
  // };

  return (
    <>
      {/* <ScanQR
        isOpen={scanQR}
        closeScanQRModal={closeScanQRModal}
        handleAddAddress={handleAddAddress}
      /> */}
      <div className="create-user">
        <Card className="card-style">
          <Card.Content>
            <Card.Header centered>
              <h2 className="card-heading">Add new Project</h2>
            </Card.Header>
            <hr className="horizontal-line"></hr>
            <br></br>
            <Form error={!!errorMessage}>
              <Form.Field className="form-inputs-admin">
                <input
                  id="name"
                  placeholder="Name"
                  autoComplete="off"
                  autoCorrect="off"
                  value={name}
                  onChange={handleChange}
                />
              </Form.Field>
              <br />
              <Form.Field className="form-inputs-admin">
                <input
                  id="client"
                  placeholder="Client"
                  autoComplete="off"
                  autoCorrect="off"
                  value={client}
                  onChange={handleChange}
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
                  selected={start_date}
                  onChange={handleChangeStartDate}
                  className="date-style"
                  maxDate={end_date}
                />

                <DatePicker
                  id="end_date"
                  placeholderText="End Date"
                  autoComplete="off"
                  selected={end_date}
                  onChange={handleChangeEndDate}
                  minDate={start_date}
                  className="date-style"
                />
              </Form.Field>
              <br />
              <Form.Field className="form-inputs-admin">
                <textarea
                  id="description"
                  placeholder="Description"
                  autoComplete="off"
                  autoCorrect="off"
                  value={description}
                  onChange={handleChange}
                ></textarea>
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
                  Submit
                </Button>
              </div>
            </Form>
          </Card.Content>
        </Card>
      </div>
    </>
  );
}

export default withRouter(CreateProject);
