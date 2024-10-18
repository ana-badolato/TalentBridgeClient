import { useState, useEffect } from "react";
import service from "../services/config.js";
import { useParams } from "react-router-dom";
import CardProject from "../components/CardProject.jsx";
import CardEvent from "../components/CardEvent.jsx";

function DetailsUser() {
  const [user, setUser] = useState("");
  const [allUserProjects, setAllUserProjects] = useState([]);
  const [allUserEvents, setAllUserEvents] = useState([]);
  const [showOwnerProjects, setShowOwnerProjects] = useState(true); // Controla si se muestran proyectos como owner
  const [showEventType, setShowEventType] = useState("owner"); // Controla la pestaña activa de eventos

  const params = useParams();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await service.get(`/user/${params.userid}`);
      setUser(response.data);

      const responseProject = await service.get(
        `/project/user/${params.userid}`
      );
      setAllUserProjects(responseProject.data);

      const responseEvent = await service.get(`/event/user/${params.userid}`);
      setAllUserEvents(responseEvent.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (user === null || allUserProjects === null || allUserEvents === null) {
    return <h3>...loading</h3>;
    //! añadir efecto de carga
  }

  // Filtra proyectos donde el usuario es owner
  const ownerProjects = allUserProjects.filter((project) => {
    return project.owner === user._id || project.owner._id === user._id;
  });

  // Filtra proyectos donde el usuario es collaborator
  const collaboratorProjects = allUserProjects.filter((project) =>
    project.teamMembers.includes(user._id)
  );

  // Filtros de eventos según el rol del usuario

  // Comparación de IDs: Dado que el campo owner puede ser tanto un string (ID) como un objeto (con _id), es buena práctica usar String() para asegurar de que las comparaciones funcionen ok.


  const ownerEvents = allUserEvents.filter(
    (event) => String(event.owner) === String(user._id) || String(event.owner._id) === String(user._id)
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

  return (
    <div className="container-page">
      <div className="container-main-content">
        <section>
          <p>Detail User</p>
          <img src={user.profilePicture} alt="" />
          <p>{user.username}</p>
          <p>BIO: {user.bio}</p>
          <p>Tags: {user.skills}</p>

          <button>
            <img src="" alt="" />
            <p>Edit Profile</p>
          </button>

          <button>
            <img src="" alt="" />
            <p>Send Message</p>
          </button>
          {/*Revisar si va con link*/}
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
                    allUserProjects={ownerProjects}
                    {...eachProject}
                  />
                ))
              : collaboratorProjects.map((eachProject) => (
                  <CardProject
                    key={eachProject._id}
                    allUserProjects={collaboratorProjects}
                    {...eachProject}
                  />
                ))}
          </div>
        </section>

        <section>
          <div>
            <p>Event list</p>
            {/* Selector de owner, lecturer, atendee */}
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
                  allUserEvents={getFilteredEvents()}
                  {...eachEvent}
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
