import { useState, useEffect } from "react";
import service from "../services/config.js";
import CardProject from "./CardProject.jsx";

function ListProjects(props) {
  const [allProjects, setAllProjects] = useState([]) //!
  const {searchValue, categoryFilter} = props
  
  useEffect(()=>{
    getData()
  }, [])

  const getData = async () => {
    try {
      const response = await service(`/project/`)
      console.log("ey",response.data);
      setAllProjects(response.data)

    } catch (error) {
      console.log(error)
    }
  }

  
  const filteredProjects = allProjects.filter((eachProject) =>{
    const matchesSearch = eachProject.title.toLowerCase().includes(searchValue.toLowerCase())
    const matchesCategory = categoryFilter === "All" || eachProject.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div>
      {filteredProjects.map((eachProject)=> {
        return (
          <CardProject key={eachProject._id} allProjects={allProjects} {...eachProject}/>
        )
      })}

    </div>
  )
}

export default ListProjects