import React from 'react';
import "../CSS/cardUser.css"; // Aquí estarán los estilos de la tarjeta individual

function CardUserSlider(props) {
  return (
    <div className="card-user-slider">
      <div className="card-user-top-slider">
        <img
          src={props.profilePicture}
          alt={`${props.username}'s profile`}
          className="card-user-image-slider"
        />
        <div className="card-user-details-slider">
          <h4 className="card-user-username-slider">{props.username}</h4>
          {/* Solo mostrar la bio si existe */}
          {props.bio && <p className="card-user-bio-slider">"{props.bio}"</p>}
        </div>
      </div>
    </div>
  );
}

export default CardUserSlider;
