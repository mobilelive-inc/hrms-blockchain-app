import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { Button, Modal, Header, Grid } from "semantic-ui-react";
import "./Admin.css";

class ViewResources extends Component {
  state = {
    resources: [],
  };

  // componentDidMount() {
  //   this.getResources(this.props.index,this.props.tokenId);
  // }

  // componentDidUpdate(prevProps) {
  //   if (this.props.isOpen && this.props.index !== prevProps.index) {
  //     this.getResources(this.props.index,this.props.tokenId);
  //   }
  // }
  shortenAddress = (address) =>
    `${address.slice(0, 10)}...${address.slice(address.length - 4)}`;

  render() {
    return (
      <Modal open={this.props.isOpen} size="tiny" className="modal-des">
        <Header
          className="modal-heading"
          icon="pencil"
          content="List of Resources"
          as="h2"
        />
        <Modal.Content className="content-css">
          <Grid columns={3}>
            <Grid.Row style={{paddingBottom:"0.5rem",paddingTop:"0.5rem"}}>
              <Grid.Column>
                <p style={{ marginBottom: "0px" }}>Resource Name</p>
              </Grid.Column>
              <Grid.Column>
                <p style={{ marginBottom: "0px" }}>Resource Address</p>
              </Grid.Column>
              <Grid.Column>
                <p style={{ marginBottom: "0px" }}>Allocation Type</p>
              </Grid.Column>
            </Grid.Row>
            {this.props.resources.length !== 0 ? (
              this.props.resources.map((resource, index) => {
                return (
                  <Grid.Row style={{paddingBottom:"0.5rem",paddingTop:"0.5rem"}}>
                    <Grid.Column>
                      <Link to={`/getemployee/${resource.resource_token}`}>
                        {resource.resource_name}
                      </Link>
                    </Grid.Column>
                    <Grid.Column>
                      {this.shortenAddress(resource.resource_token)}
                    </Grid.Column>
                    <Grid.Column>{resource.allocation_type}</Grid.Column>
                  </Grid.Row>
                );
              })
            ) : (
              <p>No resources to display!</p>
            )}
          </Grid>
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
