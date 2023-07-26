import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, Header, Modal } from "semantic-ui-react";
import "./Modals.css";
import { postFileApi } from "../Apis/FileApi";

let accounts = null;

const GetFilesModal = (props) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [loading, setLoading] = useState(false);
  const acceptedFileTypes = [".pdf", ".doc", ".docx", ".png", ".jpeg"];
  const minFileNameLength = 3;
  const maxFileNameLength = 15;
  const [fileError, setFileError] = useState("");
  const [fileNameError, setFileNameError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    setFileError("");
  };

  const handleFileNameChange = (event) => {
    const fileName = event.target.value;
    setFileName(fileName);
    setFileNameError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const web3 = window.web3;

    if (!file) {
      setFileError("Please select a file to upload.");
      setLoading(false);
      return;
    }

    if (
      !fileName || 
      fileName.length < minFileNameLength ||
      fileName.length > maxFileNameLength
    ) {
      setFileNameError(
        `Filename should be between ${minFileNameLength} and ${maxFileNameLength} characters.`
      );
      setLoading(false);
      return;
    }

    const fileExtension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();
    if (!acceptedFileTypes.includes(fileExtension)) {
      setFileError("Only PDF, DOC, PNG, DOCX and JPEG files are accepted.");
      setLoading(false);
      return;
    }

    accounts = await web3.eth.getAccounts();
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    formData.append("userAddress", accounts[0]);
    const messageToR = `0x${Buffer.from(
      "Please confirm to verify info update",
      "utf8"
    ).toString("hex")}`;
    const signature = await web3.eth.personal.sign(messageToR, accounts[0]);
    formData.append("signature", signature);

    const response = await postFileApi(formData,props.tokenId);
      console.log(response.response.transactionData)

    if (response){
      const transaction = response?.response?.transactionData;
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
      console.log(receipt);
      toast.success("File uploaded successfully!");
    } else {
      toast.error("Error uploading file.");
      setLoading(false);
      props.closeCertificationModal();
    }

    
  };

  return (
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
        content="Upload Files"
        as="h2"
      />
      <Modal.Content className="modal-content">
        <input
          type="text"
          placeholder="File Name"
          onChange={handleFileNameChange}
        />
        {fileNameError && <div className="error-message">{fileNameError}</div>}
        <input type="file" onChange={handleFileChange} />
        {fileError && <div className="error-message">{fileError}</div>}
      </Modal.Content>
      <Modal.Actions className="modal-actions">
        <Button
          className="close-button"
          type="button"
          color="red"
          content="Close"
          onClick={() => props.closeCertificationModal()}
        />
        <Button
          className="button-css"
          type="submit"
          color="green"
          content="Save"
          loading={loading}
          disabled={loading}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default GetFilesModal;
