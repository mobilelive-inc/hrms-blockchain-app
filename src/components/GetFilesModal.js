import React, { Component } from "react";
import { toast } from "react-toastify";
import { Button, Form, Header, Modal } from "semantic-ui-react";
import axios from "axios";
import Web3 from "web3";
import Admin from "../abis/Admin.json";
import Employee from "../abis/Employee.json";
import "./Modals.css";
const formData = new FormData();
export default class GetFilesModal extends Component {
  state = {
    selectedFile: null,
    extension: null,
    fileName: null,
    loading: false,
  };

  handleFileChange = (event) => {
    const file = event.target.files[0];
    //console.log("file: ",file);
    formData.append("file", event.target.files[0], "graph.png");
    const extension = file.name.match(/\.[0-9a-z]+$/i)[0];
    //file.name.match(/\.[0-9a-z]+$/i)[0]; // get extension from file name
    console.log("extension: ", extension);
    this.setState({ extension });
    this.setState({ selectedFile: event.target.files[0] });
  };
  handleFileNameChange = (event) => {
    const fileName = event.target.value;
    formData.set("fileName", event.target.value);
    console.log("fileName: ",fileName);
    this.setState({ fileName });
  };
  handleSubmit = async (event) => {
    event.preventDefault();

    formData.append("extension", this.state.extension);

    console.log("Files: ", this.state.selectedFile);
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {

        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        console.log("User account:", accounts[0]);
        formData.append("userAddress", accounts[0]);
        console.log("formData: ", formData);

      } catch (error) {

        console.error(error);

      }
    } else {
      console.log("Please install MetaMask!");
    }

    this.setState({ loading: true });
    console.log(formData.getAll(this.selectedFile));
    axios
      .post(
        "https://dahoi8vjqm9s9.cloudfront.net/api/upload",formData
      )
      .then((response) => {
        console.log("response: ", response);
        if (response) {
          toast.success("File uploaded successfully!");
        } else {
          toast.error("Error uploading file.");
        }
        this.setState({ loading: false });
        this.props.closeCertificationModal();
      })
      .catch((error) => {
        console.log("error in catch: ", error);
        toast.error("Error uploading file in catch.");
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
