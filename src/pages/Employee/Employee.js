import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Card, Grid, Icon } from "semantic-ui-react";
import Admin from "../../abis/Admin.json";
import SkillCard from "../../components/SkillCard";
import moment from "moment";
import "./Employee.css";
import ModalComponent from "./jiraModal";
import ModalComponentGit from "./GitModal";
import CircularProgress from "@mui/material/CircularProgress";
import getJiraApi from "../../Apis/JiraApi";
import { getGitOrganizationApi } from "../../Apis/GitApi";
import { getGitRepos } from "../../Apis/GitApi";
import { getGitCommits } from "../../Apis/GitApi";
import { getFilesApi } from "../../Apis/FileApi";
import { getSkillsApi } from "../../Apis/EmployeeSkillsApi";
import { getWorkExperienceApi } from "../../Apis/EmployeeExperienceApi";
import { getCertificatesApi } from "../../Apis/EmployeeCertApi";
import { getEducationApi } from "../../Apis/EmployeeEducationApi";
import { employeePerformanceApi } from "../../Apis/EmployeePerformanceApi";
import { getUserApi } from "../../Apis/UsersApi";
import { getProjectsList } from "../../Apis/Project";
import { IPFS_Link } from "../../utils/utils";

let accounts = null;

const EmployeePage = () => {
 
  const [skills, setSkills] = useState([]);
  const [files, setFiles] = useState([]);
  const [jiraKeys, setJiraKeys] = useState([]);
  const [Response, setResponse] = useState([]);
  const [repoNames, setRepoNames] = useState([]);
  const [commits, setCommits] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [workExps, setWorkExps] = useState([]);
  const [educations, setEducations] = useState([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [showCommitsModal, setShowCommitsModal] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGitLoading, setIsGitLoading] = useState(false);
  const [orgName, setOrgName] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [tokenId, setTokenId] = useState(null);
  const [performances, setPerformances] = useState({});
  const [projects,setProjects]=useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const web3 = window.web3;
      const networkId = await web3.eth.net.getId();
      const AdminData = await Admin.networks[networkId];
      console.log(AdminData);
      accounts = await web3.eth.getAccounts();

      try {
        await getUserInfo(accounts[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      finally {
        setIsLoadingPage(false);
       }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenId]);

  const getJiraTasks = async (first_name) => {
    const name = first_name;
    try {
      setIsLoading(true);
      const response = await getJiraApi(name);
      setResponse(response?.data?.response);
      const keys = response?.data?.response?.issues?.map((issue) => issue.key);
      setJiraKeys(keys);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (key) => {
    setSelectedKey(key);
    setShowModal(true);
  };

  const openCommitsModal = (key) => {
    setShowCommitsModal(true);
  };

  const closeCommitsModal = (key) => {
    setShowCommitsModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const getGithubCommits = async () => {
    try {
      setIsGitLoading(true);
      const response = await getGitOrganizationApi();
      setOrgName(response?.data[0]?.login);
      const repos = await getGitRepos(response?.data[0]?.login);
      setRepoNames(repos?.data);
    } catch (error) {
      throw error;
    } finally {
      setIsGitLoading(false);
    }
  };

  const handleClick = async (name) => {
    try {
      const response = await getGitCommits(orgName, name);
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

      setCommits(sortedCommits);
      openCommitsModal();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  const getFiles = async (userAddress,tokenId) => {
    const myHeaders = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const urlencoded = new URLSearchParams();
    urlencoded.append("userAddress", userAddress);

    const response = await getFilesApi(urlencoded, myHeaders,tokenId);
    if (response?.data?.response?.files) {
      setFiles(response?.data?.response?.files);
    } else {
      toast.error("error");
    }
  };

  // const getIcons = (extension) => {
  //   switch (extension) {
  //     case "png":
  //       return "file image";
  //     case "doc":
  //       return "file word";
  //     case "pdf":
  //       return "file pdf";
  //     default:
  //       return "file";
  //   }
  // };

  const getUserInfo = async (address) => {
    try {
      const response = await getUserApi(address);
      if (response) {
        setTokenId(response?.data?.response?.userInfo?.tokenId);
        setUserInfo(response?.data?.response?.userInfo);
        getSkills(response?.data?.response?.userInfo?.tokenId);
        getCertifications(response?.data?.response?.userInfo?.tokenId);
        getWorkExp(response?.data?.response?.userInfo?.tokenId);
        getEducation(response?.data?.response?.userInfo?.tokenId);
        getGithubCommits();
        getFiles(accounts[0],response?.data?.response?.userInfo?.tokenId);
        getPerformance(response?.data?.response?.userInfo?.email);
        getJiraTasks(response?.data?.response?.userInfo?.first_name);
        getProjects(response?.data?.response?.userInfo?.tokenId);
      }
    } catch (error) {
      toast.error("Error retrieving user info:", error);
    }
  };

  const getProjects = async (tokenId)=>{
    try {
      const projects = await getProjectsList(tokenId);
      setProjects(projects?.data?.response?.projects);
    } catch (error) {
      toast.error(error);
    }
  }
  const getPerformance = async (email) => {
    try {
      const performance_info = await employeePerformanceApi(email);
      setPerformances(performance_info?.data[0]);
    } catch (error) {
      toast.error(error);
    }
  };

  const getSkills = async (tokenId) => {
    try {
      const response = await getSkillsApi(tokenId);
      const skillsData = response?.data?.response?.skills;
      setSkills(skillsData);
    } catch (error) {
      toast.error(error);
    }
  };

  const getCertifications = async (tokenId) => {
    try {
      const response = await getCertificatesApi(tokenId);
      const certificationsData = response?.data?.response?.certifications;
      setCertifications(certificationsData);
    } catch (error) {
      toast.error(error);
    }
  };

  const getWorkExp = async (tokenId) => {
    try {
      const response = await getWorkExperienceApi(tokenId);
      const workExperienceData = response?.data?.response?.workExperiences;
      if (Array.isArray(workExperienceData)) {
        setWorkExps(workExperienceData);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const getEducation = async (tokenId) => {
    try {
      const response = await getEducationApi(tokenId);
      const educationData = response?.data?.response?.education;

      if (Array.isArray(educationData)) {
        setEducations(educationData);
      }
    } catch (error) {
      toast.error("Error retrieving education data:", error);
    }
  };

  const checkExistence = (value) => {
    return value ? value : "N/A";
  };

  return (
    <div>
      {isLoadingPage ? ( 
        <div className="loader-container">
          <CircularProgress /> 
        </div>
      ) : (
      <Grid>
        <Grid.Row>
          <Grid.Column width={6}>
            <Card className="personal-info">
              <Card.Content>
                <Card.Header>About</Card.Header>
                {userInfo ? (
                  <div>
                    <br />
                    <span style={{ fontWeight: "bold" }}>
                      {checkExistence(userInfo?.first_name) +
                        " " +
                        checkExistence(userInfo?.last_name)}
                    </span>

                    <div style={{ marginTop: "5px", marginBottom: "5px" }}>
                      <span>{checkExistence(userInfo?.email)}</span>
                    </div>
                    <div style={{ marginTop: "5px", marginBottom: "5px" }}>
                      <span style={{ fontWeight: "bold" }}>
                        {checkExistence(userInfo?.current_position)}
                      </span>
                    </div>
                    <div>
                      <p>
                        <em>Location: </em>
                        <span style={{ color: "black" }}>
                          {checkExistence(userInfo?.city) + ","}
                          {checkExistence(userInfo?.country)}
                        </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>No Information available!</div>
                )}
                <br />
              </Card.Content>
            </Card>

            <Card className="employee-des">
              <Card.Content>
                <div>
                  <Card.Header style={{ fontSize: "19px", fontWeight: "600" }}>
                    Education:
                  </Card.Header>
                  <br />
                  {educations.length > 0 ? (
                    <div className="education-module">
                      {educations?.map((education, index) => (
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
                                {checkExistence(education?.degree) +
                                  "(" +
                                  checkExistence(education?.field_of_study) +
                                  ")"}
                              </p>
                            </div>
                            <small
                              style={{
                                wordBreak: "break-word",
                                fontSize: "10px",
                              }}
                            >
                              {checkExistence(education?.school)}
                            </small>
                            <br />

                            <small>
                              {moment(
                                checkExistence(education?.start_date)
                              ).format("DD-MM-YYYY")}
                              {"-" +
                                moment(
                                  checkExistence(education?.end_date)
                                ).format("DD-MM-YYYY")}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>No Education available to display!</div>
                  )}
                </div>
              </Card.Content>
            </Card>

            <Card className="employee-des">
              <Card.Content>
                <Card.Header>Employee Performance</Card.Header>
                <br/>
                {performances ? (
                  <div style={{fontWeight:"bold"}}>Percentage Score: {performances.Score}</div>
                ):(
                  <div>
                    No Performance to display!
                  </div>
                )}
              </Card.Content>
            </Card>

            <Card className="employee-des">
              <Card.Content>
                <Card.Header>My Projects List</Card.Header>
                <br/>
                  {
                    projects.length > 0 ? (
                        projects.map((project)=>(
                          <li style={{fontWeight:"bold"}}>
                              {project.name}
                          </li>
                        ))
                    ):(
                      <div>
                        No Projects to display!
                      </div>
                    )
                  }
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
                  <Grid columns={3}>
                    {certifications.length !== 0 ? (
                      certifications.map((certi, index) => {
                        return (
                          <Grid.Row key={index}>
                            <Grid.Column>
                              <div
                                style={{
                                  color: "black",
                                  fontWeight: "bold",
                                }}
                              >
                                <p>{checkExistence(certi.title)}</p>
                                <small>
                                  {checkExistence(certi.issuing_organization)}
                                </small>
                              </div>
                            </Grid.Column>
                            <Grid.Column>
                              <div>
                                <p style={{ fontWeight: "bold" }}>Issue Date</p>
                                <small style={{ fontWeight: "bold" }}>
                                  {moment(
                                    checkExistence(certi.issue_date)
                                  ).format("DD-MM-YYYY")}
                                </small>
                              </div>
                            </Grid.Column>
                            <Grid.Column>
                              <div>
                                <p style={{ fontWeight: "bold" }}>
                                  Credential ID
                                </p>
                                <small style={{ fontWeight: "bold" }}>
                                  <a href={certi.credential_url} target="blank">
                                    {checkExistence(certi.credential_id)}
                                  </a>
                                </small>
                              </div>
                            </Grid.Column>
                          </Grid.Row>
                        );
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
                  <Grid columns={3}>
                    {workExps.length > 0 ? (
                      workExps.map((workExp, index) => {
                        return (
                          <Grid.Row key={index}>
                            <Grid.Column>
                              <div
                                style={{
                                  color: "black",
                                  fontWeight: "bold",
                                }}
                              >
                                <p>{checkExistence(workExp?.title)}</p>
                                <small>
                                  {checkExistence(workExp?.company_name)}
                                </small>
                                <small>
                                  {", " + checkExistence(workExp?.location)}
                                </small>
                              </div>
                            </Grid.Column>
                            <Grid.Column>
                              <div>
                                <p style={{ fontWeight: "bold" }}>
                                  Employment Type
                                </p>
                                <small style={{ fontWeight: "bold" }}>
                                  {checkExistence(workExp?.employment_type)}
                                </small>
                              </div>
                            </Grid.Column>
                            <Grid.Column>
                              <div>
                                <p style={{ fontWeight: "bold" }}>
                                  Date of Joining
                                </p>
                                <small style={{ fontWeight: "bold" }}>
                                  {moment(workExp.start_date).format(
                                    "DD-MM-YYYY"
                                  )}
                                </small>
                              </div>
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
                <Card.Header>Skills</Card.Header>
                <br />
                <div className="education">
                  {skills.length > 0 ? (
                    skills.map((skill, index) => {
                      if (Array.isArray(skill)) {
                        return null;
                      } else if (typeof skill === "object" && skill?.title) {
                        return (
                          <div key={index}>
                            <SkillCard skill={skill} key={index} />
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
                <Card.Header>JIRA Tasks</Card.Header>
                <br />
                <div className="content-list">
                  {isLoading ? (
                    <CircularProgress />
                  ) : jiraKeys.length > 0 ? (
                    jiraKeys.map((Key, index) => (
                      <div
                        style={{ fontWeight: "bold" }}
                        key={index}
                        onClick={() => openModal(Key)}
                      >
                        <Card className="list-items" key={index}>
                          <Card.Content className="info-style">
                            {Key}
                            <Icon
                              name="external alternate"
                              style={{ marginLeft: "8px" }}
                            />
                          </Card.Content>
                        </Card>
                      </div>
                    ))
                  ) : (
                    <div>No JIRA Tasks to display!</div>
                  )}
                </div>
              </Card.Content>
            </Card>
            <ModalComponent
              showModal={showModal}
              selectedKey={selectedKey}
              onClose={closeModal}
              Response={Response}
            />
            <Card className="employee-des">
              <Card.Content>
                <Card.Header>Github Repos</Card.Header>
                <br />

                <div className="content-list">
                  {isGitLoading ? (
                    <CircularProgress />
                  ) : repoNames ? (
                    repoNames?.map((n, index) => (
                      <div onClick={() => handleClick(n.name)} key={index}>
                        <Card className="list-items" key={index}>
                          <Card.Content className="info-style">
                            {n.name}
                            <Icon
                              name="external alternate"
                              style={{ marginLeft: "8px" }}
                            />
                          </Card.Content>
                        </Card>
                      </div>
                    ))
                  ) : (
                    <div>No repos To display!</div>
                  )}
                </div>
              </Card.Content>
            </Card>
            <ModalComponentGit
              showModal={showCommitsModal}
              commits={commits}
              onClose={closeCommitsModal}
            />
            <Card className="employee-des">
              <Card.Content>
                <Card.Header>Files</Card.Header>
                <br />
                <div className="content-list">
                  {files?.length > 0 ? (
                    (files || []).map((file, index) => {
                      // const extension = getIcons(extensions[index]);

                      return (
                        <div key={index}>
                          <Card className="list-items">
                            <Card.Content>
                              <a
                                href={IPFS_Link+file.ipfsHash}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "black",
                                  fontWeight: "bold",
                                }}
                              >
                                {file.fileName}
                              </a>
                              {/* <Icon name={extension} /> */}
                            </Card.Content>
                          </Card>
                        </div>
                      );
                    })
                  ) : (
                    <div>No files to display!</div>
                  )}
                </div>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      )}
    </div>
  );
};

export default EmployeePage;
