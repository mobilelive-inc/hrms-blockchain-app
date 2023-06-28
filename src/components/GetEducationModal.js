import React, { Component } from "react";
import { toast } from "react-toastify";
import { Button, Form, Header, Modal } from "semantic-ui-react";
import Admin from "../abis/Admin.json";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO } from 'date-fns';
import { addEducation, updateEducation } from "../Apis/EmployeeEducationApi";
import "./Modals.css";
import ScanQR from "./ScanQR";

export default class GetEducationModal extends Component {
  state = {
    school: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    grade: "",
    description: "",
    editing: false,
    
  };

  handleSubmit = async (e) => {
    const {
      school,
      degree,
      field_of_study,
      start_date,
      end_date,
      description,
      editing,
    } = this.state;

    if (
      !school ||
      !degree ||
      !field_of_study ||
      !start_date ||
      !end_date ||
      !description
    ) {
      toast.error("Please enter all the fields.");
      return;
    }
    this.setState({ loading: true });
    e.preventDefault();
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

    const tokenId = this.props.tokenId;
    const index=this.props.index;
    if (!editing) {
      console.log("In add");
      console.log("ed: ",editing)
      const dataToSend = {
        tokenId: tokenId,
        signature: signature,
        school: school,
        degree: degree,
        field_of_study: field_of_study,
        start_date: start_date,
        end_date: end_date,
        description: description,
      };
      dataToSend.userAddress = accounts[0];
      try {
        await addEducation(dataToSend).then((response) => {
          console.log("education: ", response);
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

        toast.success("Education saved successfullyy!!");
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      //update logic
      console.log("In update");
      console.log("a",editing)
      const dataToSend = {
        signature: signature,
        school: school,
        degree: degree,
        field_of_study: field_of_study,
        start_date: start_date,
        end_date: end_date,
        description: description,
        index:index
      };
      dataToSend.userAddress = accounts[0];
      try {
        await updateEducation(dataToSend,tokenId).then((response) => {
          console.log("education: ", response);
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

        toast.success("Education updated successfullyy!!");
      } catch (err) {
        toast.error(err.message);
      }
    }

    
  };

  componentDidUpdate(prevProps) {

    if (prevProps.education !== this.props.education) {
      
      
      const {
        school = "",
        degree = "",
        field_of_study = "",
        description = "",
      } = this.props.education || {};
      let {
        start_date = "",
        end_date = "",
      } =this.props.education || {};

      if (start_date){
        start_date=parseISO(start_date.toString())
      }
      else{
        start_date=""
      }
      if (end_date){
        end_date=parseISO(end_date.toString())
      }
      else{
        end_date=""
      }
      
      this.setState({
        school,
        degree,
        field_of_study,
        start_date:start_date,
        end_date:end_date,
        description,
        editing: true,
      });
      
    }
  }

  handleChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.id]: e.target.value });
  };

  handleChangeStartDate = (date) => {
    console.log("start date: ",date)
    this.setState({ start_date: date });
  };

  handleChangeEndDate = (date) => {
    console.log("end date: ",date);
    this.setState({ end_date: date });
  };

  closeScanQRModal = () => {
    this.setState({ scanQR: false });
  };

  handleAddAddress = (education) => {
    this.setState({ school: education });
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
                ? "Edit Education Details"
                : "Enter Education Details"
            }
            as="h2"
          />
          <Modal.Content className="modal-content">
            <Form className="form-inputs">
              <Form.Field className="form-inputs">
                <input
                  id="school"
                  placeholder="School"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.school}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field className="form-inputs">
                <input
                  id="degree"
                  placeholder="Degree"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.degree}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field className="form-inputs">
                <input
                  id="field_of_study"
                  placeholder="Field of Study"
                  autoComplete="off"
                  autoCorrect="off"
                  value={this.state.field_of_study}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
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
              </div>
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
