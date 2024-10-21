import "../App.css";
import "../CSS/cardProject.css";

import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../context/auth.context.jsx"; // Importar el contexto de autenticación
import service from "../services/config.js"; // Importar el servicio para hacer la solicitud de datos

import applyImg from "../assets/icons/apply.svg";
import disabledApplyImg from "../assets/icons/disabledApply.svg";
import deleteImg from "../assets/icons/delete.svg";
import editImg from "../assets/icons/edit.svg";
import dateImg from "../assets/icons/date.svg";
import teamMembersImg from "../assets/icons/teamMembers.svg";

function CardProject(props) {
  const { isLoggedIn, loggedUserId } = useContext(AuthContext);
  const [projectData, setProjectData] = useState(props); // Si los datos son pasados, los usamos directamente
  const [loading, setLoading] = useState(!props.title); // Si no hay datos, los cargamos

  const params = useParams()
  // Si no se pasaron datos, los solicitamos usando projectId
  useEffect(() => {
    if (!props.title) {
      const fetchProjectData = async () => {
        try {
          const response = await service.get(`/project/${props.projectId}`);
          setProjectData(response.data);
          setLoading(false);
          console.log("params", `params`.projectid)
        } catch (error) {
          console.error("Error fetching project data:", error);
          setLoading(false);
        }
      };
      fetchProjectData();
    }
  }, [props.title, props.projectId]);

  if (loading) return <p>Loading project...</p>;

  const {
    owner,
    teamMembers,
    title,
    image,
    startDate,
    mainObjective,
    category,
    _id,
  } = projectData;

  // Verificar si el usuario es el owner
  const isOwner = isLoggedIn && String(loggedUserId) === String(owner?._id);

  // Verificar si el usuario ya es miembro del equipo
  const isTeamMember = teamMembers.some(
    (member) => String(member._id || member) === String(loggedUserId)
  );

  // Condición para deshabilitar el botón:
  const isApplyDisabled = isOwner || isTeamMember;

  const totalMembers = teamMembers.length + 1;

  return (
    <div className="card-pr-container">
      <Link to={`/project/${_id}`}>
        {/* Imagen y botones de editar/eliminar */}
        <div className="card-pr-section-img-buttons">
          <img src={image} alt={title} className="card-pr-img" />
          {isOwner && props.isOwnProfile && (
            <div className="card-pr-section-buttons">
              <Link to={`/editproject/${_id}`}>
              <button className="card-pr-button">
                <img src={editImg} alt="" />
                <p>Edit</p>
              </button>
              </Link>
              <button className="card-pr-button">
                <img src={deleteImg} alt="" />
                <p>Delete</p>
              </button>
            </div>
          )}
        </div>

        {/* Información del proyecto */}
        <div className="card-pr-section-content">
          <h4 className="card-pr-title">{title}</h4>
          <span className="card-pr-category">{category}</span>
          <p className="card-pr-objective">{mainObjective}</p>
        </div>

        <div className="card-pr-section-properties">
          <div className="icon-text-element-pr">
            <img src={dateImg} alt="" />
            <p>
              {new Date(startDate).toLocaleDateString()} <span>Start Date</span>
            </p>
          </div>
          <div className="icon-text-element-pr">
            <img src={teamMembersImg} alt="" />
            <p>
              {totalMembers} <span>Members</span>
            </p>
          </div>
        </div>
      </Link>

      <hr className="hr-thin-light" />

      {/* Sección inferior con la información del propietario */}
      <div className="card-pr-section-bottom">
        <div className="card-pr-section-profile">
          <img
            src={owner?.profilePicture} // Mostrar la imagen del owner
            alt={owner?.username}
            className="card-profile-img"
          />
{/*           <p><span>Leaded by </span>{props.owner.username.charAt(0).toUpperCase() + props.owner.username.slice(1)}</p> */}
          <p>
            <span>Leaded by </span>
            {owner?.username}
          </p>
        </div>

        {/* Botón Apply deshabilitado si ya es miembro o es su propio proyecto */}
        <button className="button-small-blue" disabled={isApplyDisabled}>
          <div className="icon-text-element">
            <img
              src={isApplyDisabled ? disabledApplyImg : applyImg}
              alt=""
              className="icon"
            />
            <p>Apply</p>
          </div>
        </button>
      </div>
    </div>
  );
}

export default CardProject;
