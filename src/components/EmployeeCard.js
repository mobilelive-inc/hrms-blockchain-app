import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Card } from "semantic-ui-react";
import Employee from "../abis/Employee.json";
import "./EmployeeCard.css";
// import LoadComp from "./LoadComp";

const EmployeeCard = (props) => {
  const [employeedata, setEmployeedata] = useState({});
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [workExps, setWorkExps] = useState([]);
  const [educations, setEducations] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [colour] = useState(["#b6e498", "#61dafb", "#764abc", "#83cd29", "#00d1b2"]);
  const [readmore, setReadmore] = useState(false);
  // const [loadcomp, setLoadcomp] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await getSkills(props.employee?.tokenId).then((response) => {
        const skillsData = response?.data?.response?.skills;
        setSkills(skillsData);
      });

      await getCertificates(props.employee?.tokenId).then((response) => {
        const certificationsData = response?.data?.response?.certifications;
        setCertifications(certificationsData);
      });

      await getWorkExp(props.employee?.tokenId).then((response) => {
        const workExperienceData = response?.data?.response?.workExperiences;
        setWorkExps(workExperienceData);
      });

      await getEducation(props.employee?.tokenId).then((response) => {
        const educationData = response?.data?.response?.education;
        setEducations(educationData);
      });

      setEmployeedata(props.employee);
      setPerformance(props.performance);
    };

    fetchData();
  }, [props.employee, props.performance]);

  const getSkills = async (tokenId) => {
    return getSkillsApi(tokenId);
  };

  const getCertificates = async (tokenId) => {
    return getCertificatesApi(tokenId);
  };

  const getWorkExp = async (tokenId) => {
    return getWorkExperienceApi(tokenId);
  };

  const getEducation = async (tokenId) => {
    try {
      const response = await getEducationApi(tokenId);
      return response;
    } catch (error) {
      console.error("Error retrieving education data:", error);
    }
  };

  const toEmployee = () => {
    props.history.push(`/getemployee/${props.employee.proxyAddress}`);
  };

  return  (
    <Card className="employee-card">
      <Card.Content>
        <Card.Header onClick={toEmployee} style={{ cursor: "pointer" }}>
          <span>{`${employeedata?.first_name} ${employeedata?.last_name} `}</span>
          <small>{employeedata.proxyAddress}</small>
        </Card.Header>
        <br></br>
        <div>
          <p>
            <em style={{ fontWeight: "bold" }}>Location : </em>
            <span style={{ color: "black" }}>{`${employeedata?.city}`}</span>
          </p>
        </div>
        <br />
        <div>
          <em style={{ fontWeight: "bold" }}>Description :</em>
          <p style={{ color: "black" }}>{employeedata?.description}</p>
        </div>
        <br />
        <div>
          <em style={{ fontWeight: "bold" }}>Skills:</em>
          <div className="skill-holder">
            {skills?.map((skill, index) => (
              <div
                className="skill-design"
                style={{
                  color: "black",
                  border: `1px solid ${colour[index % 5]}`,
                }}
              >
                <p>{skill.title}</p>
                <small>{skill.experience}</small>
              </div>
            ))}
          </div>
        </div>
        <br />
        {readmore ? (
          <div>
            <div>
              <em style={{ fontWeight: "bold" }}>Education:</em>
              <div className="education">
                {educations?.map((education, index) => (
                  <div className="education-design" style={{ color: "black" }} key={index}>
                    <div>
                      <p>{education.degree} ({education.field_of_study})</p>
                      <small>{education.school}</small>
                    </div>
                    <div>
                      <small>
                        <em>
                          {moment(education.start_date).format("DD-MM-YYYY")} -{" "}
                          {moment(education.end_date).format("DD-MM-YYYY")}
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
              <em style={{ fontWeight: "bold" }}>Certifications:</em>
              <div className="certifications">
                {certifications?.map((certification, index) => (
                  <div
                    className="certification-design"
                    style={{ color: "black" }}
                    key={index}
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
                      <a
                        href="{education.credential_url}"
                        target="_blank"
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
              <em style={{ fontWeight: "bold" }}>Work Experience:</em>
              <div className="workexp">
                {workExps?.map((work, index) => (
                  <div className="workexp-design" style={{ color: "black" }} key={index}>
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
              <br />
              <em style={{ fontWeight: "bold" }}>Performance report:</em>
              <br />
              <div>
                <br />
                <h5>Area of expertise: {performance?.Expertise}</h5>
                <h5>Tool: {performance?.Tool}</h5>
              </div>
              <br />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontWeight: "bold" }}>Score: {performance?.Score}</div>
                <div style={{ marginRight: "30px", fontWeight: "bold" }}>Hourly Rate: {performance?.HourlyRate}</div>
              </div>
            </div>

            <div
              className="readopenclose"
              onClick={() => setReadmore(false)}
            >
              <p>Hide</p>
            </div>
          </div>
        ) : (
          <div
            className="readopenclose"
            onClick={() => setReadmore(true)}
          >
            <p>...Read More</p>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default withRouter(EmployeeCard);
