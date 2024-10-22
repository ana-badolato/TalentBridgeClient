import "../App.css";
import "../CSS/cardEvent.css";

import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context.jsx";
import service from "../services/config.js"; // Importar el servicio para hacer la llamada API

import deleteImg from "../assets/icons/delete.svg";
import editImg from "../assets/icons/edit.svg";
import evDateLightImg from "../assets/icons/evDateLight.svg";
import locationLightImg from "../assets/icons/locationLight.svg";
import NotificationModal from "../Modals/NotificationModal.jsx"; // Modal para la confirmación

function CardEvent({
  _id,
  posterImage,
  name,
  owner,
  mainObjective,
  date,
  address,
  atendees, // Manteniendo "atendees"
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
    atendees, // Aquí también "atendees"
    lecturer,
  });
  const [loading, setLoading] = useState(!name);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Estado para mostrar mensaje de éxito
  const [isJoinDisabled, setIsJoinDisabled] = useState(false); // Estado para deshabilitar el botón Join

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
        }
      };
      fetchEventData();
    }
  }, [name, _id]);

  useEffect(() => {
    // Lógica para deshabilitar el botón Join si el usuario ya es miembro
    const isOwner = isLoggedIn && String(loggedUserId) === String(eventData.owner?._id);
    const isAlreadyAttendee = eventData.atendees?.some(
      (atendeeId) => String(atendeeId) === String(loggedUserId)
    );
    const isLecturer = eventData.lecturer?.some(
      (lecturerId) => String(lecturerId) === String(loggedUserId)
    );

    setIsJoinDisabled(isOwnProfile || isAlreadyAttendee || isLecturer || isOwner);
  }, [eventData, loggedUserId, isOwnProfile, isLoggedIn]);

  if (loading) return <p>Loading event...</p>;

  const {
    posterImage: eventImage,
    name: eventName,
    owner: eventOwner,
    mainObjective: eventObjective,
    date: eventDate,
    address: eventAddress,
    atendees: eventAtendees, // Aquí también "atendees"
    lecturer: eventLecturer,
  } = eventData;

  // Función para manejar la solicitud de unirse al evento
  const handleJoinClick = () => {
    setIsModalOpen(true); // Mostrar el modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Cerrar el modal
  };

  const handleConfirmJoin = async () => {
    try {
      // Agregar al usuario como asistente del evento
      await service.put(`/event/${_id}/join`, {
        atendeeId: loggedUserId, // Manteniendo "atendeeId"
      });

      // Enviar una notificación informativa al owner del evento
      await service.post("/notification", {
        from: loggedUserId, // Usuario que se une
        to: eventOwner._id, // Owner del evento
        event: _id, // ID del evento
        message: `El usuario ${loggedUserId} se ha unido al evento ${eventName}`,
        type: "info", // Notificación de tipo informativa
      });

      // Mostrar mensaje de éxito por 1.5 segundos
      setShowSuccessMessage(true);
      setIsJoinDisabled(true); // Deshabilitar el botón Join
      setTimeout(() => {
        setShowSuccessMessage(false); // Ocultar el mensaje después de 1.5 segundos
        setIsModalOpen(false); // Cerrar el modal
      }, 1500);

    } catch (error) {
      console.error("Error al unirse al evento", error);
    }
  };

  return (
    <div className="card-event">
      <div className="card-event-content">
        <Link to={`/event/${_id}`}>
          <img src={eventImage} alt={eventName} className="card-event-image" />
          {isOwnProfile && eventOwner && (
            <div className="card-ev-section-buttons">
              <button className="card-ev-button">
                <img src={editImg} alt="Edit" />
                <p>Edit</p>
              </button>
              <button className="card-ev-button">
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
        {/* Botón de unirse */}
        <button
          className="button-small-yellow"
          disabled={isJoinDisabled} // Botón deshabilitado
          onClick={handleJoinClick}
        >
          {showSuccessMessage ? "Unido" : "Join"} {/* Mostrar mensaje si ya se unió */}
        </button>
      </div>

      {/* Modal de confirmación */}
      <NotificationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmJoin}
        message={`¿Quieres unirte al evento ${eventName}?`}
      />
    </div>
  );
}

export default CardEvent;
