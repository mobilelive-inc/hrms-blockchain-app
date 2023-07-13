import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { Button, Modal, Header } from "semantic-ui-react";
import { getAllResources } from "../../Apis/Project";
import "./Admin.css";

class ViewResources extends Component {
  state = {
    resources: [],
  };

  componentDidMount() {
    // Initial API call to fetch resources when the component mounts
    this.getResources(this.props.index);
  }

  componentDidUpdate(prevProps) {
    // Check if the modal is open and the index prop has changed
    if (this.props.isOpen && this.props.index !== prevProps.index) {
      this.getResources(this.props.index);
    }
  }

  getResources = async (index) => {
    this.setState({ resources: [] });
    const resources = await getAllResources(index);
    this.setState({ resources: resources?.data?.response?.projectResources });
  };

  render() {
    return (
      <Modal open={this.props.isOpen} size="tiny" className="modal-des">
        <Header className="modal-heading" icon="pencil" content="List of Resources" as="h2" />
        <Modal.Content className="content-css">
          <table className="table">
            <thead>
              <tr>
                <th>Resource Name</th>
                <th>Resource Address</th>
              </tr>
            </thead>
            <tbody>
          {this.state.resources.length !== 0 ? (
            this.state.resources.map((resource, index) => {
              return (
                <tr key={index}>
                  <td>
                    <Link to={`/getemployee/${resource.resource_token}`}>
                      {resource.resource_name}
                    </Link>
                  </td>
                  <td>{resource.resource_token}</td>
                </tr>
              );
            })
          ) : (
            <tr><td>No resources to display!</td></tr>
          )}
          </tbody>
          </table>
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
