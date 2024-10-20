import "../CSS/detailsUser.css";

import { useState, useEffect, useContext } from "react";
import service from "../services/config.js";
import { Link, useParams } from "react-router-dom";
import CardProject from "../components/CardProject.jsx";
import CardEvent from "../components/CardEvent.jsx";
import { AuthContext } from "../context/auth.context.jsx";

import addImg from "../assets/icons/add.svg";
import edtitImg from "../assets/icons/edit.svg";
import messageImg from "../assets/icons/message.svg";

function DetailsUser() {
  const [user, setUser] = useState(null); // Cambié a null para evitar errores con valores vacíos
  const [allUserProjects, setAllUserProjects] = useState([]);
  const [allUserEvents, setAllUserEvents] = useState([]);
  const [showOwnerProjects, setShowOwnerProjects] = useState(true); // Controla si se muestran proyectos como owner
  const [showEventType, setShowEventType] = useState("owner"); // Controla la pestaña activa de eventos
  const params = useParams();

  const { isLoggedIn, loggedUserId } = useContext(AuthContext);

  // useEffect para cargar la data del usuario, proyectos y eventos
  useEffect(() => {
    getData();
  }, []);

  // Función para obtener los datos del usuario, sus proyectos y eventos
  const getData = async () => {
    try {
      const userResponse = await service.get(`/user/${params.userid}`);
      setUser(userResponse.data);

      const projectResponse = await service.get(
        `/project/user/${params.userid}`
      );
      setAllUserProjects(projectResponse.data);

      const eventResponse = await service.get(`/event/user/${params.userid}`);
      setAllUserEvents(eventResponse.data);
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };

  if (!user || !allUserProjects || !allUserEvents) {
    return <h3>...loading</h3>;
  }

  // Filtra proyectos donde el usuario es owner
  const ownerProjects = allUserProjects.filter(
    (project) => String(project.owner._id || project.owner) === String(user._id)
  );

  // Filtra proyectos donde el usuario es collaborator
  const collaboratorProjects = allUserProjects.filter((project) =>
    project.teamMembers.includes(user._id)
  );

  // Filtros de eventos según el rol del usuario
  const ownerEvents = allUserEvents.filter(
    (event) => String(event.owner._id || event.owner) === String(user._id)
  );

  const lecturerEvents = allUserEvents.filter((event) =>
    event.lecturer.some((lecturer) => String(lecturer) === String(user._id))
  );

  const attendeeEvents = allUserEvents.filter((event) =>
    event.atendees.some((attendee) => String(attendee) === String(user._id))
  );

  // Función que devuelve los eventos filtrados según la pestaña seleccionada
  const getFilteredEvents = () => {
    if (showEventType === "owner") return ownerEvents;
    if (showEventType === "lecturer") return lecturerEvents;
    return attendeeEvents;
  };

  // Determinar si es el propio perfil logueado
  const isOwnProfile = isLoggedIn && loggedUserId === user._id;

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

    return isOwner || isLecturer || isAttendee; // Deshabilitar si es owner, lecturer o attendee
  };

  return (
    <div className="container-page">
      <div className="container-main-content">
        <section>
          <p>Detail User</p>
          <img src={user.profilePicture} alt="User Profile" />
          <p>{user.username}</p>
          <p>BIO: {user.bio}</p>
          <p>Tags: {user.skills}</p>

          {/* Mostrar botón condicionalmente */}
          {isOwnProfile ? (
            <Link to="/profile/edit">
            <button className="button-large-yellow">
              <div className="icon-text-element">
                <img src={edtitImg} alt="Edit" />
                <p>Edit Profile</p>
              </div>
            </button>
          </Link>
          ) : (
            
            <button className="button-large-yellow">
              <div className="icon-text-element">
                <img src={messageImg} alt="" />
                <p>Send Message</p>
              </div>
            </button>

          )}
        </section>

        <section>
          <p>Projects</p>
          {/* Selector de owner y collaborator */}
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
            {showOwnerProjects ? (
              <>
                {ownerProjects.length > 0 ? (
                  ownerProjects.map((eachProject) => (
                    <CardProject
                      key={eachProject._id}
                      {...eachProject}
                      isOwnProfile={isOwnProfile}
                    />
                  ))
                ) : (
                  <div className="empty-section">
                    <div className="empty-section-content">
                      <p>
                        {isOwnProfile
                          ? "It seems you haven't created any projects yet."
                          : "This user is not the owner of any projects."}
                      </p>
                    </div>
                  </div>
                )}
                {/* Div separado para el botón "Add Project" */}
                {isOwnProfile && (
                  <div className="add-project-container">
                    <button className="button-large-blue">
                      <div className="icon-text-element">
                        <img src={addImg} alt="" />
                        <Link to="/newproject">
                        <p>Add Project</p>
                        </Link>
                      </div>
                    </button>
                  </div>
                )}
              </>
            ) : collaboratorProjects.length > 0 ? (
              collaboratorProjects.map((eachProject) => (
                <CardProject
                  key={eachProject._id}
                  {...eachProject}
                  isOwnProfile={false}
                />
              ))
            ) : (
              <div className="empty-section">
                <div className="empty-section-content">
                  <p>
                    {isOwnProfile
                      ? "It seems you are not collaborating on any projects yet."
                      : "This user is not collaborating on any projects."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section>
          <p>Event list</p>
          {/* Selector de owner, lecturer, attendee */}
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
            {showEventType === "owner" ? (
              <>
                {ownerEvents.length > 0 ? (
                  ownerEvents.map((eachEvent) => (
                    <CardEvent
                      key={eachEvent._id}
                      {...eachEvent}
                      isOwnProfile={isOwnProfile}
                    />
                  ))
                ) : (
                  <div className="empty-section">
                    <div className="empty-section-content">
                      <p>
                        {isOwnProfile
                          ? "It seems you haven't created any events yet."
                          : "This user is not the owner of any events."}
                      </p>
                    </div>
                  </div>
                )}
                {/* Div separado para el botón "Add Event" */}
                {isOwnProfile && (
                  <div className="add-event-container">
                    <button className="button-large-blue">
                      <div className="icon-text-element">
                        <img src={addImg} alt="" />
                        <Link to="/newevent">
                        <p>Add Event</p>
                        </Link>
                      </div>
                    </button>
                  </div>
                )}
              </>
            ) : showEventType === "lecturer" ? (
              lecturerEvents.length > 0 ? (
                lecturerEvents.map((eachEvent) => (
                  <CardEvent
                    key={eachEvent._id}
                    {...eachEvent}
                    isOwnProfile={false}
                  />
                ))
              ) : (
                <div className="empty-section">
                  <div className="empty-section-content">
                    <p>
                      {isOwnProfile
                        ? "It seems you haven't lectured at any events yet."
                        : "This user hasn't lectured at any events."}
                    </p>
                  </div>
                </div>
              )
            ) : attendeeEvents.length > 0 ? (
              attendeeEvents.map((eachEvent) => (
                <CardEvent
                  key={eachEvent._id}
                  {...eachEvent}
                  isOwnProfile={false}
                />
              ))
            ) : (
              <div className="empty-section">
                <div className="empty-section-content">
                  <p>
                    {isOwnProfile
                      ? "It seems you haven't attended any events yet."
                      : "This user hasn't attended any events."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DetailsUser;
