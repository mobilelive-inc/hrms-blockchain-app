import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button, Form, Modal, Header } from "semantic-ui-react";
// import { toast } from "react-toastify";
// import { getProjects } from "../../Apis/Project";
import { getAllResources } from "../../Apis/Project";
import "./Admin.css";

class ViewResources extends Component {
  state = {
    resources:[],
    scanQR: false,
  };
  componentDidMount = async () => {
    console.log("index: ",this.props.index)
    const resources=await getAllResources(this.props.index);
    this.setState({resources:resources?.data?.response?.projectResources})
    console.log("resource: ",resources)
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
          content="List of Resources"
          as="h2"
        />
        <Modal.Content className="">
          {this.state.resources && this.state.resources.length !== 0 ? (
            this.state.resources.map((resource,index) => {
              
              return (
                <div key={index}>
                  <p>{resource.resource_name}</p>
                  <p>{resource.allocated_by}</p>
                </div>
              );
            })
          ) : (
            <div>No resources to display!</div>
          )}
        </Modal.Content>
        <Modal.Actions className="modal-actions">
          <Button
            className="close-button"
            type="button"
            color="red"
            content="Close"
            onClick={() => this.props.closeResourceViewModal()}
          />
        </Modal.Actions>
      </Modal>
    );
  }
  
  
}

export default withRouter(ViewResources);
