import React, { Component } from "react";
import { toast } from "react-toastify";
import { Button, Form, Header, Modal } from "semantic-ui-react";
import Admin from "../abis/Admin.json";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addCertificationApi,updateCertificationApi } from "../Apis/EmployeeCertApi";
import "./Modals.css";
import { parseISO } from 'date-fns';
import ScanQR from "./ScanQR";

export default class GetCertificationModal extends Component {
  state = {
    title: "",
    issuing_organization: "",
    issue_date: "",
    expiry_date: "",
    credential_id: "",
    credential_url: "",
    index:0,
    editing:false,
    loading: false,
    scanQR: false,
  };

  handleSubmit = async (e) => {
    const tokenId=this.props.tokenId;
    const index=this.props.index;
    const {
      title,
      issuing_organization,
      issue_date,
      expiry_date,
      credential_id,
      credential_url,
      editing
    } = this.state;
    if (
      !title ||
      !issuing_organization ||
      !issue_date ||
      !expiry_date ||
      !credential_id ||
      !credential_url
    ) {
      toast.error("Please enter all the fields.");
      return;
    }
    this.setState({ loading: true });
    e.preventDefault();
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    console.log(AdminData);
    const accounts = await web3.eth.getAccounts();
    const messageToR = `0x${Buffer.from(
      "Please confirm to verify info update",
      "utf8"
    ).toString("hex")}`;
    const signature = await web3.eth.personal.sign(messageToR, accounts[0]);
    console.log("field: ", signature);
 if (!editing){
  console.log("In add")
    const dataToSend={
      signature:signature,
      title:title,
      issuing_organization:issuing_organization,
      issue_date:issue_date,
      expiry_date:expiry_date,
      credential_id:credential_id,
      credential_url:credential_url,
      userAddress:accounts[0],
      index:index
    }
    try {
      await addCertificationApi(dataToSend,tokenId).then((response) => {
        console.log("certification: ", response);
        const transaction = response?.data?.response?.transactionData;
        transaction.from = accounts[0];

        const receipt = web3.eth.sendTransaction(transaction)
        .then((res) => {
          return new Promise((resolve) => setTimeout(resolve, 7000));
        })
        .then(()=>{
          this.setState({ loading: false });
          this.props.closeCertificationModal();
        })
        console.log("receipt > ", receipt);
      });

      toast.success("Certification saved successfullyy!!");
    } catch (err) {
      toast.error(err.message);
    } 
  } 
  else {
    console.log("In update");
    const dataToSend={
      signature:signature,
      title:title,
      issuing_organization:issuing_organization,
      issue_date:issue_date,
      expiry_date:expiry_date,
      credential_id:credential_id,
      credential_url:credential_url,
      userAddress:accounts[0],
      index:1
    }

    try {
      await updateCertificationApi(dataToSend,tokenId).then((response) => {
        console.log("certification: ", response);
        const transaction = response?.data?.response?.transactionData;
        transaction.from = accounts[0];

        const receipt = web3.eth.sendTransaction(transaction)
        .then((res) => {
          return new Promise((resolve) => setTimeout(resolve, 7000));
        })
        .then(()=>{
          this.setState({ loading: false });
          this.props.closeCertificationModal();
        })
        console.log("receipt > ", receipt);
      });

      toast.success("Certification updated successfullyy!!");
    } catch (err) {
      toast.error(err.message);
    }



  } 
  };

  componentDidUpdate(prevProps) {

    if (prevProps.certification !== this.props.certification) {
      
      
      const {
        title = "",
        issuing_organization = "",
        credential_id="",
        credential_url="",
      } = this.props.certification || {};
      let {
        issue_date = "",
        expiry_date="",
      } =this.props.certification || {};

      if (issue_date){
        issue_date=parseISO(issue_date.toString())
      }
      else{
        issue_date=""
      }
      if (expiry_date){
        expiry_date=parseISO(expiry_date.toString())
      }
      else{
        expiry_date=""
      }
      
      this.setState({
        title,
        issuing_organization,
        credential_id,
        credential_url,
        issue_date:issue_date,
        expiry_date:expiry_date,
        editing: true,
      });
      
    }
  }


  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  handleChangeIssueDate = (date) => {
    this.setState({ issue_date: date });
  };
  
  handleChangeExpiryDate = (date) => {
    this.setState({ expiry_date: date });
  };
  
  closeScanQRModal = () => {
    this.setState({ scanQR: false });
  };

  handleAddAddress = (res) => {
    this.setState({ organization: res });
  };

  render() {
    return (
      <>
        <ScanQR
          isOpen={this.state.scanQR}
          closeScanQRModal={this.closeScanQRModal}
          handleAddAddress={this.handleAddAddress}
        />
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
            content={
              this.state.editing
                ? "Edit Certification Details"
                : "Enter Certification Details"
            }
            as="h2"
          />
          <Modal.Content className="modal-content">
            <Form className="form-inputs">
            <Form.Field className="form-inputs">
                <input
                  id="credential_id"
                  placeholder="Credential Id"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.credential_id}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field className="form-inputs">
                <input
                  id="title"
                  placeholder="Title"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.title}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field className="form-inputs">
                <input
                  id="issuing_organization"
                  placeholder="Issuing Organization"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.issuing_organization}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field className="form-inputs">
                <input
                  id="credential_url"
                  placeholder="Credential URL"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.credential_url}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Form.Field className="form-inputs">
                  <DatePicker
                    id="issue_date"
                    placeholderText="Issue Date"
                    autoComplete="off"
                    selected={this.state.issue_date}
                    onChange={this.handleChangeIssueDate} 
                    className="datepicker-style"
                    maxDate={this.state.expiry_date}
                  />

                  <DatePicker
                    id="expiry_date"
                    placeholderText="Expiry Date"
                    autoComplete="off"
                    selected={this.state.expiry_date}
                    onChange={this.handleChangeExpiryDate} 
                    className="datepicker-style"
                    minDate={this.state.issue_date}
                  />
                </Form.Field>
              </div>
            </Form>
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
      </>
    );
  }
}
