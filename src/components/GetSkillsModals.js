import React, { Component } from "react";
import { toast } from "react-toastify";
import { Button, Form, Header, Modal } from "semantic-ui-react";
import Admin from "../abis/Admin.json";
import { addSkillApi,updateSkillApi } from "../Apis/EmployeeSkillsApi";
import "./Modals.css";

export default class GetSkillsModal extends Component {
  state = {
    title: "",
    experience: "",
    loading: false,
    editing:false,
  };

  handleSubmit = async (e) => {
    const tokenId=this.props.tokenId;
    const index=this.props.index;
    const { title, experience,editing } = this.state;
    if (!title || !experience) {
      toast.error("Please enter all the fields.");
      return;
    }
    this.setState({ loading: true });
    e.preventDefault();
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    console.log(AdminData)
    const accounts = await web3.eth.getAccounts();
    const messageToR = `0x${Buffer.from(
      "Please confirm to verify info update",
      "utf8"
    ).toString("hex")}`;
    const signature = await web3.eth.personal.sign(messageToR, accounts[0]);
    console.log("field: ", signature);
      if (!editing){
      const dataToSend={
      tokenId:tokenId,
      signature:signature,
      userAddress:accounts[0],
      title:title,
      experience:experience
       }
    try {
      await addSkillApi(dataToSend,tokenId).then((response) => {
        console.log("Skills: ", response);
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

      toast.success("Skill saved successfullyy!!");
    } catch (err) {
      toast.error(err.message);
    } 
  }
  else{
    console.log("In update");
    const dataToSend={
      signature:signature,
      title:title,
      experience:experience,
      index:index,
      userAddress:accounts[0]
    }

    try {
      await updateSkillApi(dataToSend,tokenId).then((response) => {
        console.log("Skill: ", response);
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

    if (prevProps.skill !== this.props.skill) {
      
      
      const {
        title = "",
        experience = "",
        
      } = this.props.skill || {};
      

      
      this.setState({
        title,
        experience,
        editing: true,
      });
      
    }
  }

  handleChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    return (
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
                ? "Edit Skills Details"
                : "Enter Skills Details"
            }
            as="h2"
          />
        <Modal.Content className="modal-content">
          <Form className="form-inputs">
            <Form.Field className="form-inputs">
              <input
                id="title"
                placeholder="Skill Title"
                autoComplete="off"
                autoCorrect="off"
                value={this.state.title}
                onChange={this.handleChange}
              />
            </Form.Field>
            <Form.Field className="form-inputs">
              <input
                id="experience"
                placeholder="Experience"
                autoComplete="off"
                autoCorrect="off"
                value={this.state.experience}
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
    );
  }
}
