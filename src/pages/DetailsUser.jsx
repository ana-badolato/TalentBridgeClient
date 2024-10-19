import { useState, useEffect, useContext } from "react";
import service from "../services/config.js";
import { useParams } from "react-router-dom";
import CardProject from "../components/CardProject.jsx";
import CardEvent from "../components/CardEvent.jsx";
import { AuthContext } from "../context/auth.context.jsx"; 
import "../CSS/detailsUser.css";

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

      const projectResponse = await service.get(`/project/user/${params.userid}`);
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
    const isOwner = String(event.owner._id || event.owner) === String(loggedUserId);
    const isLecturer = event.lecturer.some((lecturerId) => String(lecturerId) === String(loggedUserId));
    const isAttendee = event.atendees.some((attendeeId) => String(attendeeId) === String(loggedUserId));

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
            <button>
              <img src="" alt="" />
              <p>Edit Profile</p>
            </button>
          ) : (
            <button>
              <img src="" alt="" />
              <p>Send Message</p>
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

          <div className="project-list">
            {showOwnerProjects
              ? ownerProjects.map((eachProject) => (
                  <CardProject
                    key={eachProject._id}
                    {...eachProject}
                    isOwnProfile={isOwnProfile}
                  />
                ))
              : collaboratorProjects.map((eachProject) => (
                  <CardProject
                    key={eachProject._id}
                    {...eachProject}
                    isOwnProfile={false}
                  />
                ))}
          </div>
        </section>

        <section>
          <div>
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

            <div className="event-list">
              {getFilteredEvents().map((eachEvent) => (
                <CardEvent
                  key={eachEvent._id}
                  {...eachEvent}
                  isOwnProfile={isOwnProfile}
                  isJoinDisabled={isEventJoinDisabled(eachEvent)}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DetailsUser;
