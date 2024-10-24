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
import { FadeLoader } from "react-spinners";

function CardProject(props) {
  const { isLoggedIn, loggedUserId } = useContext(AuthContext);
  const [projectData, setProjectData] = useState(props);
  const [loading, setLoading] = useState(!props.title);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

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
          navigate("/error");
        }
      };
      fetchProjectData();
    }
  }, [props.title, params.projectid]);

  if (loading) {
    return (
      <>
        <h4>...loading</h4>
        <FadeLoader color="#FFBE1A" />
      </>
    );
  }

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

  const isApplyDisabled = isOwner || isTeamMember || isApplied;

  const handleApplyClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmApply = async () => {
    try {
      await service.post("/notification", {
        from: loggedUserId,
        to: owner._id,
        project: _id,
        message: `El usuario ${loggedUserId} quiere unirse al proyecto ${title}`,
        type: "action",
      });
      setIsApplied(true);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsModalOpen(false);
      }, 1500);
    } catch (error) {
      console.log("Error enviando la notificación", error);
      navigate("/error");
    }
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteModalOpen(true);
    console.log("abriendo modal eliminar");
  };

  const handleConfirmDelete = async () => {
    try {
      console.log("modal abierto eliminar");
      console.log("ID del proyecto que se va a eliminar:", _id);
      console.log("Intentando eliminar proyecto...");
      await service.delete(`/project/${_id}`);
      console.log("Proyecto eliminado con éxito");
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsDeleteModalOpen(false);
        navigate("/user/profile");
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.log("Error eliminando el proyecto", error);
      navigate("/error");
    }
  };

  const handleCloseDeleteModal = () => {
    console.log("cerramos modal eliminar");
    setIsDeleteModalOpen(false);
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
              <button
                className="card-pr-button"
                onClick={(e) => handleDeleteClick(e)}
              >
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
          disabled={isApplyDisabled}
          onClick={handleApplyClick}
        >
          <div className="icon-text-element">
            <img
              src={isApplyDisabled ? disabledApplyImg : applyImg}
              alt="Apply"
              className="icon"
            />
            <p>{isApplied ? "Applied" : "Apply"}</p>
          </div>
        </button>

        <NotificationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmApply}
          message={`¿Quieres enviar la solicitud para unirte al proyecto ${title}?`}
          successMessage={isSuccess ? "Solicitud enviada con éxito!" : null}
        />

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
