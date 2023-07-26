import React, { useState, useEffect } from "react";
import "./Admin.css";
import Admin from "../../abis/Admin.json";
import { getProjects } from "../../Apis/Project";
import { Card } from "semantic-ui-react";
import { getUserApi } from "../../Apis/UsersApi";
import AddResources from "./AddResources";
import ViewResources from "./ViewResources";
import moment from "moment";
import { getAllResources } from "../../Apis/Project";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

function ViewProjects(props) {
  const [projects, setProjects] = useState([]);
  const [tokenId, setTokenId] = useState(null);
  const [resources, setResources] = useState([]);
  const [index, setIndex] = useState(0);
  const [resourceModal, setResourceModal] = useState(false);
  const [resourceViewModal, setResourceViewModal] = useState(false);
  const [loadcomp, setLoadcomp] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadcomp(true);
        const web3 = window.web3;
        const networkId = await web3.eth.net.getId();
        const accounts = await web3.eth.getAccounts();
        const AdminData = await Admin.networks[networkId];
        console.log(AdminData);
        const response = await getUserApi(accounts[0]);
        setTokenId(response?.data?.response?.userInfo.tokenId);
        const performance_info = await getProjects(
          response?.data?.response?.userInfo.tokenId
        );
        const projects = performance_info?.data?.response?.projects;
        setProjects(projects);
      } catch (error) {
        toast.error(error);
      } finally {
        setLoadcomp(false);
      }
    };

    fetchData();
  }, []);

  const getResources = async (index, tokenId) => {
    setIndex(index);
    setResources([]);
    setResourceViewModal(true);
    const response = await getAllResources(Number(`${index}${tokenId}`));
    const resources = response?.data?.response?.projectResources;
    setResources(resources);
  };

  const closeResourceModal = () => {
    setResourceModal(false);
  };

  const closeResourceViewModal = () => {
    setResourceViewModal(false);
  };

  return (
    <div className="admin">
      <AddResources
        isOpen={resourceModal}
        closeResourceModal={closeResourceModal}
        index={index}
      />
      <ViewResources
        isOpen={resourceViewModal}
        closeResourceViewModal={closeResourceViewModal}
        resources={resources}
        index={index}
      />

      {loadcomp ? (
        <div>
          <CircularProgress />
        </div>
      ) : (
        <div>
          <h2 className="card-heading">All Projects List</h2>
          <br />
          {projects.length !== 0 ? (
            projects.map((project, i) => (
              <Card className="card-display" key={i}>
                <div className="card-content" key={i}>
                  <div>
                    <p>Name: {project.name}</p>
                    <p>Client: {project.client}</p>
                    <p>Description</p>
                    <p>{project.description}</p>
                    <p>
                      Started:{" "}
                      {moment(project.start_date).format("DD-MM-YYYY")} | Ends:{" "}
                      {moment(project.end_date).format("DD-MM-YYYY")}
                    </p>
                  </div>
                  <div>
                    <button
                      className="add-button"
                      onClick={(e) => {
                        setResourceModal(!resourceModal);
                        setIndex(i);
                      }}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                    <button
                      className="add-button"
                      onClick={(e) => getResources(i, tokenId)}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div>No projects to display!</div>
          )}
        </div>
      )}
      <br />
    </div>
  );
}

export default ViewProjects;
