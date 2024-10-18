import { useState, useEffect } from "react";
import service from "../services/config.js";
import { useParams } from "react-router-dom";
import ListProjects from "../components/ListProjects.jsx";

function DetailsUser() {

  const [user, setUser] = useState("")
  const [allUserProjects, setAllUserProjects] = useState([]) //!

  const params = useParams();
  
  useEffect(()=>{
    getData()
  }, [])

  const getData = async () => {
    try {
      const response = await service.get(`/user/${params.userid}`)
      setUser(response.data)


      const responseProject = await service(`/user/${params.userid}/project`)
      setAllUserProjects(responseProject.data)

    } catch (error) {
      console.log(error)
    }
  }
  
  if(user === null || allUserProjects === null){
    return <h3>...loading</h3>
    //! añadir efecto de carga
  }

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
      <ListProjects />
    </div>
  )
}

export default DetailsUser
