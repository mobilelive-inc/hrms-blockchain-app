import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Button, Form, Header, Input, Modal } from "semantic-ui-react";
import Admin from "../abis/Admin.json";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  addCertificationApi,
  updateCertificationApi,
} from "../Apis/EmployeeCertApi";
import "./Modals.css";
import { parseISO } from "date-fns";
// import ScanQR from "./ScanQR";

export default function GetCertificationModal(props) {
  const [title, setTitle] = useState("");
  const [issuing_organization, setIssuingOrganization] = useState("");
  const [issue_date, setIssueDate] = useState("");
  const [expiry_date, setExpiryDate] = useState("");
  const [credential_id, setCredentialId] = useState("");
  const [credential_url, setCredentialUrl] = useState("");
  // const [index, setIndex] = useState(0);
  // const [props.editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [scanQR, setScanQR] = useState(false);
  const prevCertificationRef = useRef(props.certification);
  useEffect(() => {
    
    if (prevCertificationRef.current !== props.certification) {
    // console.log(editing);
      const {
        title = "",
        issuing_organization = "",
        credential_id = "",
        credential_url = "",
      } = props.certification || {};
      let { issue_date = "", expiry_date = "" } = props.certification || {};

      if (issue_date) {
        issue_date = parseISO(issue_date.toString());
      } else {
        issue_date = "";
      }
      if (expiry_date) {
        expiry_date = parseISO(expiry_date.toString());
      } else {
        expiry_date = "";
      }

      setTitle(title);
      setIssuingOrganization(issuing_organization);
      setCredentialId(credential_id);
      setCredentialUrl(credential_url);
      setIssueDate(issue_date);
      setExpiryDate(expiry_date);

      prevCertificationRef.current = props.certification;
    }
  }, [props.certification]);
  
  const handleSubmit = async (e) => {
    const tokenId = props.tokenId;
    const index = props.index;
  
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
  
    setLoading(true);
    e.preventDefault();
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    const accounts = await web3.eth.getAccounts();
    const messageToR = `0x${Buffer.from("Please confirm to verify info update", "utf8").toString("hex")}`;
    const signature = await web3.eth.personal.sign(messageToR, accounts[0]);
    if (!props.editing) {
      const dataToSend = {
        signature: signature,
        tokenId: tokenId,
        title: title,
        issuing_organization: issuing_organization,
        issue_date: issue_date,
        expiry_date: expiry_date,
        credential_id: credential_id,
        credential_url: credential_url,
        userAddress: accounts[0],
      };
  
      try {
        await addCertificationApi(dataToSend).then((response) => {
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
  
        toast.success("Certification saved successfullyy!!");
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      const dataToSend = {
        signature: signature,
        title: title,
        issuing_organization: issuing_organization,
        issue_date: issue_date,
        expiry_date: expiry_date,
        credential_id: credential_id,
        credential_url: credential_url,
        userAddress: accounts[0],
        index: index,
      };
  
      try {
        await updateCertificationApi(dataToSend, tokenId).then((response) => {
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
  
        toast.success("Certification updated successfullyy!!");
      } catch (err) {
        toast.error(err.message);
      }
      // setEditing(false)
    }
  };
  
  const handleChange = (e) => {
  // console.log(editing)
    const { id, value } = e.target;
    switch (id) {
      case "title":
        setTitle(value);
        break;
      case "issuing_organization":
        setIssuingOrganization(value);
        break;
      case "credential_id":
        setCredentialId(value);
        break;
      case "credential_url":
        setCredentialUrl(value);
        break;
      default:
        break;
    }
  };

  const handleChangeIssueDate = (date) => {
    setIssueDate(date);
  };

  const handleChangeExpiryDate = (date) => {
    setExpiryDate(date);
  };

  // const closeScanQRModal = () => {
  //   setScanQR(false);
  // };

  // const handleAddAddress = (res) => {
  //   setOrganization(res);
  // };

  return (
    <>
      {/* <ScanQR
        isOpen={scanQR}
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
              ? "Edit Certification Details"
              : "Enter Certification Details"
          }
          as="h2"
        />
        <Modal.Content className="modal-content">
            <Form.Field className="form-inputs">
              <input
                id="credential_id"
                placeholder="Credential Id"
                autoComplete="off"
                autoCorrect="off"
                value={credential_id}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field className="form-inputs">
              <input
                id="title"
                placeholder="Title"
                autoComplete="off"
                autoCorrect="off"
                value={title}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field className="form-inputs">
              <input
                id="issuing_organization"
                placeholder="Issuing Organization"
                autoComplete="off"
                autoCorrect="off"
                value={issuing_organization}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field className="form-inputs">
              <input
                id="credential_url"
                placeholder="Credential URL"
                autoComplete="off"
                autoCorrect="off"
                value={credential_url}
                onChange={handleChange}
              />
            </Form.Field>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Form.Field className="form-inputs">
                <DatePicker
                  id="issue_date"
                  placeholderText="Issue Date"
                  autoComplete="off"
                  selected={issue_date}
                  onChange={handleChangeIssueDate}
                  className="datepicker-style"
                  maxDate={expiry_date}
                />

                <DatePicker
                  id="expiry_date"
                  placeholderText="Expiry Date"
                  autoComplete="off"
                  selected={expiry_date}
                  onChange={handleChangeExpiryDate}
                  className="datepicker-style"
                  minDate={issue_date}
                />
              </Form.Field>
            </div>
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
}
