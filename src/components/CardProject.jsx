import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context.jsx"; // Importar el contexto de autenticación
import service from "../services/config.js"; // Importar el servicio para hacer la solicitud de datos
import "../App.css";
import "../CSS/cardProject.css";

function CardProject(props) {
  const { isLoggedIn, loggedUserId } = useContext(AuthContext);
  const [projectData, setProjectData] = useState(props); // Si los datos son pasados, los usamos directamente
  const [loading, setLoading] = useState(!props.title); // Si no hay datos, los cargamos

  // Si no se pasaron datos, los solicitamos usando projectId
  useEffect(() => {
    if (!props.title) {
      const fetchProjectData = async () => {
        try {
          const response = await service.get(`/project/${props.projectId}`);
          setProjectData(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching project data:", error);
          setLoading(false);
        }
      };
      fetchProjectData();
    }
  }, [props.title, props.projectId]);

  if (loading) return <p>Loading project...</p>;

  const { owner, teamMembers, title, image, startDate, description, category, _id } = projectData;

  // Verificar si el usuario es el owner
  const isOwner = isLoggedIn && String(loggedUserId) === String(owner._id);

  // Verificar si el usuario ya es miembro del equipo
  const isTeamMember = teamMembers.some((member) => String(member._id || member) === String(loggedUserId));

  // Condición para deshabilitar el botón:
  const isApplyDisabled = isOwner || isTeamMember;

  return (
    <div className="card-pr-container">
      <Link to={`/project/${_id}`}>
        {/* Imagen y botones de editar/eliminar */}
        <div className="card-pr-section-img-buttons">
          <img src={image} alt={title} className="card-pr-img" />
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
          <h4 className="card-pr-title">{title}</h4>
          <span className="card-pr-category">{category}</span>
          <p className="card-pr-description">{description}</p>
        </div>

        <div className="card-pr-section-properties">
          <div className="icon-text-element">
            <p>{new Date(startDate).toLocaleDateString()}</p>
          </div>
        </div>
      </Link>

      <hr className="hr-thin-light" />

      {/* Sección inferior con la información del propietario */}
      <div className="card-pr-section-bottom">
        <div className="card-pr-section-profile">
          <img
            src={owner.profilePicture} // Mostrar la imagen del owner
            alt={owner.username}
            className="card-profile-img"
          />
          <p>
            <span>Leaded by </span>{owner.username}
          </p>
        </div>

        {/* Botón Apply deshabilitado si ya es miembro o es su propio proyecto */}
        <button className="button-small-blue" disabled={isApplyDisabled}>
          <p>Apply</p>
        </button>
      </div>
    </div>
  );
}

export default CardProject;
