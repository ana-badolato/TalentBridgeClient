import "../CSS/detailsEvent.css";
import "../CSS/cardUser.css";
import { useState, useEffect, useContext } from "react";
import service from "../services/config.js";
import { useParams, Link, useNavigate } from "react-router-dom";
import CardProject from "../components/CardProject.jsx";
import CardUserSmall from "../components/CardUserSmall.jsx";
import { FadeLoader } from "react-spinners";
import NotificationModal from "../Modals/NotificationModal.jsx";
import applyImg from "../assets/icons/apply.svg";

import evDateImg from "../assets/icons/evDate.svg";
import locationImg from "../assets/icons/location.svg";
import { AuthContext } from "../context/auth.context.jsx";

function DetailsEvent() {
  const navigate = useNavigate();
  const { eventid } = useParams();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isJoinDisabled, setIsJoinDisabled] = useState(false);
  const { isLoggedIn, loggedUserId } = useContext(AuthContext);

  useEffect(() => {
    getData();
  }, [eventid]);

  const getData = async () => {
    try {
      const response = await service.get(`/event/${eventid}`);
      setEventData(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching event data:", error);
      setLoading(false);
      navigate("/error");
    }
  };

  useEffect(() => {
    if (eventData) {
      const isOwner =
        isLoggedIn && String(loggedUserId) === String(eventData.owner?._id);
      const isAlreadyAttendee = eventData.atendees?.some(
        (atendeeId) => String(atendeeId) === String(loggedUserId)
      );

      setIsJoinDisabled(
        isOwner ||
          isAlreadyAttendee ||
          eventData.capacityCounter >= eventData.capacity
      );
    }
  }, [eventData, loggedUserId, isLoggedIn]);

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
      await service.put(`/event/${eventid}/join`, {
        atendeeId: loggedUserId,
      });

      await service.patch(`/event/${eventid}/incrementcapacitycounter`);

      await service.post("/notification", {
        from: loggedUserId,
        to: eventData.owner._id,
        event: eventid,
        message: `${loggedUserId} is attending to the event: ${eventData.name}`,
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

  if (loading) {
    return (
      <>
        <h4>...loading</h4>
        <FadeLoader color="#FFBE1A" />
      </>
    );
  }

  if (!eventData) {
    return <p>Error: No event data found</p>;
  }

  return (
    <div className="container-page">
      <div className="container-main-content">
        <img src={eventData.posterImage} alt="" className="project-img" />

        <div className="details-project-main">
          <section className="pr-details-left">
            <p className="details-section">{eventData.name}</p>
            <p className="main-objective" style={{ marginTop: "-16px" }}>
              {eventData.mainObjective}
            </p>

            <div className="card-ev-properties" style={{ marginTop: "8px" }}>
              <div className="icon-text-element">
                <img src={evDateImg} alt="" />
                <p>
                  {new Date(eventData.date).toLocaleDateString()}{" "}
                  <span> | </span>
                  {eventData.time}
                </p>
              </div>
              <p>|</p>
              <div className="icon-text-element">
                <img src={locationImg} alt="" />
                <p className="card-ev-address-overlay">{eventData.address}</p>
              </div>
              <p>|</p>
              <p style={{ fontWeight: "600" }}>
                Capacity{" "}
                <span style={{ marginLeft: "8px", fontWeight: "400" }}>
                  {" "}
                  {eventData.capacityCounter} / {eventData.capacity}
                </span>
              </p>
              <p>|</p>
              <p>{eventData.price === 0 ? "Free" : `$${eventData.price}`}</p>
            </div>

            <p className="tag-xl" style={{ marginBottom: "8px" }}>
              {eventData.category}
            </p>
            <p style={{ marginBottom: "8px", fontSize: "18px" }}>
              {eventData.description}
            </p>

            <button
              className="apply-button"
              disabled={isJoinDisabled}
              onClick={handleJoinClick}
            >
              <img src={applyImg} alt="" />
              <p>{isSuccess ? "Unido" : "Join"}</p>
            </button>
          </section>

          <section className="pr-details-right" style={{ marginTop: "32px" }}>
            {eventData.relatedProjects && (
              <CardProject {...eventData.relatedProjects} />
            )}
          </section>
        </div>

        <div>
          <h3 className="details-section">Lecturer</h3>
        </div>
        <div className="project-people">
          {eventData.owner && (
            <div
              className="owner-container"
              style={{ border: "2px solid #ffbe1a", borderRadius: "10px" }}
            >
              <CardUserSmall
                profilePicture={eventData.owner.profilePicture}
                username={eventData.owner.username}
                bio={eventData.owner.bio}
                className="owner-card"
              />
            </div>
          )}
        </div>
      </div>

      <NotificationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmJoin}
        message={`¿Quieres unirte al evento ${eventData.name}?`}
        successMessage={isSuccess ? "Te has unido con éxito al evento" : null}
      />
    </div>
  );
}

export default DetailsEvent;
