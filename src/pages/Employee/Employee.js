import React, { Component } from "react";
import { toast } from "react-toastify";
import { Card, Grid, Icon } from "semantic-ui-react";
import Admin from "../../abis/Admin.json";
import Employee from "../../abis/Employee.json";
//import LineChart from "../../components/LineChart";
import SkillCard from "../../components/SkillCard";
import "./Employee.css";
import CodeforcesGraph from "../../components/CodeforcesGraph";
import LoadComp from "../../components/LoadComp";
import ModalComponent from "./jiraModal";
import ModalComponentGit from "./GitModal";
import CircularProgress from "@mui/material/CircularProgress";
import { saveAs } from "file-saver";
import getJiraApi from "../../Apis/JiraApi";
import { getGitOrganizationApi } from "../../Apis/GitApi";
import { getGitRepos } from "../../Apis/GitApi";
import { getGitCommits } from "../../Apis/GitApi";
import { getFilesApi } from "../../Apis/FileApi";
import { getSkillsApi } from "../../Apis/EmployeeSkillsApi";
import { getWorkExperienceApi } from "../../Apis/EmployeeExperienceApi";
import { getCertificatesApi } from "../../Apis/EmployeeCertApi";
import { getEducationApi } from "../../Apis/EmployeeEducationApi";
import { getUserApi } from "../../Apis/UsersApi";
import { IPFS_Link } from "../../utils/utils";

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
    orgName: [],
    userInfo: null,
    tokenId:null
  };
  getJiraTasks = async () => {
    console.log("account: ", accounts[0]);
    const name = this.state.employeedata?.name;
    try {
      this.setState({ isLoading: true });
      this.setState({ isDisplayButton: false });
      const response = await getJiraApi(name);
      this.setState({ Response: response?.data?.response });
      const keys = this.state.Response?.issues?.map((issue) => issue.key);
      this.setState({ jiraKeys: keys });
    } catch (error) {
      throw error;
    } finally {
      this.setState({ isLoading: false });
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
      this.setState({ isGitLoading: true });
      this.setState({ isGitDisplayButton: false });
      await getGitOrganizationApi().then((response) => {
        this.setState({ orgName: response?.data[0]?.login });
      });
      await getGitRepos(this.state?.orgName).then((response) => {
        this.setState({ repoNames: response?.data });
      });
    } catch (error) {
      throw error;
    } finally {
      this.setState({ isGitLoading: false });
    }
  };

  handleClick = async (name) => {
    try {
      const response = await getGitCommits(this.state?.orgName, name);
      const commits = response?.data || [];

      const commitsByDate = {};
      commits.forEach((commit) => {
        const date = commit?.commit?.author?.date.split("T")[0];
        if (!commitsByDate[date]) {
          commitsByDate[date] = [];
        }
        commitsByDate[date].push(commit);
      });

      const sortedCommits = Object.entries(commitsByDate)
        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
        .map(([date, commits]) => ({ date, commits }));

      this.setState({ commits: sortedCommits });
      this.openCommitsModal();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  getFiles = async (userAddress) => {
    const myHeaders = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const urlencoded = new URLSearchParams();
    urlencoded.append("userAddress", userAddress);

    await getFilesApi(urlencoded, myHeaders).then((response) => {
      if (response?.data?.response?.files) {
        const files = response.data.response.files[2];
        const names = response.data.response.files[0];
        const extensions = response.data.response.files[1];

        this.setState({ files: files });
        this.setState({ names: names });
        this.setState({ extensions: extensions });
      } else {
        console.log("error");
      }
    });
  };

  handleDownloadClick(url, name) {
    saveAs(url, name);
  }

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
      await this.getUserInfo(accounts[0]);
      this.getSkills();
      this.getCertifications();
      this.getWorkExp();
      this.getEducation();
      this.getGithubCommits();
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
      this.getJiraTasks();
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    this.setState({ loadcomp: false });
  };

  getUserInfo = async (address) => {
    await getUserApi(address).then((response) => {
      this.setState({ tokenId: response?.data?.response?.userInfo?.tokenId });
      this.setState({ userInfo: response?.data?.response?.userInfo });
    });
  };

  getSkills = async () => {
    const id = 0;
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
    const id = 0;
    await getCertificatesApi(id).then((response) => {
      console.log("certificates: ", response?.data?.response);
      const certificationsData = response?.data?.response?.certifications;
      if (Array.isArray(certificationsData)) {
        certificationsData.forEach((element) => {
          certificationsData.push(Object.fromEntries(element));
        });
      }
      console.log("certi: ", certificationsData);
      this.setState({
        certifications: certificationsData,
      });
    });
  };

  getWorkExp = async () => {
    const id = 1;
    await getWorkExperienceApi(id).then((response) => {
      console.log(
        "Work Experience: ",
        response?.data?.response?.workExperiences
      );
      const workExperienceData = response?.data?.response?.workExperiences;
      if (Array.isArray(workExperienceData)) {
        workExperienceData.forEach((element) => {
          workExperienceData.push(Object.fromEntries(element));
        });
      }
      console.log("work: ", workExperienceData);
      this.setState({ workExps: workExperienceData });
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
                  <Card.Header>About</Card.Header>
                  <br/>
                  <span style={{ fontWeight: "bold" }}>
                    {this.checkExistence(this.state.userInfo?.first_name) +
                      " " +
                      this.checkExistence(this.state.userInfo?.last_name)}
                  </span>

                  <div style={{ marginTop: "5px", marginBottom: "5px" }}>
                    <span>
                      {this.checkExistence(this.state.userInfo?.email)}
                    </span>
                  </div>
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
                <Card.Content className="content">
                  <Card.Header style={{ display: "flex" }}>
                    Certifications
                  </Card.Header>
                  <br />
                  <div className="education">
                    {this.state.certifications.length > 0 ? (
                      this.state.certifications.map((certi, index) => (
                        <div className="education-design">
                          <div style={{ color: "black", fontWeight: "bold" }}>
                            <p>{this.checkExistence(certi?.title)}</p>
                            <small>
                              {this.checkExistence(certi?.issuing_organization)}
                            </small>
                          </div>
                          <div>
                            <p style={{ fontWeight: "bold" }}>Issue Date</p>
                            <small style={{ fontWeight: "bold" }}>
                              {this.checkExistence(certi?.issue_date)}
                            </small>
                          </div>
                          <div>
                            <p style={{ fontWeight: "bold" }}>Credential ID</p>
                            <small style={{ fontWeight: "bold" }}>
                              {this.checkExistence(certi?.credential_id)}
                            </small>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No certifications to display!</p>
                    )}
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
                  <div className="education">
                    {this.state.skills?.length > 0 ? (
                      this.state.skills.map((skill, index) => (
                        <div key={index}>
                          <SkillCard skill={skill} />
                        </div>
                      ))
                    ) : (
                      <p>No skills to display!</p>
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
                  <Card.Header>Github Repos</Card.Header>
                  <br />

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
                  <div className="content-list">
                    {this.state?.files?.length &&
                      (this.state?.files || []).map((file, index) => {
                        var extension = this.getIcons(
                          this.state?.extensions[index]
                        );

                        return (
                          <div>
                            <Card className="list-items">
                              <Card.Content>
                                <a
                                  href={IPFS_Link + file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: "black", fontWeight: "bold" }}
                                >
                                  {this.state?.names[index]}
                                </a>
                                <Icon name={extension} />
                              </Card.Content>
                            </Card>
                          </div>
                        );
                      })}
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
