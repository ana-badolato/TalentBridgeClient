import "../App.css";
import "../CSS/cardEvent.css";

import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context.jsx";
import service from "../services/config.js"; // Importar el servicio para hacer la llamada API

import deleteImg from "../assets/icons/delete.svg";
import editImg from "../assets/icons/edit.svg";
import evDateLightImg from "../assets/icons/evDateLight.svg";
import joinImg from "../assets/icons/join.svg";
import locationLightImg from "../assets/icons/locationLight.svg";

function CardEvent({
  eventId,
  posterImage,
  name,
  owner,
  mainObjective,
  date,
  address,
  attendees,
  isOwnProfile,
  isJoinDisabled,
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
    attendees,
    lecturer,
  });
  const [loading, setLoading] = useState(!name); // Si no se pasa el nombre, es que no tenemos datos y los cargamos

  useEffect(() => {
    if (!name && eventId) {
      // Si no hay datos y se pasa el eventId, hacemos la solicitud
      const fetchEventData = async () => {
        try {
          const response = await service.get(`/event/${eventId}`);
          setEventData(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching event data:", error);
          setLoading(false);
        }
      };
      fetchEventData();
    }
  }, [name, eventId]);

  if (loading) return <p>Loading event...</p>;

  const {
    posterImage: eventImage,
    name: eventName,
    owner: eventOwner,
    mainObjective: eventObjective,
    date: eventDate,
    address: eventAddress,
    attendees: eventAttendees,
    lecturer: eventLecturer,
  } = eventData;

  const isOwner = isLoggedIn && String(loggedUserId) === String(eventOwner?._id);

  const isAlreadyAttendee = eventAttendees?.some(
    (attendeeId) => String(attendeeId) === String(loggedUserId)
  );

  const isLecturer = eventLecturer?.some(
    (lecturerId) => String(lecturerId) === String(loggedUserId)
  );

  const isApplyDisabled =
    isJoinDisabled || isOwner || isAlreadyAttendee || isLecturer;

  return (
    <div className="card-event">
      <div className="card-event-content">
        <Link to={`/event/${eventId}`}>
          <img src={eventImage} alt={eventName} className="card-event-image" />
          {isOwnProfile && isOwner && (
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
                    alt=""
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
        <button disabled={isApplyDisabled} className="button-small-yellow">
          <p>Join</p>
        </button>
      </div>
    </div>
  );
}

export default CardEvent;
