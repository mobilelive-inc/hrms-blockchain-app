import React from "react";
import { withRouter, Link } from "react-router-dom";
import { useEffect,useState } from "react";
import { Button, Modal, Header, Grid } from "semantic-ui-react";
import { getUserApi } from "../../Apis/UsersApi";
import { deleteResource } from "../../Apis/Project";

import "./Admin.css";
import { toast } from "react-toastify";

let accounts=null;

const ViewResources = (props) => {
  const [tokenId,setTokenId]=useState(null);
  const [loading,setLoading]=useState(false);
  const web3=window.web3;
  console.log(props.index)
  useEffect(() => {
    const fetchData = async () => {
      accounts = await web3.eth.getAccounts();
      const response = await getUserApi(accounts[0]);
      setTokenId(response?.data?.response?.userInfo?.tokenId);
      console.log("response: ",response?.data?.response)    
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const shortenAddress = (address) =>
    `${address.slice(0, 10)}...${address.slice(address.length - 4)}`;
    
    const handleDeleteResource= async(resource_index,tokenId)=>{
      setLoading(true);
    const web3 = window.web3;
      const messageToR = `0x${Buffer.from(
        "Please confirm to verify info update",
        "utf8"
      ).toString("hex")}`;
      const signature = await web3.eth.personal.sign(messageToR, accounts[0]);
      console.log("field: ", signature);  
      const i=Number(`${props.index}${tokenId}`);
      console.log(i);
      const dataToSend={
        userAddress:accounts[0],
        projectId:i,
        signature:signature,
      }
      console.log(dataToSend)
      const response = await deleteResource(dataToSend,resource_index);
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
        if (receipt){
          props.resources.filter((item,index) => index !== resource_index)
          toast.success("Resource removed successfully")
          props.closeResourceViewModal();
          setLoading(false)
        }
        console.log(receipt)
      console.log(response)
      }
    }
  return (
    <Modal open={props.isOpen} size="tiny" className="modal-des">
      <Header
        className="modal-heading"
        icon="pencil"
        content="List of Resources"
        as="h2"
      />
      <Modal.Content className="content-css">
        <Grid columns={4}>
          <Grid.Row style={{ paddingBottom: "0.5rem", paddingTop: "0.5rem" }}>
            <Grid.Column>
              <p style={{ marginBottom: "0px" }}>Resource Name</p>
            </Grid.Column>
            <Grid.Column>
              <p style={{ marginBottom: "0px" }}>Resource Address</p>
            </Grid.Column>
            <Grid.Column>
              <p style={{ marginBottom: "0px" }}>Allocation Type</p>
            </Grid.Column>
            <Grid.Column>
              <p style={{ marginBottom: "0px" }}>Action</p>
            </Grid.Column>
          </Grid.Row>
          {props.resources.length !== 0 ? (
            props.resources.map((resource, index) => {
              return (
                <Grid.Row
                  style={{ paddingBottom: "0.5rem", paddingTop: "0.5rem" }}
                  key={index}
                >
                  <Grid.Column>
                    <Link to={`/getemployee/${resource.resource_token}`}>
                      {resource.resource_name}
                    </Link>
                  </Grid.Column>
                  <Grid.Column>
                    {shortenAddress(resource.resource_token)}
                  </Grid.Column>
                  <Grid.Column>{resource.allocation_type}</Grid.Column>
                  <Grid.Column>
                  <button
                  className="add-button"
                  style={{float:"none"}}
                  onClick={(e) => {
                    handleDeleteResource(index,tokenId)
                  }}
                >
                  <i className="fas fa-trash"></i>
                </button>
                  </Grid.Column>
                </Grid.Row>
              );
            })
          ) : (
            <p>No resources to display!</p>
          )}
        </Grid>
      </Modal.Content>
      <Modal.Actions className="modal-actions">
        <Button
          className="close-button"
          type="button"
          color="red"
          content="Close"
          loading={loading}
          onClick={() => props.closeResourceViewModal()}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default withRouter(ViewResources);
