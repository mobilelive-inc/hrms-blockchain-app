import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  Card
} from "semantic-ui-react";

class CreateDepartment extends Component {
  render() {
    return (
      <>
        
        <div className="create-user">
          <Card className="card-style">
            <Card.Content>
              <Card.Header centered>
                <h2 className="card-heading">Add New Department</h2>
              </Card.Header>
              <hr className="horizontal-line"></hr>
              <br></br>
            </Card.Content>
          </Card>
        </div>
      </>
    );
  }
}

export default withRouter(CreateDepartment);
