import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Button, Form, Header, Input, Modal } from "semantic-ui-react";
import Admin from "../abis/Admin.json";
import Employee from "../abis/Employee.json";
import "./Modals.css";
// import ScanQR from "./ScanQR";
import moment from "moment";
import { parse } from "date-fns";

const GetWorkExpModal = (props) => {
  const [title, setTitle] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [locationType, setLocationType] = useState("");
  const [isCurrently, setIsCurrently] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  // const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  // const scanQRRef = useRef(false);

  const prevWorkRef = useRef(props.workExp);

  useEffect(() => {
    if (prevWorkRef.current !==props.workExp) {
      const {
        title = "",
        employment_type = "",
        company_name = "",
        location = "",
        location_type = "",
        is_currently = "",
        start_date,
        end_date,
        // description,
      } = props.workExp || {};

      let parsedStartDate = null;
      let parsedEndDate = null;

      parsedStartDate = moment(start_date).format("DD-MM-YYYY");
      parsedStartDate = parse(parsedStartDate, "dd-MM-yyyy", new Date());

      parsedEndDate = moment(end_date).format("DD-MM-YYYY");
      parsedEndDate = parse(parsedEndDate, "dd-mm-yyyy", new Date());

      setTitle(title);
      setEmploymentType(employment_type);
      setCompanyName(company_name);
      setLocation(location);
      setLocationType(location_type);
      setIsCurrently(is_currently);
      setStartDate(parsedStartDate);
      setEndDate(parsedEndDate);
      // setDescription(description);
      // setEditing(true);
    }

    prevWorkRef.current=props.workExp;
  }, [props.workExp]);

  const handleSubmit = async (e) => {
    const tokenId = props.tokenId;
    const index = props.index;
    if (
      !title ||
      !employmentType ||
      !companyName ||
      !location ||
      !locationType
    ) {
      toast.error("Please enter all the fields.");
      return;
    }
    setLoading(true);
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

    if (!props.editing) {
      const dataToSend = {
        tokenId: tokenId,
        signature: signature,
        userAddress: accounts[0],
        title: title,
        employment_type: employmentType,
        company_name: companyName,
        location: location,
        location_type: locationType,
        is_currently: isCurrently,
        start_date: startDate,
        //end_date: end_date,
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
              setLoading(false);
              props.closeCertificationModal();
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
        employment_type: employmentType,
        company_name: companyName,
        location: location,
        location_type: locationType,
        is_currently: isCurrently,
        start_date: startDate,
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
              setLoading(false);
              props.closeCertificationModal();
            });
          console.log("receipt > ", receipt);
        });

        toast.success("Experience updated successfullyy!!");
      } catch (err) {
        toast.error(err.message);
      }
    }
    this.setState({ loading: false });
    this.props.closeCertificationModal();
  };

  const handleChangeStartDate = (date) => {
    setStartDate(date);
  };

  const handleChangeEndDate = (date) => {
    setEndDate(date);
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { id, value } = e.target;
    switch (id) {
      case "title":
        setTitle(value);
        break;
      case "employment_type":
        setEmploymentType(value);
        break;
      case "company_name":
        setCompanyName(value);
        break;
      case "location":
        setLocation(value);
        break;
      case "location_type":
        setLocationType(value);
        break;
      case "is_currently":
        setIsCurrently(value);
        break;
      case "description":
        setDescription(value);
        break;
      default:
        break;
    }
  };

  // const closeScanQRModal = () => {
  //   scanQRRef.current = false;
  // };

  // const handleAddAddress = (res) => {
  //   setOrganization(res);
  // };

  return (
    <>
      {/* <ScanQR
        isOpen={scanQRRef.current}
        closeScanQRModal={closeScanQRModal}
        handleAddAddress={handleAddAddress}
      /> */}
      <Modal
        as={Form}
        onSubmit={handleSubmit}
        open={props.isOpen}
        size="tiny"
        className="modal-des"
      >
        <Header
          className="modal-heading"
          icon="pencil"
          content={
            props.editing
              ? "Edit Work Experience Details"
              : "Enter Work Experience Details"
          }
          as="h2"
        />
        <Modal.Content className="modal-content">
            <Form.Field className="form-inputs">
              <input
                id="title"
                placeholder="Job Title"
                autoComplete="off"
                autoCorrect="off"
                value={title}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field className="form-inputs">
              <input
                id="employment_type"
                placeholder="Employment Type"
                autoComplete="off"
                autoCorrect="off"
                value={employmentType}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field className="form-inputs">
              <input
                id="company_name"
                placeholder="Company Name"
                autoComplete="off"
                autoCorrect="off"
                value={companyName}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field className="form-inputs">
              <input
                id="location"
                placeholder="Location"
                autoComplete="off"
                autoCorrect="off"
                value={location}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field className="form-inputs">
              <input
                id="location_type"
                placeholder="Location Type"
                autoComplete="off"
                autoCorrect="off"
                value={locationType}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field className="form-inputs">
              <input
                id="is_currently"
                placeholder="Currently Working?"
                autoComplete="off"
                autoCorrect="off"
                value={isCurrently}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field className="form-inputs">
              <DatePicker
                id="start_date"
                placeholderText="Start Date"
                autoComplete="off"
                selected={startDate}
                onChange={handleChangeStartDate}
                className="datepicker-style"
                maxDate={endDate}
              />

              <DatePicker
                id="end_date"
                placeholderText="End Date"
                autoComplete="off"
                selected={endDate}
                onChange={handleChangeEndDate}
                className="datepicker-style"
                minDate={startDate}
              />
            </Form.Field>
            <Form.Field className="form-inputs">
              <input
                id="description"
                placeholder="Description"
                autoComplete="off"
                autoCorrect="off"
                value={description}
                onChange={handleChange}
              />
            </Form.Field>
        </Modal.Content>
        <Modal.Actions className="modal-actions">
          <Button
            className="close-button"
            type="button"
            color="red"
            icon="times"
            content="Close"
            onClick={() => props.closeCertificationModal()}
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
    </>
  );
};

export default GetWorkExpModal;
