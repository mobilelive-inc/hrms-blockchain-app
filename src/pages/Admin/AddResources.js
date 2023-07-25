import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Button, Form, Modal, Dropdown, Header } from "semantic-ui-react";
import { toast } from "react-toastify";
import { getUserApi } from "../../Apis/UsersApi";
import { getAllUsers } from "../../Apis/Admin";
import { addResource } from "../../Apis/Project";
import "./Admin.css";

function AddResources(props) {
  const [resource_name, setResourceName] = useState("");
  const [allocation_type, setAllocationType] = useState("");
  const [resource_token, setResourceToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminAddress,setAdminAddress] = useState("");
  const [users, setUsers] = useState([]);
  const [tokenId, setTokenId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      const response = await getUserApi(accounts[0]);
      setAdminAddress(accounts[0]);
      setTokenId(response?.data?.response?.userInfo?.tokenId);
      const employees = await getAllUsers();
      setUsers(employees?.data?.response?.usersList);
    };

    fetchData();
  }, [props.index]);

  

  const handleChange = (e, data) => {
    e.preventDefault();
    const { id, value } = data;
  
    if (id === "resource_name") {
      const splitValue = value.split("-");
      console.log("res: ", splitValue);
      setResourceToken(splitValue[0]);
      setResourceName(splitValue[1]);
    } else if (id === "allocation_type") {
      console.log("res2: ", value);
      setAllocationType(value);
    }
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resource_name || !allocation_type) {
      toast.error("Please fill in the required fields!!");
      return;
    }
    setLoading(true);

    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const messageToR = `0x${Buffer.from(
      "Please confirm to verify info update",
      "utf8"
    ).toString("hex")}`;
    const signature = await web3.eth.personal.sign(messageToR, accounts[0]);
    
    const projectId = Number(`${props.index}${tokenId}`);

    const dataToSend = {
      userAddress: adminAddress,
      signature: signature,
      allocated_by: tokenId.toString(),
      allocation_type: allocation_type,
      resource_name: resource_name,
      resource_token: resource_token,
      projectId: projectId,
    };
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
      if (receipt) {
        setResourceName("");
        setAllocationType("");
        setResourceToken(null);
        setLoading(false);
        toast.success("Resource allocated successfully");
        console.log("receipt: ", receipt);
        setLoading(false);
        props.closeResourceModal();
      }
    } else {
      console.error("Transaction data is missing in the response.");
    }
  };

  const allocation_option = [
    { key: "full_time", text: "Full Time", value: "full_time" },
    { key: "part_time", text: "Part Time", value: "part_time" },
    { key: "contract", text: "Contract", value: "contract" },
  ];

  const userOptions = users
    .filter((user) => user.first_name && user.last_name !== "" && user.role === "employee")
    .map((user) => ({
      text: user.first_name + " " + user.last_name + " - " + user.role,
      value: user.proxyAddress + "-" + user.first_name + " " + user.last_name,
    }));

  return (
    <Modal
      as={Form}
      onSubmit={(e) => handleSubmit(e)}
      open={props.isOpen}
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
        <input type="hidden" value={props.index} />
        <Dropdown
          id="resource_name"
          placeholder="Resource Name"
          fluid
          selection
          options={userOptions}
          onChange={(e, data) => handleChange(e, data)}

        />
        <Dropdown
          id="allocation_type"
          placeholder="Allocation Type"
          fluid
          selection
          autoComplete="off"
          autoCorrect="off"
          options={allocation_option}
          onChange={(e, data) => handleChange(e, data)}

        />
      </Modal.Content>
      <Modal.Actions className="modal-actions">
        <Button
          className="close-button"
          type="button"
          color="red"
          icon="times"
          content="Close"
          onClick={() => props.closeResourceModal()}
        />
        <Button
          className="button-css"
          type="submit"
          color="green"
          icon="save"
          content="Save"
          loading={loading}
          disabled={loading}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default withRouter(AddResources);
