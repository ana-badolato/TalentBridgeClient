import { useEffect, useState } from "react"
import service from "../services/config"
import { useNavigate, useParams } from "react-router-dom"
import CardUserSmall from "../components/CardUserSmall";
import CardProject from "../components/CardProject"
import CardEventSmall from "../components/CardEventSmall";

// images:
import dateImg from "../assets/icons/date.svg";
import teamMembersImg from "../assets/icons/teamMembers.svg";
import { FadeLoader } from "react-spinners";

function DetailsProject() {
  
  const navigate = useNavigate()
  const params = useParams()
  const [projectDetails, setProjectDetails] = useState({})

  //estado para guardar proyectos y eventos relacionados
  const [relatedProjects, setRelatedProjects] = useState([])
  const [relatedEvents, setRelatedEvents] = useState([])

  useEffect(()=>{
    getData()
  }, [params.projectid])
  
  const getData = async () =>{
    try {
      const response = await service.get(`/project/${params.projectid}`)
      setProjectDetails(response.data)
      getRelatedProjects(response.data.category, response.data._id) //pasa la categoria del proyecto
      console.log(response.data.teamMembers)
            //eventos relacionados con el proyecto
      const events = await service.get(`/project/${params.projectid}/event`);
      setRelatedEvents(events.data);
    } catch (error) {
      console.log(error)
      navigate("/error")
    }
  }

  const getRelatedProjects = async (category) =>{
    try {
      const response = await service.get(`/project/`)
      const filteredProjects = response.data.filter((eachProject) => eachProject.category === category && eachProject._id !== params.projectid)
      setRelatedProjects(filteredProjects)
    } catch (error) {
      console.log(error)
      navigate("/error")
    }
  }
  //por si teamMembers todavia no llega de la api, que no de problemas
  const totalMembers = projectDetails.teamMembers ? projectDetails.teamMembers.length + 1 : 1;

  if (!projectDetails) {
    return (
      <>
      <h4>...loading</h4>
      <FadeLoader color="#FFBE1A" />
      </>
    )
  }

  return (
    <div>

      <img src={projectDetails.image} alt="project-image" style={{width: "200px"}}/>
      <p>{projectDetails.title}</p>
      <p>{projectDetails.mainObjective}</p>
      <p>{projectDetails.category}</p>

      <div className="card-pr-section-properties">
          <div className="icon-text-element-pr">
            <img src={dateImg} alt="" />
            <p>
              {new Date(projectDetails.startDate).toLocaleDateString()} <span>Start Date</span>
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

      <section>
        <div>
          <h3>Meet our Team</h3>
        </div>

        <div>
          {/* Renderizamos el Owner primero */}
          <p>owner:</p>
          {projectDetails.owner && (
              <div className="owner-container">
                {console.log("ID del Owner:", projectDetails.owner.username)} {/* Imprimir el ID del owner */}
                <CardUserSmall 
                  profilePicture={projectDetails.owner.profilePicture} 
                  username={projectDetails.owner.username} 
                  bio={projectDetails.owner.bio}
                  className="owner-card"
                />
          </div>

        )}
          <p>Collaborators:</p>
          {projectDetails.teamMembers && projectDetails.teamMembers.length > 0 ? (
            projectDetails.teamMembers.map((eachMember) => {
              return (
                <CardUserSmall key={eachMember._id} {...eachMember}/>
              );
            })
          ) : (
            <p>No team members assigned yet.</p>
          )}
        </div>
      </section>

      <section>
        <div>
          <h3>Projects you might also like:</h3>
        </div>
        <div>
          {relatedProjects.length > 0 ? (relatedProjects.map((eachProject, i)=> (
            <CardProject key={eachProject._id} {...eachProject}/>
          ))):(
            <p>No related projects found</p>
          )}
        </div>
      </section>

    <section>
        <div>
          <h3>Events related with this project</h3>
        </div>

        <div>
          {relatedEvents.length > 0 ? (
            relatedEvents.map((eachEvent) => (
                <CardEventSmall key={eachEvent._id} {...eachEvent} />
            ))
          ) : (
            <p>No events scheduled yet</p>
          )}
        </div>
      </section>

    </div>
  )
}

export default DetailsProject