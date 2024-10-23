import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import service from "../services/config.js";
import CardProject from "./CardProject"

function CardCategory() {

  const params = useParams()

  const [categoryProjects, setCategoryProjects] = useState([])

  useEffect(()=>{
    getData()
  },[params.category])

  const getData = async () =>{
    try {
      const response = await service.get(`/project/category/${params.category}`)
      setCategoryProjects(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      {categoryProjects.map((eachProject)=>{
        return(
          <CardProject key={eachProject._id} {...eachProject}/>
        )
      })}
    </div>
  )
}

export default CardCategory