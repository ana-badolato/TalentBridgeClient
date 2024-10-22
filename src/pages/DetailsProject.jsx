import { useEffect, useState } from "react"
import service from "../services/config"
import { useParams } from "react-router-dom"
import CardUserSmall from "../components/CardUserSmall";
import CardProject from "../components/CardProject"

// images:
import dateImg from "../assets/icons/date.svg";
import teamMembersImg from "../assets/icons/teamMembers.svg";

function DetailsProject() {
  
  const params = useParams()
  const [projectDetails, setProjectDetails] = useState({})

  //estado para guardar proyectos relacionados
  const [relatedProjects, setRelatedProjects] = useState([])

  useEffect(()=>{
    getData()
  }, [])
  
  const getData = async () =>{
    try {
      const response = await service.get(`/project/${params.projectid}`)
      setProjectDetails(response.data)
      getRelatedProjects(response.data.category, response.data._id) //pasa la categoria del proyecto
      console.log(response.data.teamMembers)
    } catch (error) {
      console.log(error)
    }
  }

  const getRelatedProjects = async (category) =>{
    try {
      const response = await service.get(`/project/`)
      const filteredProjects = response.data.filter((eachProject) => eachProject.category === category && eachProject._id !== params.projectid)
      setRelatedProjects(filteredProjects)
    } catch (error) {
      console.log(error)
    }
  }
  //por si teamMembers todavia no llega de la api, que no de problemas
  const totalMembers = projectDetails.teamMembers ? projectDetails.teamMembers.length + 1 : 1;


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
      <p>Meet our Team</p>
      {projectDetails.teamMembers && projectDetails.teamMembers.length > 0 ? (
        projectDetails.teamMembers.map((eachMember) => {
          return (
            <CardUserSmall key={eachMember._id} {...eachMember}/>
          );
        })
      ) : (
        <p>No team members assigned yet.</p>
      )}
      <p>Projects you might also like:</p>
      {relatedProjects.length > 0 ? (relatedProjects.map((eachProject, i)=> (
        <CardProject key={i} {...eachProject}/>
      ))):(
        <p>No related projects found</p>
      )}
    </div>
  )
}

export default DetailsProject