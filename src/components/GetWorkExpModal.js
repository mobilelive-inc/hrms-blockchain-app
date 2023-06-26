import React, { Component } from "react";
import { toast } from "react-toastify";
import { Button, Form, Header, Modal } from "semantic-ui-react";
import Admin from "../abis/Admin.json";
import Employee from "../abis/Employee.json";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Modals.css";
import ScanQR from "./ScanQR";
import ReactDatePicker from "react-datepicker";

export default class GetWorkExpModal extends Component {
  state = {
    title:"",
    employment_type:"",
    company_name:"",
    location:"",
    location_type:"",
    is_currently:"",
    start_date:"",
    end_date:"",
    description: "",
    loading: false,
    scanQR: false,
  };

  handleSubmit = async (e) => {
    const { title,employment_type,company_name,location,location_type,is_currently, start_date, end_date, description } = this.state;
    if (!title | !employment_type || !company_name || !location || !location_type || !is_currently || !start_date || !end_date || !description) {
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
        await EmployeeContract.methods
          .addWorkExp(title, company_name, start_date, end_date, description)
          .send({
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
    e.preventDefault();
    this.setState({ [e.target.id]: e.target.value });
  };

  handleChangeStartDate = (date) => {
    this.setState({ start_date: date });
  };
  
  handleChangeEndDate = (date) => {
    this.setState({ end_date: date });
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
            content="Enter Work Experience Details"
            as="h2"
          />
          <Modal.Content className="modal-content">
            <Form className="form-inputs">
              <Form.Field className="form-inputs">
                <input
                  id="title"
                  placeholder="Job Title"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.title}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field className="form-inputs">
                  <input
                    id="employment_type"
                    placeholder="Employment Type"
                    autoComplete="off"
                    autoCorrect="off"
                    value={this.state.organization}
                    onChange={this.handleChange}
                  />                  
              </Form.Field>
              <Form.Field className="form-inputs">
                <input
                  id="company_name"
                  placeholder="Company Name"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.company_name}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field className="form-inputs">
                <input
                  id="location"
                  placeholder="Location"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.location}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field className="form-inputs">
                <input
                  id="location_type"
                  placeholder="Location Type"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.location_type}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field className="form-inputs">
                <input
                  id="is_currently"
                  placeholder="Currently Working?"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.is_currently}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field className="form-inputs">
                  <DatePicker
                    id="start_date"
                    placeholderText="Start Date"
                    autoComplete="off"
                    selected={this.state.start_date}
                    onChange={this.handleChangeStartDate} 
                    className="datepicker-style"
                    maxDate={this.state.end_date}
                  />

                  <DatePicker
                    id="end_date"
                    placeholderText="End Date"
                    autoComplete="off"
                    selected={this.state.end_date}
                    onChange={this.handleChangeEndDate} 
                    className="datepicker-style"
                    minDate={this.state.start_date}
                  />
                </Form.Field>
              <Form.Field className="form-inputs">
                <input
                  id="description"
                  placeholder="Description"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </Form.Field>
              
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
