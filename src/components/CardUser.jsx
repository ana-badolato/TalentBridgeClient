import "../App.css";
import "../CSS/cardUser.css";

import { Link, useParams } from "react-router-dom";

import messageLightImg from "../assets/icons/messageLight.svg";

function CardUser(props) {

  const params = useParams()
  //image, username, skills, bio
  return (
    <div className="card-user">
      <Link to={`/user/profile/${props.username}`}>
      <div className="card-user-top">
        <div>

        <img src={props.profilePicture} alt={`${props.username}'s profile`} className="card-user-image" />
        </div>
        <div className="card-user-details">
          <h4 className="card-user-username">{props.username}</h4>

          {/* Solo mostrar la bio si existe */}
          {props.bio && <p className="card-user-bio">"{props.bio}"</p>}
            </div>

      </div>
      <hr className="hr-thin-blue"/>
          <div className="card-user-skills">
            {props.skills.map((skill, index) => (
              <span key={index} className="chip">
                {skill}
              </span> // Cada habilidad convertida en un chip individual
            ))}
          </div>
      </Link>
      <div className="button-container">
      <button
          className="button-small-blue"
          style={{ width: "auto", padding: "8px 16px", alignSelf: "flex-end" }} // Ajusta el ancho y padding
        >
          <div className="icon-text-element">
            <img
              src={messageLightImg}
              alt=""
              className="icon"
            />
            <p>Send Message</p>
          </div>
        </button>
        </div>
    </div>
  );
}

export default CardUser;
