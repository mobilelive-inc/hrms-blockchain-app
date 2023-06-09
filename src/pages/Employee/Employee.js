import React, { Component } from "react";
import { toast } from "react-toastify";
import { Card, Grid, Icon } from "semantic-ui-react";
import Admin from "../../abis/Admin.json";
import Employee from "../../abis/Employee.json";
import LineChart from "../../components/LineChart";
import SkillCard from "../../components/SkillCard";
import "./Employee.css";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import CodeforcesGraph from "../../components/CodeforcesGraph";
import LoadComp from "../../components/LoadComp";
import axios from "axios";
import ModalComponent from "./jiraModal";
import ModalComponentGit from "./GitModal";
import CircularProgress from "@mui/material/CircularProgress";

const formData = new FormData();
let accounts = null;
export default class EmployeePage extends Component {
  state = {
    employeedata: {},
    overallEndorsement: [],
    skills: [],
    files: [],
    assigneeName: [],
    assigneeImg: [],
    description: [],
    key: [],
    jiraKeys: [],
    Response: [],
    repoNames: [],
    commits: [],
    names: [],
    extensions: [],
    certifications: [],
    workExps: [],
    educations: [],
    colour: ["#b6e498", "#61dafb", "#764abc", "#83cd29", "#00d1b2"],
    readmore: false,
    codeforces_res: [],
    loadcomp: false,
    showModal: false,
    showCommitsModal: false,
    selectedKey: null,
    isLoading: false,
    isDisplayButton: true,
    isGitDisplayButton: true,
    isGitLoading: false,
    orgName:[]
  };
  IPFS_Link = "https://ipfs.moralis.io:2053/ipfs/";

  getJiraTasks = async () => {
    console.log("account: ", accounts[0]);
    const name = this.state.employeedata?.name;

    try {
      this.setState({ isLoading: true }); // Set isLoading to true
      this.setState({ isDisplayButton: false });
      const response = await axios.get(
        "http://d1h99yrv311co6.cloudfront.net/api/jira/issues",
        {
          params: {
            userName: name,
          },
        }
      );

      this.setState({ Response: response?.data?.response });
      const keys = this.state.Response?.issues?.map((issue) => issue.key);
      this.setState({ jiraKeys: keys });
    } catch (error) {
      throw error;
    } finally {
      this.setState({ isLoading: false }); // Set isLoading to false
    }
  };

  openModal = (key) => {
    this.setState({ selectedKey: key, showModal: true });
  };

  openCommitsModal = (key) => {
    this.setState({ showCommitsModal: true });
  };
  closeCommitsModal = (key) => {
    this.setState({ showCommitsModal: false });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  getGithubCommits = async () => {
    try {
      this.setState({ isGitLoading: true }); // Set isLoading to true
      this.setState({ isGitDisplayButton: false });
      await axios
        .get("http://d1h99yrv311co6.cloudfront.net/api/github/user/organizations")
        .then((response) => {
          this.setState({orgName:response?.data[0]?.login});
        });
      await axios
      .get(`http://d1h99yrv311co6.cloudfront.net/api/github/organization/repos?orgName=${this.state.orgName}`)

        .then((response) => {
          this.setState({ repoNames: response?.data });
        });
    } catch (error) {
      throw error;
    } finally {
      this.setState({ isGitLoading: false }); 
    }
  };

  handleClick = async (name) => {
    axios
      .get(
        `http://d1h99yrv311co6.cloudfront.net/api/github/repo/commits?user=${this.state.orgName}&repoName=${name}`
      )
      .then((response) => {
        this.setState({ commits: response?.data });
        console.log("commits: ", response?.data);
      });
  
    this.openCommitsModal();
  };
  
  getFiles = async (userAddress) => {
    formData.append("userAddress", userAddress);
    axios
      .post("http://d1h99yrv311co6.cloudfront.net/api/getfiles", formData)
      .then((response) => {
        if (response?.data?.userFiles) {
          this.setState({ files: response?.data?.userFiles[2] });
          this.setState({ names: response?.data?.userFiles[0] });
          this.setState({ extensions: response?.data?.userFiles[1] });
        } else {
          console.log("error");
        }
      });
  };

  getIcons(extension) {
    switch (extension) {
      case "png":
        return "file image";
      case "doc":
        return "file word";
      case "pdf":
        return "file pdf";
      default:
        return "file";
    }
  }

  componentDidMount = async () => {
    this.setState({ loadcomp: true });
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    accounts = await web3.eth.getAccounts();
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const employeeContractAddress = await admin?.methods
        ?.getEmployeeContractByAddress(accounts[0])
        .call();
      const EmployeeContract = await new web3.eth.Contract(
        Employee.abi,
        employeeContractAddress
      );
      this.getSkills(EmployeeContract);
      this.getCertifications(EmployeeContract);
      this.getWorkExp(EmployeeContract);
      this.getEducation(EmployeeContract);
      this.getFiles(accounts[0]);
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
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    this.setState({ loadcomp: false });
  };

  getSkills = async (EmployeeContract) => {
    const skillCount = await EmployeeContract?.methods?.getSkillCount().call();
    const skills = await Promise.all(
      Array(parseInt(skillCount))
        .fill()
        .map((ele, index) =>
          EmployeeContract?.methods?.getSkillByIndex(index).call()
        )
    );

    var newskills = [];
    skills.forEach((certi) => {
      newskills.push({
        name: certi[0],
        overall_percentage: certi[1],
        experience: certi[2],
        endorsed: certi[3],
        endorser_address: certi[4],
        review: certi[5],
        visible: certi[6],
      });
      return;
    });

    this.setState({ skills: newskills });
  };

  getCertifications = async (EmployeeContract) => {
    const certiCount = await EmployeeContract?.methods
      ?.getCertificationCount()
      .call();
    const certifications = await Promise.all(
      Array(parseInt(certiCount))
        .fill()
        .map((ele, index) =>
          EmployeeContract?.methods?.getCertificationByIndex(index).call()
        )
    );
    var newcertifications = [];
    certifications.forEach((certi) => {
      newcertifications.push({
        name: certi[0],
        organization: certi[1],
        score: certi[2],
        endorsed: certi[3],
        visible: certi[4],
      });
      return;
    });
    this.setState({ certifications: newcertifications });
  };

  getWorkExp = async (EmployeeContract) => {
    const workExpCount = await EmployeeContract?.methods
      ?.getWorkExpCount()
      .call();
    const workExps = await Promise.all(
      Array(parseInt(workExpCount))
        .fill()
        .map((ele, index) =>
          EmployeeContract?.methods?.getWorkExpByIndex(index).call()
        )
    );

    var newworkExps = [];
    workExps.forEach((work) => {
      newworkExps.push({
        role: work[0],
        organization: work[1],
        startdate: work[2],
        enddate: work[3],
        endorsed: work[4],
        description: work[5],
        visible: work[6],
      });
      return;
    });

    this.setState({ workExps: newworkExps });
  };

  getEducation = async (EmployeeContract) => {
    const educationCount = await EmployeeContract?.methods
      ?.getEducationCount()
      .call();
    const educations = await Promise.all(
      Array(parseInt(educationCount))
        .fill()
        .map((ele, index) =>
          EmployeeContract?.methods?.getEducationByIndex(index).call()
        )
    );
    var neweducation = [];
    educations.forEach((certi) => {
      neweducation.push({
        institute: certi[0],
        startdate: certi[1],
        enddate: certi[2],
        endorsed: certi[3],
        description: certi[4],
      });
      return;
    });
    this.setState({ educations: neweducation });
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
                    {this.state.employeedata?.name}
                    <small style={{ wordBreak: "break-word", color: "black" }}>
                      {this.state.employeedata?.ethAddress}
                    </small>
                  </Card.Header>
                  <br />
                  <div>
                    <p>
                      <em>Location: </em>
                      <span style={{ color: "black" }}>
                        {this.state.employeedata?.location}
                      </span>
                    </p>
                  </div>
                  <br />
                  <div>
                    <p>
                      <em>Overall Endorsement Rating:</em>
                    </p>
                    <LineChart
                      overallEndorsement={this.state.overallEndorsement}
                    />
                  </div>
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
                            style={{ paddingRight: "50px", color: "#c5c6c7" }}
                          >
                            <p>{education.description}</p>
                            <small
                              style={{
                                wordBreak: "break-word",
                                fontSize: "10px",
                              }}
                            >
                              {education.institute}
                            </small>
                          </div>
                          <div>
                            <small style={{ color: "#c5c6c7" }}>
                              <em>
                                {education.startdate} - {education.enddate}
                              </em>
                            </small>
                            <p
                              style={{
                                color: education.endorsed
                                  ? "#00d1b2"
                                  : "yellow",
                                opacity: "0.7",
                              }}
                            >
                              {education.endorsed
                                ? "Endorsed"
                                : "Not Yet Endorsed"}
                            </p>
                          </div>
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
                            <div style={{ color: "#c5c6c7" }}>
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
                                    textColor: "#c5c6c7",
                                    trailColor: "#393b3fa6",
                                    backgroundColor: "#c5c6c7",
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

              <Card className="employee-des">
                <Card.Content>
                  <Card.Header>
                    JIRA Tasks for {this.state.employeedata?.name}
                  </Card.Header>
                  <br />
                  {this.state.isDisplayButton && (
                    <button
                      className="button"
                      onClick={() => this.getJiraTasks()}
                    >
                      JIRA Tasks
                    </button>
                  )}
                  <br />
                  <div className="content-list">
                  {this.state.isLoading ? (
                    <CircularProgress />
                  ) : (
                    this.state.jiraKeys &&
                    this.state.jiraKeys.map((key) => (
                      <p
                        style={{ fontWeight: "bold" }}
                        key={key}
                        onClick={() => this.openModal(key)}
                      >
                        <Card className="list-items">
                          <Card.Content className="info-style">
                            {key}
                            <Icon
                              name="external alternate"
                              style={{ marginLeft: "8px" }}
                            />
                          </Card.Content>
                        </Card>
                      </p>
                    ))
                  )}
                  </div>
                </Card.Content>
              </Card>

              <ModalComponent
                showModal={this.state.showModal}
                selectedKey={this.state.selectedKey}
                onClose={this.closeModal}
                Response={this.state.Response}
              />

              <Card className="employee-des">
                <Card.Content>
                  <Card.Header>Github Commits</Card.Header>
                  <br />
                  {this.state.isGitDisplayButton && (
                    <button className="button" onClick={this.getGithubCommits}>
                      Github Commits
                    </button>
                  )}
                <div className="content-list">
                  {this.state.isGitLoading ? (
                    <CircularProgress />
                  ) : (
                    this.state?.repoNames?.map((n) => (
                      <p onClick={() => this.handleClick(n.name)}>
                        <Card className="list-items">
                          <Card.Content className="info-style">
                            {n.name}
                            <Icon
                              name="external alternate"
                              style={{ marginLeft: "8px" }}
                            />
                          </Card.Content>
                        </Card>
                      </p>
                    ))
                  )}
                  </div>
                </Card.Content>
              </Card>

              <ModalComponentGit
                showModal={this.state.showCommitsModal}
                commits={this.state.commits}
                onClose={this.closeCommitsModal}
              />

              <Card className="employee-des">
                <Card.Content>
                  <Card.Header>Files</Card.Header>
                  <br />
                  {this.state?.files?.length &&
                    (this.state?.files || []).map((file, index) => {
                      var extension = this.getIcons(
                        this.state?.extensions[index]
                      );

                      return (
                        <>
                          <Card
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              margin: "0 !important",
                            }}
                            className="list-items"
                          >
                            <Card.Content>
                              <a
                                href={this.IPFS_Link + file}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {this.state?.names[index]}
                              </a>
                              <Icon name={extension} />
                            </Card.Content>
                          </Card>
                          <br />
                        </>
                      );
                    })}
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
