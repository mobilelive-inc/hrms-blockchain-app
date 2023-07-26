import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { Menu, Segment, Image, Label } from "semantic-ui-react";
import { isAdmin } from "../Apis/Admin";
import { getUserApi } from "../Apis/UsersApi";

import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import GenererateQR from "./GenererateQR";
import Logo from "./../images/logo.png";

const Navbar = () => {
  const [activeItem, setActiveItem] = useState("home");
  const [role, setRole] = useState("No Role");
  const [account, setAccount] = useState("");
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const web3 = await window.web3;
      const accounts = await web3.eth.getAccounts();
      if (accounts) {
        setAccount(accounts[0]);
        const checkAdmin = await isAdmin(accounts[0]);
        console.log("admin: ", checkAdmin);
        const userData = await getUserApi(accounts[0]);
        var userRole = "No Role";
        if (checkAdmin.data.response.isAdmin) {
          userRole = "admin";
        } else if (
          !checkAdmin.data.response.isAdmin &&
          userData.data.response.userInfo.tokenId !== 0
        ) {
          userRole = userData.data.response.userInfo.role;
        } else {
          toast.error("User not found for given address!");
        }
        setRole(userRole);
        if (userRole === "admin") {
          setActiveItem("Employees");
        } else if (userRole === "pm") {
          setActiveItem("Create Project");
        } else if (userRole === "employee") {
          setActiveItem("Profile");
        } else if (userRole === "hr") {
          setActiveItem("Info Page");
        } else if (userRole === "No Role") {
          setActiveItem("Request Admin For Role");
        }
      }
    };
    fetchData();
  }, []);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  const closeQRModal = () => {
    setShowQr(false);
  };

  return (
    <>
      <GenererateQR isOpen={showQr} closeQRModal={closeQRModal} />
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
          {role === "admin" && (
            <>
              <Menu.Item
                as={Link}
                to="/"
                name="Employees"
                active={activeItem === "Employees"}
                onClick={handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/create-user"
                name="Create User"
                active={activeItem === "Create User"}
                onClick={handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/create-project"
                name="Create Project"
                active={activeItem === "Create Project"}
                onClick={handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/view-projects"
                name="View Projects"
                active={activeItem === "View Projects"}
                onClick={handleItemClick}
              />
            </>
          )}
          {role === "pm" && (
            <>
              <Menu.Item
                as={Link}
                to="/"
                name="Create Project"
                active={activeItem === "Create Project"}
                onClick={handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/view-projects"
                name="View Projects"
                active={activeItem === "View Projects"}
                onClick={handleItemClick}
              />
            </>
          )}
          {role === "employee" && (
            <>
              <Menu.Item
                as={Link}
                to="/"
                name="Profile"
                active={activeItem === "Profile"}
                onClick={handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/update-profile"
                name="Update Profile"
                active={activeItem === "Update Profile"}
                onClick={handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/notifications"
                name="Notifications"
                active={activeItem === "Notifications"}
                onClick={handleItemClick}
              />
            </>
          )}

          {role === "hr" && (
            <>
              <Menu.Item
                as={Link}
                to="/"
                name="Info Page"
                active={activeItem === "Info Page"}
                onClick={handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/endorse-skill"
                name="Endorse Skill"
                active={activeItem === "Endorse Skill"}
                onClick={handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/endorse-section"
                name="Endorse Section"
                active={activeItem === "Endorse Section"}
                onClick={handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/notifications"
                name="Notifications"
                active={activeItem === "Notifications"}
                onClick={handleItemClick}
              />
            </>
          )}

          {role === "No Role" && (
            <>
              <Menu.Item
                as={Link}
                to="/"
                name="Request Admin For Role"
                active={activeItem === "Request Admin For Role"}
                onClick={handleItemClick}
              />
              <Menu.Item
                as={Link}
                to="/notifications"
                name="Notifications"
                active={activeItem === "Notifications"}
                onClick={handleItemClick}
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
              {role !== "pm" ? role : "Project Manager"}
            </Label>
            &nbsp;&nbsp;&nbsp;
            <div style={{ color: "lightgray" }}>
              <em>
                <small>{account}</small>
              </em>
              &nbsp;&nbsp;&nbsp;
              {/* <Icon
                name="qrcode"
                size="large"
                style={{ color: "white", cursor: "pointer" }}
                onClick={() => setShowQr(false)}
              /> */}
            </div>
          </Menu.Item>
        </Menu>
      </Segment>
    </>
  );
};

export default withRouter(Navbar);
