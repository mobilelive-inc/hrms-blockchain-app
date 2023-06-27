import React, { Component } from "react";
import { Card, Grid } from "semantic-ui-react";
import SkillCard from "../../components/SkillCard";
import "./Employee.css";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
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
                      {this.state.educations?.map((education, index) => (
                        <div className="education-design" key={index}>
                          <div
                            style={{ paddingRight: "50px", color: "black" }}
                          >
                            <p>{education.degree} ({education.field_of_study})</p>
                            <small
                              style={{
                                wordBreak: "break-word",
                                fontSize: "10px",
                              }}
                            >
                              {education.school}
                            </small>
                          </div>
                          <div>
                            <small style={{ color: "black" }}>
                              <em>
                                {education.start_date} - {education.end_date}
                              </em>
                            </small>
                            <p
                              style={{
                                opacity: "0.7",
                              }}
                            >
                              {education.grade}
                            </p>
                          </div>
                          <p>{education.description}</p>
                        </div>
                      ))}
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
                    {this.state.certifications?.map(
                      (certi, index) =>
                        certi.visible && (
                          <div key={index} className="certification-container">
                            <div style={{ color: "black" }}>
                              <p>{certi.name}</p>
                              <small style={{ wordBreak: "break-word" }}>
                                {certi.organization}
                              </small>
                              <p
                                style={{
                                  color: certi.endorsed ? "#00d1b2" : "yellow",
                                  opacity: "0.7",
                                }}
                              >
                                {certi.endorsed
                                  ? "Endorsed"
                                  : "Not Yet Endorsed"}
                              </p>
                            </div>
                            <div>
                              <div style={{ width: "100px" }}>
                                <CircularProgressbar
                                  value={certi.score}
                                  text={`Score - ${certi.score}%`}
                                  strokeWidth="5"
                                  styles={buildStyles({
                                    strokeLinecap: "round",
                                    textSize: "12px",
                                    pathTransitionDuration: 1,
                                    pathColor: `rgba(255,255,255, ${
                                      certi.score / 100
                                    })`,
                                    textColor: "black",
                                    trailColor: "#393b3fa6",
                                    backgroundColor: "white",
                                  })}
                                />
                              </div>
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </Card.Content>
              </Card>
              <Card className="employee-des">
                <Card.Content>
                  <Card.Header>Work Experiences</Card.Header>
                  <br />
                  <div className="education">
                    {this.state.workExps?.map(
                      (workExp, index) =>
                        workExp.visible && (
                          <div className="education-design" key={index}>
                            <div style={{ color: "#c5c6c7" }}>
                              <p>{workExp.role}</p>
                              <small style={{ wordBreak: "break-word" }}>
                                {workExp.organization}
                              </small>
                            </div>
                            <div>
                              <small>
                                <em>
                                  {workExp.startdate} - {workExp.enddate}
                                </em>
                              </small>
                              <p
                                style={{
                                  color: workExp.endorsed
                                    ? "#00d1b2"
                                    : "yellow",
                                  opacity: "0.7",
                                }}
                              >
                                {workExp.endorsed
                                  ? "Endorsed"
                                  : "Not Yet Endorsed"}
                              </p>
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </Card.Content>
              </Card>
              <Card className="employee-des">
                <Card.Content>
                  <Card.Header>Skills</Card.Header>
                  <br />
                  <div className="skill-height-container">
                    {this.state.skills?.map((skill, index) =>
                      skill.visible ? (
                        <div>
                          <SkillCard skill={skill} key={index} />
                        </div>
                      ) : (
                        <></>
                      )
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
