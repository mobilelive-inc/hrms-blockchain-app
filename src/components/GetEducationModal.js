import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Button, Form, Header, Modal } from "semantic-ui-react";
import Admin from "../abis/Admin.json";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO } from "date-fns";
import { addEducation, updateEducation } from "../Apis/EmployeeEducationApi";
import "./Modals.css";
import ScanQR from "./ScanQR";

const GetEducationModal = (props) => {
  const [school, setSchool] = useState("");
  const [degree, setDegree] = useState("");
  const [field_of_study, setFieldOfStudy] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  // const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const scanQRRef = useRef(false);

  const prevEducationRef = useRef(props.education);
  useEffect(() => {
    if (prevEducationRef.current!==props.education ) {
      const {
        school = "",
        degree = "",
        field_of_study = "",
        description = "",
      } = props.education || {};
      let { start_date = "", end_date = "" } = props.education || {};

      if (start_date) {
        start_date = parseISO(start_date.toString());
      } else {
        start_date = "";
      }
      if (end_date) {
        end_date = parseISO(end_date.toString());
      } else {
        end_date = "";
      }

      setSchool(school);
      setDegree(degree);
      setFieldOfStudy(field_of_study);
      setStartDate(start_date);
      setEndDate(end_date);
      setDescription(description);
    }
    prevEducationRef.current=props.education;
  }, [props.education]);

  const handleSubmit = async (e) => {
    if (!school || !degree || !field_of_study || !start_date || !end_date || !description) {
      toast.error("Please enter all the fields.");
      return;
    }

    setLoading(true);
    e.preventDefault();
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    console.log("adminData: ", AdminData);
    const accounts = await web3.eth.getAccounts();
    const messageToR = `0x${Buffer.from("Please confirm to verify info update", "utf8").toString("hex")}`;
    const signature = await web3.eth.personal.sign(messageToR, accounts[0]);

    const tokenId = props.tokenId;
    const index = props.index;

    if (!props.editing) {
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
          const transaction = response?.data?.response?.transactionData;
          transaction.from = accounts[0];

          const receipt = web3.eth.sendTransaction(transaction)
            .then((res) => {
              return new Promise((resolve) => setTimeout(resolve, 7000));
            })
            .then(() => {
              setLoading(false);
              props.closeCertificationModal();
            });
          console.log("receipt > ", receipt);
        });

        toast.success("Education saved successfully!!");
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      //update logic
      const dataToSend = {
        signature: signature,
        school: school,
        degree: degree,
        field_of_study: field_of_study,
        start_date: start_date,
        end_date: end_date,
        description: description,
        index: index,
      };
      dataToSend.userAddress = accounts[0];
      try {
        await updateEducation(dataToSend, tokenId).then((response) => {
          const transaction = response?.data?.response?.transactionData;
          transaction.from = accounts[0];

          const receipt = web3.eth.sendTransaction(transaction)
            .then((res) => {
              return new Promise((resolve) => setTimeout(resolve, 7000));
            })
            .then(() => {
              setLoading(false);
              props.closeCertificationModal();
            });
          console.log("receipt > ", receipt);
        });

        toast.success("Education updated successfully!!");
      } catch (err) {
        toast.error(err.message);
      }
    }
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
      case "school":
        setSchool(value);
        break;
      case "degree":
        setDegree(value);
        break;
      case "field_of_study":
        setFieldOfStudy(value);
        break;
      case "description":
        setDescription(value);
        break;
      default:
        break;
    }
  };

  const closeScanQRModal = () => {
    scanQRRef.current = false;
  };

  const handleAddAddress = (education) => {
    setSchool(education);
  };

  return (
    <>
      <ScanQR
        isOpen={scanQRRef.current}
        closeScanQRModal={closeScanQRModal}
        handleAddAddress={handleAddAddress}
      />
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
          content={props.editing ? "Edit Education Details" : "Enter Education Details"}
          as="h2"
        />
        <Modal.Content className="modal-content">
            <Form.Field className="form-inputs">
              <input
                id="school"
                placeholder="School"
                autoComplete="off"
                autoCorrect="off"
                value={school}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field className="form-inputs">
              <input
                id="degree"
                placeholder="Degree"
                autoComplete="off"
                autoCorrect="off"
                value={degree}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field className="form-inputs">
              <input
                id="field_of_study"
                placeholder="Field of Study"
                autoComplete="off"
                autoCorrect="off"
                value={field_of_study}
                onChange={handleChange}
              />
            </Form.Field>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <Form.Field className="form-inputs">
                <DatePicker
                  id="start_date"
                  placeholderText="Start Date"
                  autoComplete="off"
                  selected={start_date}
                  onChange={handleChangeStartDate}
                  className="datepicker-style"
                  maxDate={end_date}
                />

                <DatePicker
                  id="end_date"
                  placeholderText="End Date"
                  autoComplete="off"
                  selected={end_date}
                  onChange={handleChangeEndDate}
                  className="datepicker-style"
                  minDate={start_date}
                />
              </Form.Field>
            </div>
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

export default GetEducationModal;
