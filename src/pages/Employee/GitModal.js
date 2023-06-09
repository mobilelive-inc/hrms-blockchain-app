import React from "react";
import Modal from "@mui/material/Modal";
import "./jiraModal.css";
import { Icon } from "semantic-ui-react";

class ModalComponentGit extends React.Component {
  render() {
    return (
      <Modal open={this.props.showModal} onClose={this.props.onClose}>
        <div className="modal-styling">
          <div className="navbar">
            
          </div>
          <Icon className="icon" name="close" onClick={this.props.onClose} />

          <div style={{ margin: "10px", padding: "5px" }}>
            <div className="inner-div">
            <h2>List of Commits</h2>
            {this.props?.commits&&this.props?.commits?.map((commit) => {
              return (
                <>
                  <h3>Commits Author Name</h3>
                  <p>{commit?.commit?.author?.name}</p>
                  <h3>Commit Hash</h3>
                  <p>{commit?.sha}</p>
                  <h3>Link to commit</h3>
                  <a href={commit?.url}>{commit?.url}</a>
                  <hr className="divider"/>
                </>
              );
            })}
          </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ModalComponentGit;
