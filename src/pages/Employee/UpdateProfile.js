import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
import { Card, Grid, Icon } from "semantic-ui-react";
import Admin from "../../abis/Admin.json";
// import Employee from "../../abis/Employee.json";
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
// import CodeforcesGraph from "../../components/CodeforcesGraph";
import { getUserApi } from "../../Apis/UsersApi";
import { getSkillsApi } from "../../Apis/EmployeeSkillsApi";
import { getCertificatesApi } from "../../Apis/EmployeeCertApi";
import { getWorkExperienceApi } from "../../Apis/EmployeeExperienceApi";
import { getEducationApi } from "../../Apis/EmployeeEducationApi";

// import {
//   reqCertiEndorsementFunc,
//   reqEducationEndorsementFunc,
//   reqWorkexpEndorsementFunc,
// } from "../../firebase/api";
import moment from "moment/moment";

const UpdateProfile = () => {
  // const [employeedata, setEmployeedata] = useState({});
  // const [overallEndorsement, setOverallEndorsement] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [workExps, setWorkExps] = useState([]);
  const [educations, setEducations] = useState([]);
  // const [readmore, setReadmore] = useState(false);
  const [certificationModal, setCertificationModal] = useState(false);
  const [workexpModal, setWorkexpModal] = useState(false);
  const [skillmodal, setSkillmodal] = useState(false);
  const [filemodal, setFilemodal] = useState(false);
  const [educationmodal, setEducationmodal] = useState(false);
  const [editFieldModal, setEditFieldModal] = useState(false);
  // const [isDescription, setIsDescription] = useState(false);
  // const [loadcomp, setLoadcomp] = useState(false);
  // const [EmployeeContract, setEmployeeContract] = useState({});
  const [userInfo, setUserInfo] = useState(null);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedWorkExp, setSelectedWorkExp] = useState(null);
  // const [selectedUserInfo,setSelectedUserInfo]=useState(null);
  const [tokenId, setTokenId] = useState(null);
  const [index, setIndex] = useState(0);
  const [editing,setEditing]=useState(false);
  const [fetchUserInfo, setFetchUserInfo] = useState(true);

  const getUserInfo = async (address) => {
    await getUserApi(address).then((response) => {
      setTokenId(response?.data?.response?.userInfo?.tokenId);
      setUserInfo(response?.data?.response?.userInfo);
      getSkills(response?.data?.response?.userInfo?.tokenId);
      getCertifications(response?.data?.response?.userInfo?.tokenId);
      getWorkExp(response?.data?.response?.userInfo?.tokenId);
      getEducation(response?.data?.response?.userInfo?.tokenId);
      setFetchUserInfo(false);  
    });
  };

  const getSkills = async (tokenId) => {
    const id = tokenId;
    await getSkillsApi(id).then((response) => {
      const skillsData = response?.data?.response?.skills;
      setSkills(skillsData);
    });
  };

  const getCertifications = async (tokenId) => {
    const id = tokenId;
    await getCertificatesApi(id).then((response) => {
      const certificationsData = response?.data?.response?.certifications;
      setCertifications(certificationsData);
    });
  };

  const getWorkExp = async (tokenId) => {
    const id = tokenId;
    await getWorkExperienceApi(id).then((response) => {
      const workExperienceData = response?.data?.response?.workExperiences;
      setWorkExps(workExperienceData);
    });
  };

  const getEducation = async (tokenId) => {
    const id = tokenId;
    try {
      const response = await getEducationApi(id);
      const educationData = response?.data?.response?.education;
      if (Array.isArray(educationData)) {
        setEducations(educationData);
      }
    } catch (error) {
      console.error("Error retrieving education data:", error);
    }
  };

  const checkExistence = (value) => {
    return value ? value : "-------";
  };

  const handleEditEducation = (education, i) => {
    setSelectedEducation(education);
    setIndex(i);
    setEducationmodal(true);  
  };

  const handleEditCertification = (certification, i) => {
    setSelectedCertification(certification);
    setIndex(i);
    setCertificationModal(true);
  };

  const handleEditWorkExp = (workExp, i) => {
    setSelectedWorkExp(workExp);
    setIndex(i);
    setWorkexpModal(true);
  };

  const handleEditSkill = (skill, i) => {
    setSelectedSkill(skill);
    setIndex(i);
    setSkillmodal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      // setLoadcomp(true);
      const web3 = window.web3;
      const networkId = await web3.eth.net.getId();
      const AdminData = await Admin.networks[networkId];
      console.log(AdminData)
      const accounts = await web3.eth.getAccounts();
      try {
        if (fetchUserInfo) {
          await getUserInfo(accounts[0]);
        }  
        // if (tokenId) {
        //   getSkills(tokenId);
        //   getCertifications(tokenId);
        //   getWorkExp(tokenId);
        //   getEducation(tokenId);
          
        // }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchUserInfo]);
  

  

  const closeCertificationModal = () => {
    setCertificationModal(false);
    setSelectedCertification(null);
    getCertifications(tokenId);
  };

  const closeWorkExpModal = () => {
    setWorkexpModal(false);
    setSelectedWorkExp(null);
    getWorkExp(tokenId);
  };

  const closeSkillModal = () => {
    setSkillmodal(false);
    setSelectedSkill(null);
    getSkills(tokenId);
  };

  const closeFileModal = () => {
    setFilemodal(false);
  };

  const closeEducationModal = () => {
    setEducationmodal(false);
    setSelectedEducation(null);
    getEducation(tokenId);
  };

  const closeEditFieldModal = () => {
    setEditFieldModal(false);
  };

  // const certificationVisibility = async (name) => {
  //   const web3 = window.web3;
  //   const networkId = await web3.eth.net.getId();
  //   const AdminData = await Admin.networks[networkId];
  //   const accounts = await web3.eth.getAccounts();
  //   if (AdminData) {
  //     const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
  //     const employeeContractAddress = await admin?.methods
  //       ?.getEmployeeContractByAddress(accounts[0])
  //       .call();
  //     const EmployeeContract = await new web3.eth.Contract(
  //       Employee.abi,
  //       employeeContractAddress
  //     );
  //     await EmployeeContract?.methods
  //       ?.deleteCertification(name)
  //       .send({ from: accounts[0] });
  //     toast.success("Certification visibility changed successfully!!");
  //   } else {
  //     toast.error("The Admin Contract does not exist on this network!");
  //   }
  //   getCertifications();
  // };

  // const workExpVisibility = async (org) => {
  //   const web3 = window.web3;
  //   const networkId = await web3.eth.net.getId();
  //   const AdminData = await Admin.networks[networkId];
  //   const accounts = await web3.eth.getAccounts();
  //   if (AdminData) {
  //     const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
  //     const employeeContractAddress = await admin?.methods
  //       ?.getEmployeeContractByAddress(accounts[0])
  //       .call();
  //     const EmployeeContract = await new web3.eth.Contract(
  //       Employee.abi,
  //       employeeContractAddress
  //     );
  //     await EmployeeContract?.methods
  //       ?.deleteWorkExp(org)
  //       .send({ from: accounts[0] });
  //     toast.success("Work Exp. visibility changed successfully!!");
  //   } else {
  //     toast.error("The Admin Contract does not exist on this network!");
  //   }
  //   getWorkExp();
  // };

  // const reqEducationEndorsement = async (education) => {
  //   reqEducationEndorsementFunc(education);
  // };

  // const reqCertiEndorsement = async (certi) => {
  //   reqCertiEndorsementFunc(certi);
  // };

  // const reqWorkexpEndorsement = async (workExp) => {
  //   reqWorkexpEndorsementFunc(workExp);
  // };

  

  return (
    <div>
      <GetCertificationModal
        isOpen={certificationModal}
        closeCertificationModal={closeCertificationModal}
        tokenId={tokenId}
        certification={selectedCertification}
        index={index}
        editing={editing}
      />
      <GetWorkExpModal
        isOpen={workexpModal}
        closeCertificationModal={closeWorkExpModal}
        tokenId={tokenId}
        workExp={selectedWorkExp}
        index={index}
        editing={editing}
      />
      <GetSkillsModal
        isOpen={skillmodal}
        closeCertificationModal={closeSkillModal}
        tokenId={tokenId}
        skill={selectedSkill}
        index={index}
        editing={editing}
      />
      <GetFilesModal
        isOpen={filemodal}
        closeCertificationModal={closeFileModal}
        tokenId={tokenId}
      />
      <GetEducationModal
        isOpen={educationmodal}
        closeCertificationModal={closeEducationModal}
        education={selectedEducation}
        tokenId={tokenId}
        index={index}
        editing={editing}
      />

      <GetEditFieldModal
        isOpen={editFieldModal}
        closeEditFieldModal={closeEditFieldModal}
        tokenId={tokenId}
        info={userInfo}
        setFetchUserInfo={setFetchUserInfo}
      />

      <Grid>
        <Grid.Row>
          <Grid.Column width={6}>
            <Card className="personal-info">
              <Card.Content>
                <Card.Header>About</Card.Header>
                {userInfo?(
                <div>
                <span style={{ fontWeight: "bold" }}>
                  {checkExistence(userInfo?.first_name) +
                    " " +
                    checkExistence(userInfo?.last_name)}
                </span>

                <span
                  className="add-button"
                  onClick={(e) => {
                    setEditFieldModal(!editFieldModal);

                    // setIsDescription(false);
                  }}
                >
                  <i className="fas fa-pencil-alt"></i>
                </span>
                <div>{checkExistence(userInfo?.email)}</div>

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
                ):(
                  <div>
                    No Information available!
                  </div>
                )}
                <br />
              </Card.Content>
            </Card>
            <Card className="employee-des">
              <Card.Content>
                <div>
                  <span
                    className="add-button"
                    onClick={(e) => {
                      setEditing(false);
                      setEducationmodal(!educationmodal);
                    }}
                  >
                    <i className="fas fa-plus"></i>
                  </span>

                  <Card.Header
                    style={{ fontSize: "19px", fontWeight: "600" }}
                  >
                    Education
                  </Card.Header>
                  <br />
                  <div className="education-module">
                    {educations?.length > 0 ? (
                      educations.map((education, index) => (
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
                                {checkExistence(education?.degree)}
                                {"(" +
                                  checkExistence(education?.field_of_study) +
                                  ")"}
                              </p>
                              <p></p>
                              <span
                                onClick={() =>{
                                  setEditing(true);
                                  handleEditEducation(education, index)
                                }
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
                      ))
                    ) : (
                      <p>No education information available.</p>
                    )}
                  </div>
                </div>
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
                    onClick={(e) =>{ 
                      setEditing(false);
                      setCertificationModal(!certificationModal);
                    }
                    }
                  >
                    <i className="fas fa-plus"></i>
                  </span>
                </Card.Header>
                <br />

                <div className="education">
                  <Grid columns={4}>
                    {certifications.length > 0 ? (
                      certifications.map((certi, index) => {
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
                                  <p>{checkExistence(certi.title)}</p>
                                  <small>
                                    {checkExistence(
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
                                    {checkExistence(
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
                                    <a
                                      href={certi.credential_url}
                                      target="blank"
                                    >
                                      {checkExistence(certi.credential_id)}
                                    </a>
                                  </small>
                                </div>
                              </Grid.Column>
                              <Grid.Column>
                                <span
                                  onClick={() =>{
                                    setEditing(true);
                                    handleEditCertification(certi, index)
                                  }
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
                    onClick={(e) =>{
                      setEditing(false)
                       setWorkexpModal(!workexpModal)}
                    }
                  >
                    <i className="fas fa-plus"></i>
                  </span>
                </Card.Header>
                <br />
                <div className="education">
                  <Grid columns={4}>
                    {workExps?.length > 0 ? (
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
                                  {", " +
                                    checkExistence(workExp?.location)}
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
                            <Grid.Column>
                              <span
                                onClick={() =>{
                                  setEditing(true)
                                  handleEditWorkExp(workExp, index)
                                }
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
                  onClick={(e) =>{
                    setEditing(false)
                     setSkillmodal(!skillmodal)       
                  }}
                >
                  <i className="fas fa-plus"></i>
                </span>
                <Card.Header>Skills</Card.Header>
                <br />
                <br />
                <div className="education">
                  {skills?.length > 0 ? (
                    skills.map((skill, index) => {
                      if (Array.isArray(skill)) {
                        return null;
                      } else if (typeof skill === "object" && skill?.title) {
                        return (
                          <div key={index}>
                            <i
                              className="fas fa-pencil-alt"
                              onClick={() =>{
                                setEditing(true)
                                 handleEditSkill(skill, index)}
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
                  onClick={(e) => setFilemodal(!filemodal)}
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
};

export default UpdateProfile;
