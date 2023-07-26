import React from "react";
// import { toast } from "react-toastify";
import "./SkillCard.css";

const SkillCard = (props) => {
  // const [colour] = React.useState(["#b6e498", "#61dafb", "#764abc", "#83cd29", "#00d1b2"]);

  const checkExistence = (value) => {
    return value ? value : "-------";
  };
  

  
  const skill = props.skill;

  return (
    <div className="skill-des">
      <div>
        <div>
          <div key={skill?.title}>
            <p style={{ color: "black", fontWeight: "bold" }}>
              {checkExistence(skill?.title)}
            </p>
            <small style={{ color: "black", fontWeight: "bold" }}>
              {checkExistence(skill?.experience) + " years"}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
