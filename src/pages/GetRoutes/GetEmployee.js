import React, { Component } from "react";
import { Card, Grid,Icon } from "semantic-ui-react";
import SkillCard from "../../components/SkillCard";
import "./Employee.css";
import moment from "moment";
import LoadComp from "../../components/LoadComp";
import CodeforcesGraph from "../../components/CodeforcesGraph";
import { getUserApi } from "../../Apis/UsersApi";
import { getSkillsApi } from "../../Apis/EmployeeSkillsApi";
import { getWorkExperienceApi } from "../../Apis/EmployeeExperienceApi";
import { getCertificatesApi } from "../../Apis/EmployeeCertApi";
import { getEducationApi } from "../../Apis/EmployeeEducationApi";

export default class GetEmployee extends Component {
  state = {
    employeedata: {},
    overallEndorsement: [],
    skills: [],
    certifications: [],
    workExps: [],
    educations: [],
    colour: ["#b6e498", "#61dafb", "#764abc", "#83cd29", "#00d1b2"],
    readmore: false,
    loadcomp: false,
  };

  componentDidMount = async () => {
    this.setState({ loadcomp: true });
    const employee_address = this.props?.match?.params?.employee_address;
    let token_id;
    const employeeData = await getUserApi(employee_address);
    token_id = employeeData?.data?.response?.userInfo?.tokenId
    const employeedata = {proxyAddress: employee_address, ...employeeData?.data?.response?.userInfo};

    this.getSkills(token_id);
    this.getCertifications(token_id);
    this.getWorkExp(token_id);
    this.getEducation(token_id);

    this.setState({
      employeedata: employeedata,
      loadcomp: false,
    });
  };
  checkExistence(value) {
    return value ? value : "-------";
  }
  getSkills = async (tokenId) => {
    await getSkillsApi(tokenId).then((response) => {
      console.log("skills: ", response?.data?.response?.skills);
      const skillsData = response?.data?.response?.skills;
      console.log("skil ", skillsData);
      this.setState({ skills: skillsData });
    });
  };

  getCertifications = async (tokenId) => {
    await getCertificatesApi(tokenId).then((response) => {
      const certificationsData = response?.data?.response?.certifications;
      this.setState({
        certifications: certificationsData,
      });
    });
  };

  getWorkExp = async (tokenId) => {
    await getWorkExperienceApi(tokenId).then((response) => {
      const workExperienceData = response?.data?.response?.workExperiences;
      this.setState({ workExps: workExperienceData });
    });
  };

  getEducation = async (tokenId) => {
      try {
        const response = await getEducationApi(tokenId);
        const educationData = response?.data?.response?.education;
     this.setState({ educations: educationData });
      
      } catch (error) {
        console.error("Error retrieving education data:", error);
      }
  };

  render() {
    return this.state.loadcomp ? (
      <LoadComp />
    ) : (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column width={6}>
              <Card className="personal-info">
                <Card.Content>
                  <Card.Header>
                    {`${this.state.employeedata?.first_name} ${this.state.employeedata?.last_name}`}
                    <small
                      style={{ wordBreak: "break-word", color: "black" }}
                    >
                      {this.state.employeedata?.proxyAddress}
                    </small>
                  </Card.Header>
                  <br />
                  <div>
                    <p>
                      <em>Location: </em>
                      <span style={{ color: "black" }}>
                        {this.state.employeedata?.city}
                      </span>
                    </p>
                  </div>
                  <br />
                </Card.Content>
              </Card>
              <Card className="employee-des">
                <Card.Content>
                  <Card.Header>About:</Card.Header>
                  <div>
                    <p style={{ color: "#c5c6c7" }}>
                      {this.state.employeedata?.description}
                    </p>
                  </div>
                  <br />
                  <div>
                    <Card.Header
                      style={{ fontSize: "19px", fontWeight: "600" }}
                    >
                      Education:
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
                <Card.Content>
                  <Card.Header>Certifications</Card.Header>
                  <br />
                  <div>
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
                  <Card.Header>Work Experiences</Card.Header>
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
                  <Card.Header>Skills</Card.Header>
                  <br />
                  <div className="skill-height-container">
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
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
