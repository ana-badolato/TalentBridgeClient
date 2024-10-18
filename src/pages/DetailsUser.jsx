import { useState, useEffect } from "react";
import service from "../services/config.js";
import { useParams } from "react-router-dom";
import CardProject from "../components/CardProject.jsx";
import CardEvent from "../components/CardEvent.jsx";

function DetailsUser() {

  const [user, setUser] = useState("")
  const [allUserProjects, setAllUserProjects] = useState([])
  const [allUserEvents, setAllUserEvents] = useState ([])

  const params = useParams();
  
  useEffect(()=>{
    getData()
  }, [])

  const getData = async () => {
    try {
      const response = await service.get(`/user/${params.userid}`)
      setUser(response.data)

      const responseProject = await service.get(`/project/user/${params.userid}`)
      setAllUserProjects(responseProject.data)

      const responseEvent = await service.get(`/event/user/${params.userid}`)
      setAllUserEvents(responseEvent.data)

    } catch (error) {
      console.log(error)
    }
  }
  
  if(user === null || allUserProjects === null || allUserEvents === null){
    return <h3>...loading</h3>
    //! añadir efecto de carga
  }

  console.log("params", params)
    return (
    <div>
      <p>Detail User</p>
      <img src={user.profilePicture} alt="" /> 
      <p>{user.username}</p>
      <p>BIO{user.bio}</p>
      <p>Tags {user.skills}</p>
      
      <button>
        <img src="" alt="" />
        <p>Edit Profile</p>
      </button>

      <button>
        <img src="" alt="" />
        <p>Send Message</p>
      </button>
      {/*Revisar si va con link*/}
     
      <p>Projects list</p>
        {allUserProjects.map((eachProject)=> {
        return (
          <CardProject key={eachProject._id} allUserProjects={allUserProjects} {...eachProject}/>
        )
      })}

      <p>Event list</p>
        {allUserEvents.map((eachEvent)=>{
          return (
            <CardEvent key={eachEvent._id} allUserEvents={allUserEvents} {...eachEvent}/>
          )
        })}
    </div>
  )
}

export default DetailsUser
