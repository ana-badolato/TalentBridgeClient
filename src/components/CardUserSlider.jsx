import React from "react";
import "../CSS/cardUser.css";
import { Link } from "react-router-dom";

function CardUserSlider(props) {
  return (
    <div className="card-user-slider">
      <Link to={`/user/profile/${props.username}`}>
        <div className="card-user-top-slider">
          <img
            src={props.profilePicture}
            alt={`${props.username}'s profile`}
            className="card-user-image-slider"
          />
          <div className="card-user-details-slider">
            <h4 className="card-user-username-slider">{props.username}</h4>

            {props.bio && <p className="card-user-bio-slider">"{props.bio}"</p>}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CardUserSlider;
