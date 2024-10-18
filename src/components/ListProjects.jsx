import { useState, useEffect } from "react";
import service from "../services/config.js";
import { useParams } from "react-router-dom";
import CardProject from "./CardProject.jsx";

function ListProjects() {
  const [allUserProjects, setAllUserProjects] = useState([]) //!

  const params = useParams();
  
  useEffect(()=>{
    getData()
  }, [])

  const getData = async () => {
    try {
      const response = await service(`/user/${params.userid}/project`)
      setAllUserProjects(response.data)

    } catch (error) {
      console.log(error)
    }
  }

  
  return (
    <div>
      {allUserProjects.map((eachProject)=> {
        return (
          <CardProject key={eachProject._id} allUserProjects={allUserProjects} {...eachProject}/>
        )
      })}

    </div>
  )
}

export default ListProjects