import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context.jsx"; // Importar el contexto de autenticación
import "../App.css";
import "../CSS/cardProject.css";

function CardProject(props) {
  const { isLoggedIn, loggedUserId } = useContext(AuthContext);
  const isOwner = isLoggedIn && String(loggedUserId) === String(props.owner._id);

  return (
    <div className="card-pr-container">
      <Link to={`/project/${props._id}`}>
        {/* Imagen y botones de editar/eliminar */}
        <div className="card-pr-section-img-buttons">
          <img src={props.image} alt={props.title} className="card-pr-img" />
          {isOwner && props.isOwnProfile && (
            <div className="card-pr-section-buttons">
              <button className="card-pr-button">
                <p>Edit</p>
              </button>
              <button className="card-pr-button">
                <p>Delete</p>
              </button>
            </div>
          )}
        </div>

        {/* Información del proyecto */}
        <div className="card-pr-section-content">
          <h4 className="card-pr-title">{props.title}</h4>
          <span className="card-pr-category">{props.category}</span>
          <p className="card-pr-description">{props.description}</p>
        </div>
      </Link>
          <hr className="hr-thin-light"/>
      {/* Sección inferior con la información del propietario */}
      <div className="card-pr-section-bottom">
        <div className="card-pr-section-profile">
          <img
            src={props.owner.profilePicture}
            alt={props.owner.username}
            className="card-profile-img"
          />
{/*           <p><span>Leaded by </span>{props.owner.username.charAt(0).toUpperCase() + props.owner.username.slice(1)}</p> */}
        </div>
        <button className="button-small-blue">
          <p>Apply</p>
        </button>
      </div>
    </div>
  );
}

export default CardProject;
