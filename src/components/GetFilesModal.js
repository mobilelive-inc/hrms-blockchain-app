import React, { Component } from "react";
import { toast } from "react-toastify";
import { Button, Form, Header, Modal } from "semantic-ui-react";
import axios from "axios";
import Web3 from "web3";
import Admin from "../abis/Admin.json";
import Employee from "../abis/Employee.json";
import "./Modals.css";

export default class GetFilesModal extends Component {
  state = {
    file: null,
    extension:null,
    fileName:null,
    loading: false,
  };

  handleFileChange = (event) => {
    const file = event.target.files[0];
    const extension = file.name.match(/\.[0-9a-z]+$/i)[0]; // get extension from file name
    console.log("extension: ", extension);
    this.setState({ file, extension });
  };
  handleFileNameChange=(event)=>{
    const fileName=event.target.value;
    this.setState({fileName});
  }
  handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", this.state.file);
    formData.append("extension",this.state.extension);
    formData.append("fileName",this.state.fileName)

    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.enable();
        // Get the user's accounts
        const accounts = await web3.eth.getAccounts();
        console.log("User account:", accounts[0]);
        // Add user account to formData
        formData.append("userAddress", accounts[0]);
        console.log("formData: ",formData);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Please install MetaMask!");
    }
    console.log(this.state.file);
    
    this.setState({ loading: true });
    console.log(JSON.stringify(formData))
    axios.post("http://localhost:5000/upload",formData)
    .then((response)=>{
      console.log("response: ",response);
      if (response){
        toast.success("File uploaded successfully!");
      }
      else{
        toast.error("Error uploading file.");
      }
      this.setState({ loading: false });
      this.props.closeCertificationModal();
    })
    .catch((error)=>{
      console.log("error in catch: ",error)
      toast.error("Error uploading file in catch.");
      this.setState({loading:false});
    })

    
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
        <input type="text" placeholder="File Name" onChange={this.handleFileNameChange} />
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
