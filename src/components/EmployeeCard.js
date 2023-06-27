import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Card } from "semantic-ui-react";
import { getSkillsApi } from "../Apis/EmployeeSkillsApi";
import { getWorkExperienceApi } from "../Apis/EmployeeExperienceApi";
import { getCertificatesApi } from "../Apis/EmployeeCertApi";
import { getEducationApi } from "../Apis/EmployeeEducationApi";
import "./EmployeeCard.css";
import LoadComp from "./LoadComp";

class EmployeeCard extends Component {
  state = {
    employeedata: {},
    skills: [],
    certifications: [],
    workExps: [],
    educations: [],
    colour: ["#b6e498", "#61dafb", "#764abc", "#83cd29", "#00d1b2"],
    readmore: false,
    loadcomp: false,
  };

  componentDidMount = async () => {
    this.getSkills(this.props.employee.tokenId);
    this.getCertifications(this.props.employee.tokenId);
    this.getWorkExp(this.props.employee.tokenId);
    this.getEducation(this.props.employee.tokenId);
    
    this.setState({ employeedata: this.props.employee });
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

  toEmployee = () => {
    this.props.history.push(
      `/getemployee/${this.props.employee.proxyAddress}`
    );
  };

  render() {
    return this.state.loadcomp ? (
      <LoadComp />
    ) : (
      <Card className="employee-card">
        <Card.Content>
          <Card.Header onClick={this.toEmployee} style={{ cursor: "pointer" }}>
            <span>{`${this.state.employeedata?.first_name} ${this.state.employeedata?.last_name} `}</span>
            <small>{this.state.employeedata.proxyAddress}</small>
          </Card.Header>
          <br></br>
          <div>
            <p>
              <em>Location : </em>
              <span style={{ color: "black" }}>
                {`${this.state.employeedata?.city}`}
              </span>
            </p>
          </div>
          <br />
          <div>
            <em>Description :</em>
            <p style={{ color: "#c5c6c7" }}>
              {this.state.employeedata?.description}
            </p>
          </div>
          <br />
          <div>
            <em>Skills:</em>
            <div className="skill-holder">
              {this.state.skills?.map((skill, index) => (
                <div
                  className="skill-design"
                  style={{
                    color: "#c5c6c7",
                    border: `1px solid ${this.state.colour[index % 5]}`,
                  }}
                >
                  <p>{skill.title}</p>
                  <small>{skill.experience}</small>
                </div>
              ))}
            </div>
          </div>
          <br />
          {this.state.readmore ? (
            <div>
              <div>
                <em>Education:</em>
                <div className="education">
                  {this.state.educations?.map((education, index) => (
                    <div
                      className="education-design"
                      style={{ color: "#c5c6c7" }}
                    >
                      <div>
                        <p>{education.degree} ({education.field_of_study})</p>
                        <small>{education.school}</small>
                      </div>
                      <div>
                        <small>
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
                    </div>
                  ))}
                </div>
              </div>
              <br />
              <div>
                <em>Certifications:</em>
                <div className="certifications">
                  {this.state.certifications?.map((certification, index) => (
                    <div
                      className="certification-design"
                      style={{ color: "#c5c6c7" }}
                    >
                      <div>
                        <p>{certification.title}</p>
                        <small>{certification.issuing_organization}</small>
                      </div>
                      <div>
                      <small>
                          <em>
                            {certification.start_date} - {certification.end_date}
                          </em>
                        </small>
                        <a href="{education.credential_url}" target="_blank"
                        >
                          {certification.credential_id}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <br />
              <div>
                <em>Work Experience:</em>
                <div className="workexp">
                  {this.state.workExps?.map((work, index) => (
                    <div
                      className="workexp-design"
                      style={{ color: "#c5c6c7" }}
                    >
                      <div>
                        <p>{work.title}</p>
                        <small>{work.company_name}</small>
                      </div>
                      <div>
                        <p>
                          <em>
                            <small>
                              {work.start_date} - {work.end_date}
                            </small>
                          </em>
                        </p>
                        <p
                          style={{
                            opacity: "0.7",
                          }}
                        >
                          {work.employement_type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="readopenclose"
                onClick={() => this.setState({ readmore: false })}
              >
                <p>Hide</p>
              </div>
            </div>
          ) : (
            <div
              className="readopenclose"
              onClick={() => this.setState({ readmore: true })}
            >
              <p>...Read More</p>
            </div>
          )}
        </Card.Content>
      </Card>
    );
  }
}

export default withRouter(EmployeeCard);
