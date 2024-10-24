import { useEffect, useState } from "react";
import "../App.css";
import "../CSS/sectionTalent.css";
import CardUserSlider from "../components/CardUserSlider.jsx";
import service from "../services/config.js";
import { useNavigate } from "react-router-dom";

function SectionTalent() {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await service.get("/user/");
      setAllUsers(response.data);
    } catch (error) {
      console.log(error);
      navigate("/error");
    }
  };

  return (
    <div className="section-talent-container">
      <p className="title-talents">Our Talents</p>

      {allUsers.length > 0 ? (
        <div className="slider">
          <div className="slider-track">
            {allUsers.map((user) => (
              <CardUserSlider key={user._id} {...user} />
            ))}

            {allUsers.map((user) => (
              <CardUserSlider key={`${user._id}-duplicate`} {...user} />
            ))}
          </div>
        </div>
      ) : (
        <p>Loading talents...</p>
      )}
    </div>
  );
}

export default SectionTalent;
