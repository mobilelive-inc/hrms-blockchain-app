import React, { Component } from "react";
//import {toast} from "react-toastify";
import "./Admin.css";
import Admin from "../../abis/Admin.json";
import { getProjects } from "../../Apis/Project";
import { Card } from "semantic-ui-react";
import { getUserApi } from "../../Apis/UsersApi";
import { getAllUsers } from "../../Apis/Admin";
import AddResources from "./AddResources";
import moment from "moment";

export default class ViewProjects extends Component {
  state = {
    employees: [],
    performances: null,
    projects: [],
    loadcomp: false,
    tokenId:null,
    index:0,
    resourceModal:false
  };

  componentDidMount = async () => {
    this.setState({ loadcomp: true });
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const accounts = await web3.eth.getAccounts();
    const AdminData = await Admin.networks[networkId];
    console.log(AdminData);
    const response=await getUserApi(accounts[0]);
    this.setState({tokenId:response?.data?.response?.userInfo.tokenId})
    const performance_info = await getProjects(this.state.tokenId);
    const projects=performance_info?.data?.response?.projects
    this.setState({projects:projects})    
    this.setState({ loadcomp: false });
  console.log("this: ",this.state.index)

    
  };

  closeResourceModal=()=>{
    this.setState({resourceModal:false});
    getAllUsers();
  }

  render() {
    return (
      <div className="admin">
        <AddResources
        isOpen={this.state.resourceModal}
        closeResourceModal={this.closeResourceModal}
        index={this.state.index}
        />

        <h2 className="card-heading">All Projects List</h2>
        <br />
        {this.state.projects.length!==0 ? (
          this.state.projects.map((project, index) => (
        <Card className="card-display" key={index}>

            <div className="card-content" key={index}>
              <div>              <p>Name: {project.name}</p>
              <p>Client: {project.client}</p>
              <p>Description</p>
              <p>{project.description}</p>
              <p>
              {moment(project.start_date).format("DD-MM-YYYY")} - {moment(project.end_date).format("DD-MM-YYYY")}
              </p>
              </div>
              <div>
              <span
                    className="add-button"
                    onClick={(e) =>
                      this.setState({
                        resourceModal: !this.state.resourceModal,
                        index:index
                      })
                    }
                  >
                    <i className="fas fa-plus"></i>
                  </span>
              </div>
            </div>
        </Card>

          ))
        ) : (
          <div>
            No projects to display!
          </div>
        )}
        <br />
      </div>
    );
  }
    
}
