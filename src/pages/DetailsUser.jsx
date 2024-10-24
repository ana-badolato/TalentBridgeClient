import "../CSS/detailsUser.css";
import { useState, useEffect, useContext } from "react";
import service from "../services/config.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import CardProject from "../components/CardProject.jsx";
import CardEvent from "../components/CardEvent.jsx";
import { AuthContext } from "../context/auth.context.jsx";

import addImg from "../assets/icons/add.svg";
import edtitImg from "../assets/icons/edit.svg";
import messageImg from "../assets/icons/message.svg";
import { FadeLoader } from "react-spinners";

function DetailsUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [allUserProjects, setAllUserProjects] = useState([]);
  const [allUserEvents, setAllUserEvents] = useState([]);
  const [showOwnerProjects, setShowOwnerProjects] = useState(true);
  const [showEventType, setShowEventType] = useState("owner");

  const [projectPage, setProjectPage] = useState(1); 
  const projectsPerPage = 6;

  const [eventPage, setEventPage] = useState(1); 
  const eventsPerPage = 8;

  const params = useParams();
  const { isLoggedIn, loggedUserId } = useContext(AuthContext);

  useEffect(() => {
    getData();
  }, [params.username]);

  const getData = async () => {
    try {
      const userResponse = await service.get(
        `/user/profile/${params.username}`
      );
      setUser(userResponse.data);

      const projectResponse = await service.get(
        `/project/user/${params.username}/projects`
      );
      setAllUserProjects(projectResponse.data);

      const eventResponse = await service.get(
        `/event/user/${params.username}/events`
      );
      setAllUserEvents(eventResponse.data);
    } catch (error) {
      console.log("Error fetching user data:", error);
      navigate("/error");
    }
  };

  if (!user || !allUserProjects || !allUserEvents) {
    return (
      <>
        <h4>...loading</h4>
        <FadeLoader color="#FFBE1A" />
      </>
    );
  }

  // Filtrar proyectos donde el usuario es owner o collaborator
  const ownerProjects = allUserProjects.filter(
    (project) => String(project.owner._id || project.owner) === String(user._id)
  );
  const collaboratorProjects = allUserProjects.filter((project) =>
    project.teamMembers.includes(user._id)
  );

  // Filtros de eventos
  const ownerEvents = allUserEvents.filter(
    (event) => String(event.owner._id || event.owner) === String(user._id)
  );
  const lecturerEvents = allUserEvents.filter((event) =>
    event.lecturer.some((lecturer) => String(lecturer) === String(user._id))
  );
  const attendeeEvents = allUserEvents.filter((event) =>
    event.atendees.some((attendee) => String(attendee) === String(user._id))
  );

  const getFilteredEvents = () => {
    if (showEventType === "owner") return ownerEvents;
    if (showEventType === "lecturer") return lecturerEvents;
    return attendeeEvents;
  };

  //! eliminar
  const isOwnProfile = isLoggedIn && loggedUserId === user._id;

  // Paginación para proyectos
  const currentProjects = showOwnerProjects
    ? ownerProjects.slice(
        (projectPage - 1) * projectsPerPage,
        projectPage * projectsPerPage
      )
    : collaboratorProjects.slice(
        (projectPage - 1) * projectsPerPage,
        projectPage * projectsPerPage
      );

  const totalProjectPages = showOwnerProjects
    ? Math.ceil(ownerProjects.length / projectsPerPage)
    : Math.ceil(collaboratorProjects.length / projectsPerPage);

  const filteredEvents = getFilteredEvents();
  const currentEvents = filteredEvents.slice(
    (eventPage - 1) * eventsPerPage,
    eventPage * eventsPerPage
  );
  const totalEventPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Calcular si el usuario debe tener el botón "Join" deshabilitado
  const isEventJoinDisabled = (event) => {
    const isOwner =
      String(event.owner._id || event.owner) === String(loggedUserId);
    const isLecturer = event.lecturer.some(
      (lecturerId) => String(lecturerId) === String(loggedUserId)
    );
    const isAttendee = event.atendees.some(
      (attendeeId) => String(attendeeId) === String(loggedUserId)
    );
    return isOwner || isLecturer || isAttendee;
  };

  const goToNextProjectPage = () => {
    if (projectPage < totalProjectPages) setProjectPage(projectPage + 1);
  };

  const goToPreviousProjectPage = () => {
    if (projectPage > 1) setProjectPage(projectPage - 1);
  };

  const goToNextEventPage = () => {
    if (eventPage < totalEventPages) setEventPage(eventPage + 1);
  };

  const goToPreviousEventPage = () => {
    if (eventPage > 1) setEventPage(eventPage - 1);
  };

  return (
    <div className="container-page">
      <div className="container-main-content">
        {/* User Info */}
        <section className="card-profile">
          <div>
            <img
              src={user.profilePicture}
              className="profile-picture"
              alt="User Profile"
            />
          </div>

          <div className="infoButton">
            <div className="profile-info">
              <p style={{ fontSize: "35px"}}>{user.username}</p>
              <p className="profile-bio" style={{ fontStyle: "italic", padding: "10px"}}>
                {user.bio}
              </p>
              {user.skills.map((eachSkill) => (
                <p className="tag-skills">{eachSkill}</p>
              ))}
            </div>

            <button className="button-large-yellow" style={{ marginTop: "50px"}}>
              <div className="icon-text-element">
                <img src={messageImg} alt="" />
                <p>Send Message</p>
              </div>
            </button>
          </div>
        </section>

        {/* Projects Section */}
        <section>
          <h3 className="details-section">Projects</h3>
          <div className="tabs">
            <p
              className={showOwnerProjects ? "active-tab" : ""}
              onClick={() => setShowOwnerProjects(true)}
            >
              OWNER
            </p>
            <p>|</p>
            <p
              className={!showOwnerProjects ? "active-tab" : ""}
              onClick={() => setShowOwnerProjects(false)}
            >
              COLLABORATOR
            </p>
          </div>
          <hr />
          <div className="project-list">
            {currentProjects.map((eachProject) => (
              <CardProject key={eachProject._id} {...eachProject} />
            ))}

            {totalProjectPages > 1 && (
              <div className="pagination-controls">
                <button
                  onClick={goToPreviousProjectPage}
                  disabled={projectPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {projectPage} of {totalProjectPages}
                </span>
                <button
                  onClick={goToNextProjectPage}
                  disabled={projectPage === totalProjectPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Events Section */}
        <section>
          <h3 className="details-section">Events</h3>
          <div className="tabs">
            <p
              className={showEventType === "owner" ? "active-tab" : ""}
              onClick={() => setShowEventType("owner")}
            >
              OWNER
            </p>
            <p>|</p>
            <p
              className={showEventType === "lecturer" ? "active-tab" : ""}
              onClick={() => setShowEventType("lecturer")}
            >
              LECTURER
            </p>
            <p>|</p>
            <p
              className={showEventType === "attendee" ? "active-tab" : ""}
              onClick={() => setShowEventType("attendee")}
            >
              ATTENDEE
            </p>
          </div>
          <hr />
          <div className="event-list">
            {currentEvents.map((eachEvent) => (
              <CardEvent key={eachEvent._id} {...eachEvent} />
            ))}

            {totalEventPages > 1 && (
              <div className="pagination-controls">
                <button
                  onClick={goToPreviousEventPage}
                  disabled={eventPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {eventPage} of {totalEventPages}
                </span>
                <button
                  onClick={goToNextEventPage}
                  disabled={eventPage === totalEventPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DetailsUser;
