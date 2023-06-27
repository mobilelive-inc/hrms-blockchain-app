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
import LoadComp from "../../components/LoadComp";
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
    tokenId: null,
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
      console.log("skills: ", response?.data?.response?.skills);
      const skillsData = response?.data?.response?.skills;
      if (Array.isArray(skillsData)) {
        skillsData.forEach((element) => {
          skillsData.push(Object.fromEntries(element));
        });
      }
      console.log("skil ", skillsData);
      this.setState({ skills: skillsData });
    });
  };

  getCertifications = async () => {
    const id = this.state.tokenId;
    await getCertificatesApi(id).then((response) => {
      console.log("certificates: ", response?.data?.response);
      const certificationsData = response?.data?.response?.certifications;
      if (Array.isArray(certificationsData)) {
        certificationsData.forEach((element) => {
          certificationsData.push(Object.fromEntries(element));
        });
      }
      // if (Array.isArray(certificationsData)) {
      //   this.setState({ certifications: certificationsData });
      // }
      console.log("certi: ", certificationsData);
      this.setState({
        certifications: certificationsData,
      });
    });
  };
  getWorkExp = async () => {
    const id = this.state.tokenId;
    await getWorkExperienceApi(id).then((response) => {
      console.log(
        "Work Experience: ",
        response?.data?.response?.workExperiences
      );
      console.log("abc", response?.data?.response?.workExperiences);
      const workExperienceData = response?.data?.response?.workExperiences;
      // if (Array.isArray(workExperienceData)) {
      //   workExperienceData.forEach((element) => {
      //     workExperienceData.push(Object.fromEntries(element));
      //   });
      // }
      if (Array.isArray(workExperienceData)) {
        this.setState({ workExps: workExperienceData });
      }
      console.log("work: ", workExperienceData);
      //this.setState({ workExps: workExperienceData });
    });
  };

  getEducation = async () => {
    const id = this.state.tokenId;
    try {
      const response = await getEducationApi(id);
      const educationData = response?.data?.response?.education;
      console.log("education: ", educationData);

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

  handleEditEducation = (education) => {
    this.setState({
      educationmodal: true,
      selectedEducation: education,
    });
  };

  componentDidMount = async () => {
    this.setState({ loadcomp: true });
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
      console.log(overallEndorsement);
      this.setState({ employeedata: newEmployedata, overallEndorsement });
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    this.setState({ loadcomp: false });
  };

  // getSkills = async (EmployeeContract) => {
  //   const skillCount = await EmployeeContract?.methods?.getSkillCount().call();
  //   const skills = await Promise.all(
  //     Array(parseInt(skillCount))
  //       .fill()
  //       .map((ele, index) =>
  //         EmployeeContract?.methods?.getSkillByIndex(index).call()
  //       )
  //   );

  //   var newskills = [];
  //   skills.forEach((certi) => {
  //     newskills.push({
  //       name: certi[0],
  //       overall_percentage: certi[1],
  //       experience: certi[2],
  //       endorsed: certi[3],
  //       endorser_address: certi[4],
  //       review: certi[5],
  //       visible: certi[6],
  //     });
  //     return;
  //   });

  //   this.setState({ skills: newskills });
  // };

  // getCertifications = async (EmployeeContract) => {
  //   const certiCount = await EmployeeContract?.methods
  //     ?.getCertificationCount()
  //     .call();
  //   const certifications = await Promise.all(
  //     Array(parseInt(certiCount))
  //       .fill()
  //       .map((ele, index) =>
  //         EmployeeContract?.methods?.getCertificationByIndex(index).call()
  //       )
  //   );
  //   var newcertifications = [];
  //   certifications.forEach((certi) => {
  //     newcertifications.push({
  //       name: certi[0],
  //       organization: certi[1],
  //       score: certi[2],
  //       endorsed: certi[3],
  //       visible: certi[4],
  //     });
  //     return;
  //   });
  //   this.setState({ certifications: newcertifications });
  // };

  // getWorkExp = async (EmployeeContract) => {
  //   const workExpCount = await EmployeeContract?.methods
  //     ?.getWorkExpCount()
  //     .call();
  //   const workExps = await Promise.all(
  //     Array(parseInt(workExpCount))
  //       .fill()
  //       .map((ele, index) =>
  //         EmployeeContract?.methods?.getWorkExpByIndex(index).call()
  //       )
  //   );

  //   var newworkExps = [];
  //   workExps.forEach((work) => {
  //     newworkExps.push({
  //       role: work[0],
  //       organization: work[1],
  //       startdate: work[2],
  //       enddate: work[3],
  //       endorsed: work[4],
  //       description: work[5],
  //       visible: work[6],
  //     });
  //     return;
  //   });

  //   this.setState({ workExps: newworkExps });
  // };

  // getEducation = async (EmployeeContract) => {
  //   const educationCount = await EmployeeContract?.methods
  //     ?.getEducationCount()
  //     .call();
  //   const educations = await Promise.all(
  //     Array(parseInt(educationCount))
  //       .fill()
  //       .map((ele, index) =>
  //         EmployeeContract?.methods?.getEducationByIndex(index).call()
  //       )
  //   );
  //   var neweducation = [];
  //   educations.forEach((certi) => {
  //     neweducation.push({
  //       institute: certi[0],
  //       startdate: certi[1],
  //       enddate: certi[2],
  //       endorsed: certi[3],
  //       description: certi[4],
  //     });
  //     return;
  //   });
  //   this.setState({ educations: neweducation });
  // };

  closeCertificationModal = () => {
    this.setState({ certificationModal: false });
    this.getCertifications();
  };

  closeWorkExpModal = () => {
    this.setState({ workexpModal: false });
    this.getWorkExp();
  };

  closeSkillModal = () => {
    this.setState({ skillmodal: false });
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
    return this.state.loadcomp ? (
      <LoadComp />
    ) : (
      <div>
        <GetCertificationModal
          isOpen={this.state.certificationModal}
          closeCertificationModal={this.closeCertificationModal}
          tokenId={this.state.tokenId}
        />
        <GetWorkExpModal
          isOpen={this.state.workexpModal}
          closeCertificationModal={this.closeWorkExpModal}
          tokenId={this.state.tokenId}
        />
        <GetSkillsModal
          isOpen={this.state.skillmodal}
          closeCertificationModal={this.closeSkillModal}
          tokenId={this.state.tokenId}
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
        />

        <GetEditFieldModal
          isOpen={this.state.editFieldModal}
          closeEditFieldModal={this.closeEditFieldModal}
          tokenId={this.state.tokenId}

          // name={this.state.employeedata?.name}
          // location={this.state.employeedata?.location}
          // description={this.state.employeedata?.description}
          // isDescription={this.state.isDescription}
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
                                <p>{this.checkExistence(education?.degree)}</p>
                                <span
                                  onClick={() =>
                                    this.handleEditEducation(education)
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
                    <Grid columns={3}>
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
                                      {this.checkExistence(certi.credential_id)}
                                    </small>
                                  </div>
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
                  
                  <Card.Header>Work Experiences
                  
                  </Card.Header>
                  <br />
                  <div className="education">
                    {this.state.workExps?.length > 0 ? (
                      this.state.workExps.map((workExp, index) => (
                        <div className="education-design">
                          <div style={{ color: "black", fontWeight: "bold" }}>
                            <i
                              style={{ marginRight: "0px" }}
                              className="fas fa-pencil-alt"
                            ></i>

                            <p>{this.checkExistence(workExp?.title)}</p>
                            <small>
                              {this.checkExistence(workExp?.organization)}
                            </small>
                            <small>
                              {", " + this.checkExistence(workExp?.location)}
                            </small>
                          </div>
                          <div>
                            <p style={{ fontWeight: "bold" }}>
                              Employment Type
                            </p>
                            <small style={{ fontWeight: "bold" }}>
                              {this.checkExistence(workExp?.employment_type)}
                            </small>
                          </div>
                          <div>
                            <p style={{ fontWeight: "bold" }}>
                              Date of Joining
                            </p>
                            <small style={{ fontWeight: "bold" }}>
                              {this.checkExistence(workExp?.start_date)}
                            </small>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No work experiences found!</p>
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
                              <i className="fas fa-pencil-alt"></i>
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
