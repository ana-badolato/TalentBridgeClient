import { useEffect, useState } from "react";
import service from "../services/config";
import { Link, useParams } from "react-router-dom";
import CardUserSmall from "../components/CardUserSmall";
import CardProject from "../components/CardProject";

// images:
import dateImg from "../assets/icons/date.svg";
import teamMembersImg from "../assets/icons/teamMembers.svg";
import CardEventSmall from "../components/CardEventSmall";
import applyImg from "../assets/icons/apply.svg";

function DetailsProject() {
  const params = useParams();
  const [projectDetails, setProjectDetails] = useState({});

  //estado para guardar proyectos relacionados
  const [relatedProjects, setRelatedProjects] = useState([]);

  //estado para guardar eventos relacionados
  const [relatedEvents, setRelatedEvents] = useState([]);

  useEffect(() => {
    getData();
  }, [params.projectid]);

  const getData = async () => {
    try {
      // detalles del proyecto
      const response = await service.get(`/project/${params.projectid}`);
      setProjectDetails(response.data);
      getRelatedProjects(response.data.category, response.data._id); //pasa la categoria del proyecto

      //eventos relacionados con el proyecto
      const events = await service.get(`/project/${params.projectid}/event`);
      console.log(events.data);
      setRelatedEvents(events.data);
    } catch (error) {
      console.log(error);
    }
  };

  //aqui todos los proyectos y se filtran por categoria. Misma categoria pero diferente id OK
  const getRelatedProjects = async (category) => {
    try {
      const response = await service.get(`/project/`);
      const filteredProjects = response.data.filter(
        (eachProject) =>
          eachProject.category === category &&
          eachProject._id !== params.projectid
      );
      setRelatedProjects(filteredProjects);
    } catch (error) {
      console.log(error);
    }
  };

  //por si teamMembers todavia no llega de la api, que no de problemas
  const totalMembers = projectDetails.teamMembers
    ? projectDetails.teamMembers.length + 1
    : 1;

  return (
    <div>
      <img
        src={projectDetails.image}
        alt="project-image"
        style={{ width: "200px" }}
      />
      <p>{projectDetails.title}</p>
      <p>{projectDetails.mainObjective}</p>
      <p>{projectDetails.category}</p>

      <div className="card-pr-section-properties">
        <div className="icon-text-element-pr">
          <img src={dateImg} alt="" />
          <p>
            {new Date(projectDetails.startDate).toLocaleDateString()}{" "}
            <span>Start Date</span>
          </p>
        </div>
        <div className="icon-text-element-pr">
          <img src={teamMembersImg} alt="" />
          <p>
            {totalMembers} <span>Members</span>
          </p>
        </div>
      </div>
      <p>{projectDetails.description}</p>

      <button className="button-small-blue">
        <div className="icon-text-element">
          <img src={applyImg} alt="" className="icon" />
          <p>Apply</p>
        </div>
      </button>

      <h3>Meet our Team</h3>
      {projectDetails.teamMembers && projectDetails.teamMembers.length > 0 ? (
        projectDetails.teamMembers.map((eachMember) => {
          return (
            <Link to={`/user/profile/${eachMember.username}`}>
            <CardUserSmall key={eachMember._id} {...eachMember} />;
            </Link>
          )
        })
      ) : (
        <p>No team members assigned yet.</p>
      )}

      <h3>Projects you might also like:</h3>
      {relatedProjects.length > 0 ? (
        relatedProjects.map((eachProject, i) => (
          <Link to={`/project/${eachProject._id}`}>
            <CardProject key={eachProject._id} {...eachProject} />
          </Link>
        ))
      ) : (
        <p>No related projects found</p>
      )}

      <section>
        <div>
          <h3>Events related with this project</h3>
        </div>

        <div>
          {relatedEvents.length > 0 ? (
            relatedEvents.map((eachEvent, i) => (
              <Link to={`/event/${eachEvent._id}`}>
                <CardEventSmall key={i} {...eachEvent} />
              </Link>
            ))
          ) : (
            <p>No events scheduled yet</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default DetailsProject;
