import React, { Component } from "react";
import { toast } from "react-toastify";
import { Button, Form, Header, Modal } from "semantic-ui-react";
import Admin from "../abis/Admin.json";
import Employee from "../abis/Employee.json";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Modals.css";
import ScanQR from "./ScanQR";

export default class GetCertificationModal extends Component {
  state = {
    title: "",
    issuing_organization: "",
    issue_date: "",
    expiry_date: "",
    credential_id: "",
    credential_url: "",
    loading: false,
    scanQR: false,
  };

  handleSubmit = async (e) => {
    const {
      title,
      issuing_organization,
      issue_date,
      expiry_date,
      credential_id,
      credential_url,
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
    const accounts = await web3.eth.getAccounts();
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const employeeContractAddress = await admin?.methods
        ?.getEmployeeContractByAddress(accounts[0])
        .call();
      const EmployeeContract = await new web3.eth.Contract(
        Employee.abi,
        employeeContractAddress
      );
      try {
        await EmployeeContract.methods.addCertification().send({
          from: accounts[0],
        });
        toast.success("Certification saved successfullyy!!");
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    this.setState({ loading: false });
    this.props.closeCertificationModal();
  };

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
            content="Enter Certification Details"
            as="h2"
          />
          <Modal.Content className="modal-content">
            <Form className="form-inputs">
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
