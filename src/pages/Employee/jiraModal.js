import React from "react";
import Modal from "@mui/material/Modal";
import "./jiraModal.css";
import { Icon } from "semantic-ui-react";
import moment from "moment/moment";

const ModalComponent = (props) => {
  return (
    <Modal
      open={props.showModal}
      onClose={props.onClose}
      Response={props.Response}
    >
      <div className="modal-styling">
        <div className="navbar">
          <h2 className="m-0">Key: {props.selectedKey}</h2>
          <Icon className="icon" name="close" onClick={props.onClose} />
        </div>

        <div style={{ margin: "25px", padding: "5px" }}>
          <div className="inner-dev">
            {props.selectedKey &&
              props.Response?.issues.map((issue) => {
                if (issue?.key === props.selectedKey) {
                  return (
                    <div key={issue?.key}>
                      <div className="ticket-meta">
                        <div className="ticket-meta-left">
                          <a href={issue?.link} target="_blank" rel="noreferrer" style={{fontSize:"25px",fontWeight:"bold"}}>{issue?.title}</a>
                          <br/>
                          <small className="font-italic">
                            Updated at:{" "}
                            {moment(issue?.updatedAt).format("DD-MM-YYYY")}
                          </small>
                          {issue?.description?.content[1]?.content[0]?.text ? (
                            <h2>Description</h2>
                          ) : (
                            <h2>There is no description for this issue!</h2>
                          )}
                        </div>
                        <div className="ticket-meta-right">
                          <div>
                            <p>Assignee</p>
                            <div>
                              <img
                                src={issue?.assignee?.avatarUrl}
                                style={{ height: "15px" }}
                                alt="Assignee Avatar"
                              />
                              <h5
                                style={{
                                  display: "inline-block",
                                  marginLeft: "10px",
                                  marginTop: "0",
                                  marginBottom: "15px",
                                }}
                              >
                                {issue?.assignee?.name}
                              </h5>
                            </div>
                          </div>

                          <div>
                            <p>Reporter</p>
                            <div>
                              <img
                                src={issue?.reporter?.avatarUrl}
                                style={{ height: "15px" }}
                                alt="Assignee Avatar"
                              />
                              <h5
                                style={{
                                  display: "inline-block",
                                  marginLeft: "10px",
                                  marginTop: "0",
                                }}
                              >
                                {issue?.reporter?.name}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr className="divider" />

                      <p>
                        {issue?.description?.content[1]?.content[0]?.text}
                      </p>
                    </div>
                  );
                }
                return null;
              })}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalComponent;
