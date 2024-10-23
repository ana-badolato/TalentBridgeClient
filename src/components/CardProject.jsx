import "../App.css";
import "../CSS/cardProject.css";

import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/auth.context.jsx";
import service from "../services/config.js";

import applyImg from "../assets/icons/apply.svg";
import disabledApplyImg from "../assets/icons/disabledApply.svg";
import deleteImg from "../assets/icons/delete.svg";
import editImg from "../assets/icons/edit.svg";
import dateImg from "../assets/icons/date.svg";
import teamMembersImg from "../assets/icons/teamMembers.svg";
import NotificationModal from "../Modals/NotificationModal.jsx";

function CardProject(props) {
  const { isLoggedIn, loggedUserId } = useContext(AuthContext);
  const [projectData, setProjectData] = useState(props);
  const [loading, setLoading] = useState(!props.title);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
  const [isSuccess, setIsSuccess] = useState(false); // Estado para éxito
  const [isApplied, setIsApplied] = useState(false); // Estado para gestionar si ya ha aplicado


  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const params = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    if (!props.title) {
      const fetchProjectData = async () => {
        try {
          const response = await service.get(`/project/${params.projectid}`);
          setProjectData(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching project data:", error);
          setLoading(false);
        }
      };
      fetchProjectData();
    }
  }, [props.title, params.projectid]);

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



  const isOwner = isLoggedIn && String(loggedUserId) === String(owner?._id);
  const isTeamMember = teamMembers.some(
    (member) => String(member._id || member) === String(loggedUserId)
  );

  // Deshabilitar el botón y cambiar el texto si el usuario ha aplicado
  const isApplyDisabled = isOwner || isTeamMember || isApplied;

  const handleApplyClick = () => {
    setIsModalOpen(true); // Abrir el modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Cerrar el modal
  };

  const handleConfirmApply = async () => {
    try {
        await service.post("/notification", {
            from: loggedUserId, // Usuario logueado
            to: owner._id, // Propietario del proyecto
            project: _id, // ID del proyecto
            message: `El usuario ${loggedUserId} quiere unirse al proyecto ${title}`, // Mensaje de notificación
            type: "action", // Tipo de notificación para acciones
        });
        setIsApplied(true); // Cambiar el estado a 'applied'
        setIsSuccess(true); // Mostrar mensaje de éxito
        setTimeout(() => {
            setIsSuccess(false); // Resetear el estado de éxito
            setIsModalOpen(false); // Cerrar el modal
        }, 1500); // Esperar 1.5 segundos antes de cerrar el modal
    } catch (error) {
        console.log("Error enviando la notificación", error);
    }
};

const handleDeleteClick = (e) => {
  e.preventDefault(); // Prevenir que se ejecute el comportamiento predeterminado del <Link>
  e.stopPropagation(); // Detener la propagación del evento al contenedor <Link>
  setIsDeleteModalOpen(true); // Abrir el modal de confirmación de eliminar
  console.log("abriendo modal eliminar");
};

const handleConfirmDelete = async () => {
  try {
    console.log("modal abierto eliminar")
    console.log("ID del proyecto que se va a eliminar:", _id); // Verificar si el ID es correcto
    console.log("Intentando eliminar proyecto..."); // Asegurarse de que el flujo sigue
    await service.delete(`/project/${_id}`); // Llama a la ruta DELETE
    console.log("Proyecto eliminado con éxito");
    setIsSuccess(true); // Mostrar mensaje de éxito
    setTimeout(() => {
      setIsSuccess(false);
      setIsDeleteModalOpen(false); // Cerrar el modal
      navigate("/user/profile"); 
      window.location.reload();
    }, 1500);
  } catch (error) {
    console.log("Error eliminando el proyecto", error);
  }
};

const handleCloseDeleteModal = () => {
  console.log("cerramos modal eliminar")
  setIsDeleteModalOpen(false); // Cerrar el modal de eliminación
};



  return (
    <div className="card-pr-container">
      <Link to={`/project/${_id}`}>
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
              <button className="card-pr-button" onClick={(e) => handleDeleteClick(e)}>
  <img src={deleteImg} alt="" />
  <p>Delete</p>
</button>

            </div>
          )}
        </div>

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
              {teamMembers.length + 1} <span>Members</span>
            </p>
          </div>
        </div>
      </Link>

      <hr className="hr-thin-light" />

      <div className="card-pr-section-bottom">
        <div className="card-pr-section-profile">
          <img
            src={owner?.profilePicture}
            alt={owner?.username}
            className="card-profile-img"
          />
          <p>
            <span>Leaded by </span>
            {owner?.username}
          </p>
        </div>

        <button
          className="button-small-blue"
          disabled={isApplyDisabled} // Deshabilitar si ya ha aplicado
          onClick={handleApplyClick}
        >
          <div className="icon-text-element">
            <img
              src={isApplyDisabled ? disabledApplyImg : applyImg}
              alt="Apply"
              className="icon"
            />
            <p>{isApplied ? "Applied" : "Apply"}</p> {/* Cambiar texto a "Applied" */}
          </div>
        </button>

        {/* Modal de confirmación */}
        <NotificationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmApply}
          message={`¿Quieres enviar la solicitud para unirte al proyecto ${title}?`}
          successMessage={isSuccess ? "Solicitud enviada con éxito!" : null} // Pasar mensaje de éxito
        />


        {/* Modal de confirmación para eliminar */}
        <NotificationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          message={`¿Estás seguro de que quieres eliminar el proyecto ${title}?`}
          successMessage={isSuccess ? "Proyecto eliminado con éxito!" : null}

          
        />
      </div>
    </div>
  );
}

export default CardProject;
