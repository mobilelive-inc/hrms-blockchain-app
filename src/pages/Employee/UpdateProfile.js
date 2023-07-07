import React, { Component } from "react";
import { toast } from "react-toastify";
import { Card, Grid, Icon } from "semantic-ui-react";
import Admin from "../../abis/Admin.json";
import Employee from "../../abis/Employee.json";
import SkillCard from "../../components/SkillCard";
import "./Employee.css";
import "./UpdateProfile.css";
import GetCertificationModal from "../../components/GetCertificationModal";
import GetWorkExpModal from "../../components/GetWorkExpModal";
import GetSkillsModal from "../../components/GetSkillsModals";
import GetFilesModal from "../../components/GetFilesModal";
import GetEducationModal from "../../components/GetEducationModal";
import GetEditFieldModal from "../../components/GetEditFieldModal";
//import LoadComp from "../../components/LoadComp";
import CodeforcesGraph from "../../components/CodeforcesGraph";
import { getUserApi } from "../../Apis/UsersApi";
import { getSkillsApi } from "../../Apis/EmployeeSkillsApi";
import { getCertificatesApi } from "../../Apis/EmployeeCertApi";
import { getWorkExperienceApi } from "../../Apis/EmployeeExperienceApi";
import { getEducationApi } from "../../Apis/EmployeeEducationApi";

import {
  reqCertiEndorsementFunc,
  reqEducationEndorsementFunc,
  reqWorkexpEndorsementFunc,
} from "../../firebase/api";
import moment from "moment/moment";

export default class UpdateProfile extends Component {
  state = {
    employeedata: {},
    overallEndorsement: [],
    skills: [],
    certifications: [],
    workExps: [],
    educations: [],
    colour: ["#b6e498", "#61dafb", "#764abc", "#83cd29", "#00d1b2"],
    readmore: false,
    certificationModal: false,
    workexpModal: false,
    skillmodal: false,
    filemodal: false,
    educationmodal: false,
    editFieldModal: false,
    isDescription: false,
    loadcomp: false,
    EmployeeContract: {},
    userInfo: null,
    selectedEducation: null,
    selectedCertification: null,
    selectedSkill: null,
    selectedWorkExp: null,
    tokenId: null,
    index: 0,
  };
  getUserInfo = async (address) => {
    await getUserApi(address).then((response) => {
      this.setState({ tokenId: response?.data?.response?.userInfo?.tokenId });
      this.setState({ userInfo: response?.data?.response?.userInfo });
    });
  };

  getSkills = async () => {
    const id = this.state.tokenId;
    await getSkillsApi(id).then((response) => {
      const skillsData = response?.data?.response?.skills;
      this.setState({ skills: skillsData });
    });
  };

  getCertifications = async () => {
    const id = this.state.tokenId;
    await getCertificatesApi(id).then((response) => {
      const certificationsData = response?.data?.response?.certifications;

      this.setState({
        certifications: certificationsData,
      });
    });
  };
  getWorkExp = async () => {
    const id = this.state.tokenId;
    await getWorkExperienceApi(id).then((response) => {
      const workExperienceData = response?.data?.response?.workExperiences;
      this.setState({ workExps: workExperienceData });
    });
  };

  getEducation = async () => {
    const id = this.state.tokenId;
    try {
      const response = await getEducationApi(id);
      const educationData = response?.data?.response?.education;

      if (Array.isArray(educationData)) {
        this.setState({ educations: educationData });
      }
    } catch (error) {
      console.error("Error retrieving education data:", error);
    }
  };

  checkExistence(value) {
    return value ? value : "-------";
  }

  handleEditEducation = (education, i) => {
    this.setState({
      educationmodal: true,
      selectedEducation: education,
      index: i,
    });
  };
  handleEditCertification = (certification, i) => {
    this.setState({
      certificationModal: true,
      selectedCertification: certification,
      index: i,
    });
  };
  handleEditWorkExp = (workExp, i) => {
    this.setState({
      workexpModal: true,
      selectedWorkExp: workExp,
      index: i,
    });
  };
  handleEditSkill = (skill, i) => {
    this.setState({
      skillmodal: true,
      selectedSkill: skill,
      index: i,
    });
  };

  componentDidMount = async () => {
    this.setState({ loadcomp: true });
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    const accounts = await web3.eth.getAccounts();
    const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
    const employeeContractAddress = await admin?.methods
      ?.getEmployeeContractByAddress(accounts[0])
      .call();
    const EmployeeContract = await new web3.eth.Contract(
      Employee.abi,
      employeeContractAddress
    );
    this.setState({ EmployeeContract });
    await this.getUserInfo(accounts[0]);
    this.getSkills();
    this.getCertifications();
    this.getWorkExp();
    this.getEducation();
    const employeedata = await EmployeeContract.methods
      .getEmployeeInfo()
      .call();
    const newEmployedata = {
      ethAddress: employeedata[0],
      name: employeedata[1],
      location: employeedata[2],
      description: employeedata[3],
      overallEndorsement: employeedata[4],
      endorsecount: employeedata[5],
    };
    const endorseCount = newEmployedata.endorsecount;
    const overallEndorsement = await Promise.all(
      Array(parseInt(endorseCount))
        .fill()
        .map((ele, index) =>
          EmployeeContract?.methods?.overallEndorsement(index).call()
        )
    );
    this.setState({ employeedata: newEmployedata, overallEndorsement });

    this.setState({ loadcomp: false });
  };

  closeCertificationModal = () => {
    this.setState({ certificationModal: false, selectedCertification: null });
    this.getCertifications();
  };

  closeWorkExpModal = () => {
    this.setState({ workexpModal: false, selectedWorkExp: null });
    this.getWorkExp();
  };

  closeSkillModal = () => {
    this.setState({ skillmodal: false, selectedSkill: null });
    this.getSkills();
  };
  closeFileModal = () => {
    this.setState({ filemodal: false });
  };
  closeEducationModal = () => {
    this.setState({ educationmodal: false, selectedEducation: null });
    this.getEducation();
  };

  closeEditFieldModal = () => {
    this.setState({ editFieldModal: false });
  };

  certificationVisibility = async (name) => {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    const accounts = await web3.eth.getAccounts();
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const employeeContractAddress = await admin?.methods
        ?.getEmployeeContractByAddress(accounts[0])
        .call();
      const EmployeeContract = await new web3.eth.Contract(
        Employee.abi,
        employeeContractAddress
      );
      await EmployeeContract?.methods
        ?.deleteCertification(name)
        .send({ from: accounts[0] });
      toast.success("Certification visibility changed successfully!!");
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    this.getCertifications(this.state.EmployeeContract);
  };

  workExpVisibility = async (org) => {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    const accounts = await web3.eth.getAccounts();
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const employeeContractAddress = await admin?.methods
        ?.getEmployeeContractByAddress(accounts[0])
        .call();
      const EmployeeContract = await new web3.eth.Contract(
        Employee.abi,
        employeeContractAddress
      );
      await EmployeeContract?.methods
        ?.deleteWorkExp(org)
        .send({ from: accounts[0] });
      toast.success("Work Exp. visibility changed successfully!!");
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    this.getWorkExp(this.state.EmployeeContract);
  };

  reqEducationEndorsement = async (education) => {
    reqEducationEndorsementFunc(education);
  };

  reqCertiEndorsement = async (certi) => {
    reqCertiEndorsementFunc(certi);
  };

  reqWorkexpEndorsement = async (workExp) => {
    reqWorkexpEndorsementFunc(workExp);
  };

  render() {
    return (
      <div>
        <GetCertificationModal
          isOpen={this.state.certificationModal}
          closeCertificationModal={this.closeCertificationModal}
          tokenId={this.state.tokenId}
          certification={this.state.selectedCertification}
          index={this.state.index}
        />
        <GetWorkExpModal
          isOpen={this.state.workexpModal}
          closeCertificationModal={this.closeWorkExpModal}
          tokenId={this.state.tokenId}
          workExp={this.state.selectedWorkExp}
          index={this.state.index}
        />
        <GetSkillsModal
          isOpen={this.state.skillmodal}
          closeCertificationModal={this.closeSkillModal}
          tokenId={this.state.tokenId}
          skill={this.state.selectedSkill}
          index={this.state.index}
        />
        <GetFilesModal
          isOpen={this.state.filemodal}
          closeCertificationModal={this.closeFileModal}
        />
        <GetEducationModal
          isOpen={this.state.educationmodal}
          closeCertificationModal={this.closeEducationModal}
          education={this.state.selectedEducation}
          tokenId={this.state.tokenId}
          index={this.state.index}
        />

        <GetEditFieldModal
          isOpen={this.state.editFieldModal}
          closeEditFieldModal={this.closeEditFieldModal}
          tokenId={this.state.tokenId}
        />

        <Grid>
          <Grid.Row>
            <Grid.Column width={6}>
              <Card className="personal-info">
                <Card.Content>
                  <Card.Header>About</Card.Header>
                  <br />

                  <span style={{ fontWeight: "bold" }}>
                    {this.checkExistence(this.state.userInfo?.first_name) +
                      " " +
                      this.checkExistence(this.state.userInfo?.last_name)}
                  </span>

                  <span
                    className="add-button"
                    onClick={(e) =>
                      this.setState({
                        editFieldModal: !this.state.editFieldModal,
                        isDescription: false,
                      })
                    }
                  >
                    <i className="fas fa-pencil-alt"></i>
                  </span>
                  <div>{this.checkExistence(this.state.userInfo?.email)}</div>

                  <div style={{ marginTop: "5px", marginBottom: "5px" }}>
                    <span style={{ fontWeight: "bold" }}>
                      {this.checkExistence(
                        this.state.userInfo?.current_position
                      )}
                    </span>
                  </div>
                  <div>
                    <p>
                      <em>Location: </em>
                      <span style={{ color: "black" }}>
                        {this.checkExistence(this.state.userInfo?.city) + ","}
                        {this.checkExistence(this.state.userInfo?.country)}
                      </span>
                    </p>
                  </div>
                  <br />
                </Card.Content>
              </Card>
              <Card className="employee-des">
                <Card.Content>
                  <div>
                    <span
                      className="add-button"
                      onClick={(e) =>
                        this.setState({
                          educationmodal: !this.state.educationmodal,
                        })
                      }
                    >
                      <i className="fas fa-plus"></i>
                    </span>

                    <Card.Header
                      style={{ fontSize: "19px", fontWeight: "600" }}
                    >
                      Education
                    </Card.Header>
                    <br />
                    <div className="education">
                      {this.state.educations?.length > 0 ? (
                        this.state.educations.map((education, index) => (
                          <div className="education-design" key={index}>
                            <div
                              style={{
                                paddingRight: "50px",
                                color: "black",
                                fontWeight: "bold",
                              }}
                            >
                              <div style={{ display: "flex" }}>
                                <Icon
                                  style={{ position: "relative" }}
                                  name="graduation cap"
                                />
                                <p>
                                  {this.checkExistence(education?.degree)}
                                  {"(" +
                                    this.checkExistence(
                                      education?.field_of_study
                                    ) +
                                    ")"}
                                </p>
                                <p></p>
                                <span
                                  onClick={() =>
                                    this.handleEditEducation(education, index)
                                  }
                                >
                                  <i
                                    style={{
                                      marginLeft: "200%",
                                      marginRight: "0px",
                                    }}
                                    className="fas fa-pencil-alt"
                                  ></i>
                                </span>
                              </div>
                              <small
                                style={{
                                  wordBreak: "break-word",
                                  fontSize: "10px",
                                }}
                              >
                                {this.checkExistence(education?.school)}
                              </small>
                              <br />

                              <small>
                                {moment(
                                  this.checkExistence(education?.start_date)
                                ).format("DD-MM-YYYY")}
                                {"-" +
                                  moment(
                                    this.checkExistence(education?.end_date)
                                  ).format("DD-MM-YYYY")}
                              </small>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No education information available.</p>
                      )}
                    </div>
                  </div>
                </Card.Content>
              </Card>
              <Card className="employee-des">
                <Card.Content>
                  <Card.Header>Competetive Platform Ratings</Card.Header>
                  <CodeforcesGraph />
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column width={10}>
              <Card className="employee-des">
                <Card.Content className="content">
                  <Card.Header style={{ display: "flex" }}>
                    Certifications
                    <span
                      className="add-button"
                      onClick={(e) =>
                        this.setState({
                          certificationModal: !this.state.certificationModal,
                        })
                      }
                    >
                      <i className="fas fa-plus"></i>
                    </span>
                  </Card.Header>
                  <br />

                  <div className="education">
                    <Grid columns={4}>
                      {this.state.certifications.length > 0 ? (
                        this.state.certifications.map((certi, index) => {
                          if (Array.isArray(certi)) {
                            return null;
                          } else if (
                            typeof certi === "object" &&
                            certi.title &&
                            certi.issuing_organization
                          ) {
                            return (
                              <Grid.Row key={index}>
                                <Grid.Column>
                                  <div
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    <p>{this.checkExistence(certi.title)}</p>
                                    <small>
                                      {this.checkExistence(
                                        certi.issuing_organization
                                      )}
                                    </small>
                                  </div>
                                </Grid.Column>
                                <Grid.Column>
                                  <div>
                                    <p style={{ fontWeight: "bold" }}>
                                      Issue Date
                                    </p>
                                    <small style={{ fontWeight: "bold" }}>
                                      {this.checkExistence(
                                        moment(certi.issue_date).format(
                                          "DD-MM-YYYY"
                                        )
                                      )}
                                    </small>
                                  </div>
                                </Grid.Column>
                                <Grid.Column>
                                  <div>
                                    <p style={{ fontWeight: "bold" }}>
                                      Credential ID
                                    </p>
                                    <small style={{ fontWeight: "bold" }}>
                                      <a href={certi.credential_url} target="blank">{this.checkExistence(certi.credential_id)}</a>
                                    </small>
                                  </div>
                                </Grid.Column>
                                <Grid.Column>
                                  <span
                                    onClick={() =>
                                      this.handleEditCertification(certi, index)
                                    }
                                  >
                                    <i className="fas fa-pencil-alt"></i>
                                  </span>
                                </Grid.Column>
                              </Grid.Row>
                            );
                          } else {
                            return null;
                          }
                        })
                      ) : (
                        <p>No certifications to display!</p>
                      )}
                    </Grid>
                  </div>
                </Card.Content>
              </Card>
              <Card className="employee-des">
                <Card.Content>
                  <Card.Header>
                    Work Experiences
                    <span
                      className="add-button"
                      onClick={(e) =>
                        this.setState({
                          workexpModal: !this.state.workexpModal,
                        })
                      }
                    >
                      <i className="fas fa-plus"></i>
                    </span>
                  </Card.Header>
                  <br />
                  <div className="education">
                    <Grid columns={4}>
                      {this.state.workExps?.length > 0 ? (
                        this.state.workExps.map((workExp, index) => {
                          return (
                            <Grid.Row key={index}>
                              <Grid.Column>
                                <div
                                  style={{ color: "black", fontWeight: "bold" }}
                                >
                                  <p>{this.checkExistence(workExp?.title)}</p>
                                  <small>
                                    {this.checkExistence(workExp?.company_name)}
                                  </small>
                                  <small>
                                    {", " +
                                      this.checkExistence(workExp?.location)}
                                  </small>
                                </div>
                              </Grid.Column>
                              <Grid.Column>
                                <div>
                                  <p style={{ fontWeight: "bold" }}>
                                    Employment Type
                                  </p>
                                  <small style={{ fontWeight: "bold" }}>
                                    {this.checkExistence(
                                      workExp?.employment_type
                                    )}
                                  </small>
                                </div>
                              </Grid.Column>
                              <Grid.Column>
                                <div>
                                  <p style={{ fontWeight: "bold" }}>
                                    Date of Joining
                                  </p>
                                  <small style={{ fontWeight: "bold" }}>
                                  {this.checkExistence(
                                        moment(workExp.start_date).format(
                                          "DD-MM-YYYY"
                                        )
                                      )}
                                  </small>
                                </div>
                              </Grid.Column>
                              <Grid.Column>
                                <span
                                  onClick={() =>
                                    this.handleEditWorkExp(workExp, index)
                                  }
                                >
                                  <i className="fas fa-pencil-alt"></i>
                                </span>
                              </Grid.Column>
                            </Grid.Row>
                          );
                        })
                      ) : (
                        <p>No work experiences found!</p>
                      )}
                    </Grid>
                  </div>
                </Card.Content>
              </Card>
              <Card className="employee-des">
                <Card.Content>
                  <span
                    className="add-button"
                    onClick={(e) =>
                      this.setState({
                        skillmodal: !this.state.skillmodal,
                      })
                    }
                  >
                    <i className="fas fa-plus"></i>
                  </span>
                  <Card.Header>Skills</Card.Header>
                  <br />
                  <br />
                  <div className="education">
                    {this.state.skills?.length > 0 ? (
                      this.state.skills.map((skill, index) => {
                        if (Array.isArray(skill)) {
                          return null;
                        } else if (typeof skill === "object" && skill?.title) {
                          return (
                            <div key={index}>
                              <i
                                className="fas fa-pencil-alt"
                                onClick={() =>
                                  this.handleEditSkill(skill, index)
                                }
                              ></i>
                              <SkillCard skill={skill} key={index} update />
                            </div>
                          );
                        } else {
                          return null;
                        }
                      })
                    ) : (
                      <p>No skills to display!</p>
                    )}
                  </div>
                </Card.Content>
              </Card>

              <Card className="employee-des">
                <Card.Content>
                  <span
                    className="add-button"
                    onClick={(e) =>
                      this.setState({
                        filemodal: !this.state.filemodal,
                      })
                    }
                  >
                    <i className="fas fa-plus"></i>
                  </span>
                  <Card.Header>Files</Card.Header>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
