import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button, Modal, Header } from "semantic-ui-react";
import { getAllResources } from "../../Apis/Project";
import "./Admin.css";

class ViewResources extends Component {
  state = {
    resources: [],
    scanQR: false,
  };

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
    if (this.props.isOpen && this.props.index !== prevProps.index) {
      this.getResources(this.props.index);
    }
  }

  getResources = async (index) => {
    const resources = await getAllResources(index);
    this.setState({ resources: resources?.data?.response?.projectResources });
  };

  render() {
    return (
      <Modal open={this.props.isOpen} size="tiny" className="modal-des">
        <Header className="modal-heading" icon="pencil" content="List of Resources" as="h2" />
        <Modal.Content className="content-css">
          {this.state.resources.length !== 0 ? (
            this.state.resources.map((resource, index) => {
              return (
                <div key={index}>
                  <h4>Resource Name</h4>
                  <p>{resource.resource_name}</p>
                  <h4>Allocator Id</h4>
                  <p>{resource.allocated_by}</p>
                  <br/>
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
