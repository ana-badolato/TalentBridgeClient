import "../App.css";
import "../CSS/cardEvent.css";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context.jsx";
import service from "../services/config.js";

import deleteImg from "../assets/icons/delete.svg";
import editImg from "../assets/icons/edit.svg";
import evDateLightImg from "../assets/icons/evDateLight.svg";
import locationLightImg from "../assets/icons/locationLight.svg";
import NotificationModal from "../Modals/NotificationModal.jsx";
import { FadeLoader } from "react-spinners";

function CardEvent({
  _id,
  posterImage,
  name,
  owner,
  mainObjective,
  date,
  address,
  atendees,
  capacity,
  capacityCounter,
  isOwnProfile,
  lecturer,
}) {
  const { isLoggedIn, loggedUserId } = useContext(AuthContext);
  const [eventData, setEventData] = useState({
    posterImage,
    name,
    owner,
    mainObjective,
    date,
    address,
    atendees,
    capacity,
    capacityCounter,
    lecturer,
  });
  const [loading, setLoading] = useState(!name);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isJoinDisabled, setIsJoinDisabled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!name && _id) {
      const fetchEventData = async () => {
        try {
          const response = await service.get(`/event/${_id}`);
          setEventData(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching event data:", error);
          setLoading(false);
          navigate("/error");
        }
      };
      fetchEventData();
    }
  }, [name, _id]);

  useEffect(() => {
    const isOwner =
      isLoggedIn && String(loggedUserId) === String(eventData.owner?._id);
    const isAlreadyAttendee = eventData.atendees?.some(
      (atendeeId) => String(atendeeId) === String(loggedUserId)
    );
    const isLecturer = eventData.lecturer?.some(
      (lecturerId) => String(lecturerId) === String(loggedUserId)
    );

    setIsJoinDisabled(
      isOwnProfile ||
        isAlreadyAttendee ||
        isLecturer ||
        isOwner ||
        eventData.capacityCounter >= eventData.capacity
    );
  }, [eventData, loggedUserId, isOwnProfile, isLoggedIn]);

  if (loading) {
    return (
      <>
        <h4>...loading</h4>
        <FadeLoader color="#FFBE1A" />
      </>
    );
  }

  const {
    posterImage: eventImage,
    name: eventName,
    owner: eventOwner,
    mainObjective: eventObjective,
    date: eventDate,
    address: eventAddress,
    atendees: eventAtendees,
    lecturer: eventLecturer,
    capacity: eventCapacity,
    capacityCounter: eventCapacityCounter,
  } = eventData;

  const handleJoinClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmJoin = async () => {
    try {
      await service.put(`/event/${_id}/join`, {
        atendeeId: loggedUserId,
      });

      await service.patch(`/event/${_id}/incrementcapacitycounter`);

      await service.post("/notification", {
        from: loggedUserId,
        to: eventOwner._id,
        event: _id,
        message: `${loggedUserId} is attending to the event: ${eventName}`,
        type: "info",
      });

      setIsSuccess(true);
      setIsJoinDisabled(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsModalOpen(false);
      }, 1500);
    } catch (error) {
      console.error("Error al unirse al evento", error);
      navigate("/error");
    }
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await service.delete(`/event/${_id}`);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsDeleteModalOpen(false);
        navigate("/user/profile");
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error eliminando el evento", error);
      navigate("/error");
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="card-event">
      <div className="card-event-content">
        <Link to={`/event/${_id}`}>
          <img src={eventImage} alt={eventName} className="card-event-image" />
          {isOwnProfile && eventOwner && (
            <div className="card-ev-section-buttons">
              <Link to={`/editevent/${_id}`}>
                <button className="card-ev-button">
                  <img src={editImg} alt="Edit" />
                  <p>Edit</p>
                </button>
              </Link>
              <button className="card-ev-button" onClick={handleDeleteClick}>
                <img src={deleteImg} alt="Delete" />
                <p>Delete</p>
              </button>
            </div>
          )}
          <div className="card-overlay">
            <div className="card-ev-content-overlay">
              <h4 className="card-ev-title-overlay">{eventName}</h4>
              <p className="card-ev-objective-overlay">{eventObjective}</p>
              <div className="card-ev-properties">
                <div className="icon-text-element">
                  <img src={evDateLightImg} alt="" />
                  <p>{new Date(eventDate).toLocaleDateString()}</p>
                </div>
                <div className="icon-text-element">
                  <img src={locationLightImg} alt="" />
                  <p className="card-ev-address-overlay">{eventAddress}</p>
                </div>
              </div>
              <div className="card-ev-bottom">
                <div className="card-ev-section-profile">
                  <img
                    src={eventOwner?.profilePicture}
                    alt={eventOwner?.username}
                    className="card-ev-profile-img"
                  />
                  <p>
                    {" "}
                    <span>Created by </span>
                    {eventOwner?.username}
                  </p>
                </div>
                <hr className="hr-thin-light-yellow" />
              </div>
            </div>
          </div>
        </Link>

        <button
          className="button-small-yellow"
          disabled={isJoinDisabled}
          onClick={handleJoinClick}
        >
          {isSuccess ? "Unido" : "Join"}
        </button>
      </div>

      <NotificationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmJoin}
        message={`¿Quieres unirte al evento ${eventName}?`}
        successMessage={isSuccess ? "Te has unido con éxito al evento" : null}
      />

      <NotificationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        message={`¿Estás seguro de que quieres eliminar el evento ${eventName}?`}
        successMessage={isSuccess ? "Evento eliminado con éxito!" : null}
      />
    </div>
  );
}

export default CardEvent;
