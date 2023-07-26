import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Button, Form, Header, Modal } from "semantic-ui-react";
import Admin from "../abis/Admin.json";
import { addSkillApi, updateSkillApi } from "../Apis/EmployeeSkillsApi";
import "./Modals.css";

const GetSkillsModal = (props) => {
  const { isOpen, skill, tokenId, index, closeCertificationModal } = props;

  const [title, setTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  // const [editing, setEditing] = useState(false);

  const prevSkillRef = useRef(props.skill);

  useEffect(() => {
    if (prevSkillRef.current !== props.skill) {
      const { title = "", experience = "" } = skill || {};
      setTitle(title);
      setExperience(experience);
    } 
    prevSkillRef.current=props.skill;
  }, [props.skill, skill]);

  const handleChange = (e) => {
    e.preventDefault();
    const { id, value } = e.target;
    if (id === "title") {
      setTitle(value);
    } else if (id === "experience") {
      setExperience(value);
    }
  };

  const handleSubmit = async (e) => {
    if (!title || !experience) {
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
    console.log("field: ", signature);

    if (!props.editing) {
      const dataToSend = {
        tokenId: tokenId,
        signature: signature,
        userAddress: accounts[0],
        title: title,
        experience: experience,
      };

      try {
        await addSkillApi(dataToSend, tokenId).then((response) => {
          console.log("Skills: ", response);
          const transaction = response?.data?.response?.transactionData;
          transaction.from = accounts[0];

          const receipt = web3.eth
            .sendTransaction(transaction)
            .then((res) => {
              return new Promise((resolve) => setTimeout(resolve, 7000));
            })
            .then(() => {
              setLoading(false);
              closeCertificationModal();
            });
          console.log("receipt > ", receipt);
        });

        toast.success("Skill saved successfully!!");
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      console.log("In update");
      const dataToSend = {
        signature: signature,
        title: title,
        experience: experience,
        index: index,
        userAddress: accounts[0],
      };

      try {
        await updateSkillApi(dataToSend, tokenId).then((response) => {
          console.log("Skill: ", response);
          const transaction = response?.data?.response?.transactionData;
          transaction.from = accounts[0];

          const receipt = web3.eth
            .sendTransaction(transaction)
            .then((res) => {
              return new Promise((resolve) => setTimeout(resolve, 7000));
            })
            .then(() => {
              setLoading(false);
              closeCertificationModal();
            });
          console.log("receipt > ", receipt);
        });

        toast.success("Education updated successfully!!");
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  return (
    <Modal
      as={Form}
      onSubmit={(e) => handleSubmit(e)}
      open={isOpen}
      size="tiny"
      className="modal-des"
    >
      <Header
        className="modal-heading"
        icon="pencil"
        content={props.editing ? "Edit Skills Details" : "Enter Skills Details"}
        as="h2"
      />
      <Modal.Content className="modal-content">
          <Form.Field className="form-inputs">
            <input
              id="title"
              placeholder="Skill Title"
              autoComplete="off"
              autoCorrect="off"
              value={title}
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field className="form-inputs">
            <input
              id="experience"
              placeholder="Experience"
              autoComplete="off"
              autoCorrect="off"
              value={experience}
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
          onClick={() => closeCertificationModal()}
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
  );
};

export default GetSkillsModal;
