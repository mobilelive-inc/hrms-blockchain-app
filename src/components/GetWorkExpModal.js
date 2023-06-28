import React, { Component } from "react";
import { toast } from "react-toastify";
import { Button, Form, Header, Modal } from "semantic-ui-react";
import Admin from "../abis/Admin.json";
import {
  addExperienceApi,
  updateExperienceApi,
} from "../Apis/EmployeeExperienceApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Modals.css";
import ScanQR from "./ScanQR";
import moment from "moment";
import { parseISO } from 'date-fns';


export default class GetWorkExpModal extends Component {
  state = {
    title: "",
    employment_type: "",
    company_name: "",
    location: "",
    location_type: "",
    is_currently: "",
    start_date: "",
    end_date: "",
    description: "",
    index:0,
    editing: false,
    loading: false,
    scanQR: false,
  };

  handleSubmit = async (e) => {
    const tokenId = this.props.tokenId;
    const index = this.props.index;
    const {
      title,
      employment_type,
      company_name,
      location,
      location_type,
      is_currently,
      start_date,
      editing,
    } = this.state;
    if (
      !title || !employment_type ||
      !company_name ||
      !location ||
      !location_type
      
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
    console.log(AdminData);
    const messageToR = `0x${Buffer.from(
      "Please confirm to verify info update",
      "utf8"
    ).toString("hex")}`;
    const signature = await web3.eth.personal.sign(messageToR, accounts[0]);
    if (!editing) {

      const dataToSend = {
        tokenId: tokenId,
        signature: signature,
        userAddress: accounts[0],
        title: title,
        employment_type: employment_type,
        company_name: company_name,
        location: location,
        location_type: location_type,
        is_currently: is_currently,
        start_date: moment(start_date).format("DD-MM-YYYY"),
        //end_date: moment(end_date).format("DD-MM-YYYY"),
        //description: description,
      };
      
      try {
        await addExperienceApi(dataToSend).then((response) => {
          const transaction = response?.data?.response?.transactionData;
          transaction.from = accounts[0];

          const receipt = web3.eth
            .sendTransaction(transaction)
            .then((res) => {
              return new Promise((resolve) => setTimeout(resolve, 7000));
            })
            .then(() => {
              this.setState({ loading: false });
              this.props.closeCertificationModal();
            });
          console.log("receipt > ", receipt);
        });

        toast.success("Work Experience saved successfullyy!!");
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      const dataToSend = {
        signature: signature,
        userAddress: accounts[0],
        title: title,
        employment_type: employment_type,
        company_name: company_name,
        location: location,
        location_type: location_type,
        is_currently: is_currently,
        start_date: moment(start_date).format("DD-MM-YYYY"),
        //end_date: end_date,
        //description: description,
        index: index,
      };

      try {
        await updateExperienceApi(dataToSend, tokenId).then((response) => {
          const transaction = response?.data?.response?.transactionData;
          transaction.from = accounts[0];

          const receipt = web3.eth
            .sendTransaction(transaction)
            .then((res) => {
              return new Promise((resolve) => setTimeout(resolve, 7000));
            })
            .then(() => {
              this.setState({ loading: false });
              this.props.closeCertificationModal();
            });
          console.log("receipt > ", receipt);
        });

        toast.success("Experience updated successfullyy!!");
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  componentDidUpdate(prevProps) {
    
    if (prevProps.workExp !== this.props.workExp) {
      const {
        title,
        employment_type,
        company_name,
        location,
        location_type,
        is_currently,
        // description,
      } = this.props.workExp || {};

      let {
        start_date = "",
        //end_date = "",
      } =this.props.workExp || {};

      if (start_date){
        start_date=parseISO(start_date.toString())
      }
      else{
        start_date=""
      }
      // if (end_date){
      //   end_date=parseISO(end_date.toString())
      // }
      // else{
      //   end_date=""
      // }
      this.setState({
        title,
        employment_type,
        company_name,
        location,
        location_type,
        is_currently,
        start_date,
        // end_date,
        // description,
        editing: true,
      });
    }
  }

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
                  value={this.state.employment_type}
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
