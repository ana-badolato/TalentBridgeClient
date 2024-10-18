import { useState, useEffect } from "react";
import service from "../services/config.js";
import { useParams } from "react-router-dom";
import CardProject from "./CardProject.jsx";

function ListProjects(props) {
  const [allProjects, setAllProjects] = useState([]) //!
  const {searchValue} = props
  const params = useParams();
  
  useEffect(()=>{
    getData()
  }, [])

  const getData = async () => {
    try {
      const response = await service(`/project/`)
      setAllProjects(response.data)

    } catch (error) {
      console.log(error)
    }
  }

  
  return (
    <div>
      {allProjects
      .filter((eachProject) =>{
        return eachProject.title.toLowerCase().includes(searchValue.toLowerCase())
      })
      .map((eachProject)=> {
        return (
          <CardProject key={eachProject._id} allProjects={allProjects} {...eachProject}/>
        )
      })}

    </div>
  )
}

export default ListProjects