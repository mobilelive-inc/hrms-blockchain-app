import React, { Component } from "react";
import "./Admin.css";
import Admin from "../../abis/Admin.json";
import { getProjects } from "../../Apis/Project";
import { getUserApi } from "../../Apis/UsersApi";
import { Card } from "semantic-ui-react";

export default class ViewProjects extends Component {
  state = {
    employees: [],
    performances: null,
    projects: [],
    loadcomp: false,
    tokenId:null
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
    
  };

  render() {
    return (
      <div className="admin">
        <h2 className="card-heading">All Projects List</h2>
        <br />
        {this.state.projects.length!==0 ? (
          this.state.projects.map((project, index) => (
        <Card className="card-display" key={index}>
            <div className="card-content" key={index}>
              <p>Name: {project.name}</p>
              <p>Client: {project.client}</p>
              <p>Description</p>
              <p>{project.description}</p>

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
