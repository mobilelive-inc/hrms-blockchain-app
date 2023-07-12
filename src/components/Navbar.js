import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { Menu, Segment, Image, Label } from "semantic-ui-react";
import { isAdmin } from "../Apis/Admin";
import { getUserApi } from "../Apis/UsersApi";

import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import GenererateQR from "./GenererateQR";
import Logo from "./../images/logo.png";

class Navbar extends Component {
  state = {
    activeItem: "home",
    role: "No Role",
    account: "",
    showQr: false,
  };

  componentDidMount = async () => {
    const web3 = await window.web3;
    const accounts = await web3.eth.getAccounts();
    if (accounts) {
      this.setState({ account: accounts[0] });
      const checkAdmin = await isAdmin(this.state.account);
      console.log("admin; ", checkAdmin);
      const userData = await getUserApi(this.state.account);
      var role = "No Role";
      if (checkAdmin.data.response.isAdmin) {
        role = "admin";
      } else if (
        !checkAdmin.data.response.isAdmin &&
        userData.data.response.userInfo.tokenId !== 0
      ) {
        role = userData.data.response.userInfo.role;
      } else {
        toast.error("User not found for given address!");
      }
      this.setState({ role });
    }
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  closeQRModal = () => {
    this.setState({ showQr: false });
  };

  render() {
    const { activeItem } = this.state;
    // const roles = ["Admin", "Employee"];
    console.log("role: ", this.state.role);
    return (
      <>
        <GenererateQR
          isOpen={this.state.showQr}
          closeQRModal={this.closeQRModal}
        />
        <Segment
          inverted
          style={{
            borderRadius: "0",
            background: "#1e2022ea",
            boxShadow: "0 0 5px 0px white",
          }}
        >
          <Menu
            style={{ marginLeft: "40px", border: "none" }}
            inverted
            pointing
            secondary
          >
            <Menu.Item
              as={Link}
              to="/"
              style={{ marginRight: "25px", padding: "0px" }}
            >
              <div>
                <Image style={{ height: "35px" }} src={Logo} />
              </div>
              <sup style={{ fontWeight: "bold", marginLeft: "5px" }}>
                HRMS SYSTEM
              </sup>
            </Menu.Item>
            <Menu.Item style={{ marginRight: "10px", padding: "0px" }}>
              <SearchBar />
            </Menu.Item>
            {this.state.role === "admin" && (
              <>
                <Menu.Item
                  as={Link}
                  to="/"
                  name="Employees"
                  active={activeItem === "Employees"}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  to="/create-user"
                  name="Create User"
                  active={activeItem === "Create User"}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  to="/create-project"
                  name="Create Project"
                  active={activeItem === "Create Project"}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  to="/view-projects"
                  name="View Projects"
                  active={activeItem === "View Projects"}
                  onClick={this.handleItemClick}
                />
              </>
            )}
            {this.state.role === "pm" && (
              <>
                <Menu.Item
                  as={Link}
                  to="/"
                  name="Create Project"
                  active={activeItem === "Create Project"}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  to="/view-projects"
                  name="View Projects"
                  active={activeItem === "View Projects"}
                  onClick={this.handleItemClick}
                />
              </>
            )}
            {this.state.role === "employee" && (
              <>
                <Menu.Item
                  as={Link}
                  to="/"
                  name="Profile"
                  active={activeItem === "Profile"}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  to="/update-profile"
                  name="Update Profile"
                  active={activeItem === "Update Profile"}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  to="/notifications"
                  name="Notifications"
                  active={activeItem === "Notifications"}
                  onClick={this.handleItemClick}
                />
              </>
            )}

            {this.state.role === "hr" && (
              <>
                <Menu.Item
                  as={Link}
                  to="/"
                  name="Info Page"
                  active={activeItem === "Info Page"}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  to="/endorse-skill"
                  name="Endorse Skill"
                  active={activeItem === "Endorse Skill"}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  to="/endorse-section"
                  name="Endorse Section"
                  active={activeItem === "Endorse Section"}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  to="/notifications"
                  name="Notifications"
                  active={activeItem === "Notifications"}
                  onClick={this.handleItemClick}
                />
              </>
            )}

            {this.state.role === "No Role" && (
              <>
                <Menu.Item
                  as={Link}
                  to="/"
                  name="Request Admin For Role"
                  active={activeItem === "Request Admin For Role"}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  to="/notifications"
                  name="Notifications"
                  active={activeItem === "Notifications"}
                  onClick={this.handleItemClick}
                />
              </>
            )}

            <Menu.Item position="right">
              <Label
                style={{
                  color: "black",
                  background: "white",
                  textTransform: "capitalize",
                }}
              >
                {this.state.role !== "pm" ? this.state.role : "Project Manager"}
              </Label>
              &nbsp;&nbsp;&nbsp;
              <div style={{ color: "lightgray" }}>
                <em>
                  <small>{this.state.account}</small>
                </em>
                &nbsp;&nbsp;&nbsp;
                {/* <Icon
                  name="qrcode"
                  size="large"
                  style={{ color: "white", cursor: "pointer" }}
                  onClick={() => this.setState({ showQr: false })}
                /> */}
              </div>
            </Menu.Item>
          </Menu>
        </Segment>
      </>
    );
  }
}

export default withRouter(Navbar);
