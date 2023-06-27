import React, { Component } from "react";
import { toast } from "react-toastify";
import { Button, Form, Header, Modal } from "semantic-ui-react";
import "./Modals.css";
import contract_abi from "./../abis/UserFileUpload.json";
import { postFileApi } from "../Apis/FileApi";
import { IPFS_Link } from "../utils/utils";

let accounts = null;
export default class GetFilesModal extends Component {
  state = {
    selectedFile: null,
    extension: null,
    file:null,
    fileName: null,
    userAddress:null,
    loading: false,
  };
  formData = new FormData();
  
  handleFileChange = (event) => {
    const file = event.target.files[0];
    this.setState({file:file});
    this.formData.append("file", file);
    this.setState({ selectedFile: event.target.files[0] });
  };
  handleFileNameChange = (event) => {
    const fileName = event.target.value;
    this.setState({ fileName: fileName });

  };
  
  uploadFile = async (walletAccount, fileName, extension, ipfsHash) => {
    try {
      const web3 = window.web3;
      const contractAddress = "0x2A750e6d8f167c65Be6C73935c6ccDAdfd84b83f";
      const contractABI = contract_abi.abi;
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      await contract.methods
        .uploadFile(
          walletAccount,
          fileName,
          extension,
          ipfsHash.replace(IPFS_Link, "")
        )
        .send({ from: accounts[0] })
        .then((res) => {
          return new Promise((resolve) => setTimeout(resolve, 7000));
        })
        .then(() => {
          this.setState({ loading: false });
          this.props.closeCertificationModal();
        });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    if (window.ethereum) {
      const web3 = window.web3;

      try {
        accounts = await web3.eth.getAccounts();
        this.setState({userAddress:accounts[0]});
        this.formData.append("fileName", this.state.fileName);
        this.formData.append("userAddress", accounts[0]);
        console.log("formData: ",this.formData);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Please install MetaMask!");
    }
    
    this.setState({ loading: true });
    await postFileApi(this.formData)
      .then((response) => {
        if (response) {
          console.log(response?.response?.userAddress)  
          this.uploadFile(
            response?.response?.userAddress,
            response?.response?.fileName,
            ".png",
            response?.response?.filePath[0]?.path
          );
          toast.success("File uploaded successfully!");
        } else {
          toast.error("Error uploading file.");
          this.setState({ loading: false });
          this.props.closeCertificationModal();
        }
      })
      .catch((error) => {
        toast.error("Error uploading file in catch.", error);
        console.log("a", error);
        this.setState({ loading: false });
      });
  };

  render() {
    return (
      <Modal
        as={Form}
        onSubmit={this.handleSubmit}
        open={this.props.isOpen}
        size="tiny"
        className="modal-des"
        //encType="multipart/form-data"
      >
        <Header
          className="modal-heading"
          icon="pencil"
          content="Upload Files"
          as="h2"
        />
        <Modal.Content className="modal-content">
          <input
            type="text"
            placeholder="File Name"
            onChange={this.handleFileNameChange}
          />
          <input type="file" onChange={this.handleFileChange} />
        </Modal.Content>
        <Modal.Actions className="modal-actions">
          <Button
            className="close-button"
            type="button"
            color="red"
            icon="times"
            content="Close"
            onClick={() => this.props.closeCertificationModal()}
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
