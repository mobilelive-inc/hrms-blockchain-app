import React from "react";
import Modal from "@mui/material/Modal";
import "./jiraModal.css";
import { Icon } from "semantic-ui-react";
import moment from "moment/moment";

class ModalComponentGit extends React.Component {
  render() {
    return (
      <Modal open={this.props.showModal} onClose={this.props.onClose}>
        <div className="modal-styling">
          <div className="navbar">
          <h2>List of Commits</h2>

          <Icon className="icon" name="close" onClick={this.props.onClose} />

          </div>

          <div style={{ margin: "30px", padding: "5px" }}>
            <div className="inner-div">
              {this.props?.commits &&
                this.props?.commits?.map((group) => (
                  <div className="inner-div" key={group.date}>
                    <li className="commit-date-style">Commits on {moment(group?.date).format("DD-MM-YYYY")}</li>
                    <br/>
                    {group.commits &&
                      group.commits.map((commit) => (
                        <div key={commit.sha}>
                          <div style={{ marginBottom: "10px" }}>
                          <h2>{commit?.commit?.message}</h2>
                            
                          </div>
                          <h4>{commit?.commit?.author?.name}</h4>

                          <hr className="divider" />
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ModalComponentGit;
