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
              {this.props?.commits.length!==0 ?(
                this.props?.commits?.map((group) => (
                  <div className="inner-div" key={group?.date}>
                    <li className="commit-date-style">Commits on {moment(group?.date).format("DD-MM-YYYY")}</li>
                    <br/>
                    
                    {group.commits &&
                      group.commits.map((commit) => (
                        <div className="commit-info" key={commit?.sha}>
                          <a href={commit?.html_url} style={{ marginBottom: "10px" }}>
                          <h2 className="message-style">{commit?.commit?.message}</h2>
                          </a>
                          <div className="author-info">
                          <Icon className="user-icon" name="user circle"/>
                          <h4>{commit?.commit?.author?.name}</h4>
                          </div>
                          <hr className="divider" />
                        </div>
                      ))}
                      
                  </div>
                ))):<h4>No commits to display for this Repo!</h4>
              }
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ModalComponentGit;
