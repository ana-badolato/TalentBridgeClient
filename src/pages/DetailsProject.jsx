import { useEffect, useState, useContext } from "react";
import service from "../services/config";
import { useNavigate, useParams } from "react-router-dom";
import CardUserSmall from "../components/CardUserSmall";
import CardProject from "../components/CardProject";
import CardEventSmall from "../components/CardEventSmall";
import { AuthContext } from "../context/auth.context.jsx";
import "../App.css";
import "../CSS/detailsProject.css";
// images:
import dateImg from "../assets/icons/date.svg";
import applyImg from "../assets/icons/apply.svg";
import disabledApplyImg from "../assets/icons/disabledApply.svg";
import teamMembersImg from "../assets/icons/teamMembers.svg";
import NotificationModal from "../Modals/NotificationModal.jsx"; // Importa el modal de notificación
import { FadeLoader } from "react-spinners";

function DetailsProject() {
  const navigate = useNavigate();
  const params = useParams();
  const { isLoggedIn, loggedUserId } = useContext(AuthContext); // Acceso al contexto de autenticación
  const [projectDetails, setProjectDetails] = useState({});
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [isApplied, setIsApplied] = useState(false); // Estado para gestionar si ya ha aplicado
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
  const [isSuccess, setIsSuccess] = useState(false); // Estado para éxito

  useEffect(() => {
    getData();
  }, [params.projectid]);

  const getData = async () => {
    try {
      const response = await service.get(`/project/${params.projectid}`);
      setProjectDetails(response.data);
      getRelatedProjects(response.data.category, response.data._id); // Pasa la categoria del proyecto
      const events = await service.get(`/project/${params.projectid}/event`);
      setRelatedEvents(events.data);
    } catch (error) {
      console.log(error);
      navigate("/error");
    }
  };

  const getRelatedProjects = async (category) => {
    try {
      const response = await service.get(`/project/`);
      const filteredProjects = response.data.filter(
        (eachProject) => eachProject.category === category && eachProject._id !== params.projectid
      );
      setRelatedProjects(filteredProjects);
    } catch (error) {
      console.log(error);
      navigate("/error");
    }
  };

  // Comprobar si el usuario es el propietario o miembro del equipo
  const isOwner = isLoggedIn && String(loggedUserId) === String(projectDetails?.owner?._id);
  const isTeamMember = projectDetails?.teamMembers?.some(
    (member) => String(member._id || member) === String(loggedUserId)
  );

  const isApplyDisabled = isOwner || isTeamMember || isApplied;

  const handleApplyClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setIsModalOpen(true); // Abrir el modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Cerrar el modal
  };

  const handleConfirmApply = async () => {
    try {
      await service.post("/notification", {
        from: loggedUserId, // Usuario logueado
        to: projectDetails.owner._id, // Propietario del proyecto
        project: projectDetails._id, // ID del proyecto
        message: `El usuario ${loggedUserId} quiere unirse al proyecto ${projectDetails.title}`, // Mensaje de notificación
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
      navigate("/error");
    }
  };

  const totalMembers = projectDetails.teamMembers ? projectDetails.teamMembers.length + 1 : 1;

  if (!projectDetails) {
    return (
      <>
        <h4>...loading</h4>
        <FadeLoader color="#FFBE1A" />
      </>
    );
  }

  return (
    <div className="container-page">
      <div className="container-main-content">
        <img src={projectDetails.image} alt="project-image" className="project-img" />

        <div className="details-project-main">
          <section className="pr-details-left">
            <p className="index-title" style={{ marginTop: "16px" }}>{projectDetails.title}</p>
            <p className="main-objective">{projectDetails.mainObjective}</p>
            <p className="tag-xl" style={{ color: "#110F34" }}>{projectDetails.category}</p>

            <div className="card-pr-section-properties">
              <div className="icon-text-element-pr">
                <img src={dateImg} alt="" />
                <p>
                  {new Date(projectDetails.startDate).toLocaleDateString()} <span>Start Date</span>
                </p>
              </div>
              <div className="icon-text-element-pr">
                <img src={teamMembersImg} alt="" />
                <p>
                  {totalMembers} <span>Members</span>
                </p>
              </div>
            </div>
            <p className="description">{projectDetails.description}</p>

            <button
              className="apply-button"
              disabled={isApplyDisabled} // Deshabilitar si ya ha aplicado
              onClick={handleApplyClick}
            >
              <img src={isApplyDisabled ? disabledApplyImg : applyImg} alt="Apply" />
              <p>{isApplied ? "Applied" : "Apply"}</p>
            </button>
          </section>

          <section className="pr-details-right">
            <div>
              <h3 className="details-section">Events related with this project</h3>
            </div>

            <div>
              {relatedEvents.length > 0 ? (
                relatedEvents.map((eachEvent) => (
                  <CardEventSmall key={eachEvent._id} {...eachEvent} />
                ))
              ) : (
                <p>No events scheduled yet</p>
              )}
            </div>
          </section>
        </div>

        <NotificationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmApply}
          message={`¿Quieres enviar la solicitud para unirte al proyecto ${projectDetails.title}?`}
          successMessage={isSuccess ? "Solicitud enviada con éxito!" : null}
        />

        <section>
          <div>
            <h3 className="details-section">Meet our Team</h3>
          </div>

          <div className="project-people">
            {projectDetails.owner && (
              <div className="owner-container" style={{ border: "2px solid #ffbe1a", borderRadius: "10px" }}>
                <CardUserSmall
                  profilePicture={projectDetails.owner.profilePicture}
                  username={projectDetails.owner.username}
                  bio={projectDetails.owner.bio}
                  className="owner-card"
                />
              </div>
            )}
            {projectDetails.teamMembers && projectDetails.teamMembers.length > 0 ? (
              projectDetails.teamMembers.map((eachMember) => (
                <CardUserSmall key={eachMember._id} {...eachMember} />
              ))
            ) : (
              <p>No team members assigned yet.</p>
            )}
          </div>
        </section>

        <section>
          <div>
            <h3 className="details-section">Projects you might also like</h3>
          </div>
          <div className="project-list">
            {relatedProjects.length > 0 ? (
              relatedProjects.map((eachProject, i) => (
                <CardProject key={eachProject._id} {...eachProject} />
              ))
            ) : (
              <p>No related projects found</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DetailsProject;
