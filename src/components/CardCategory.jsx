import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import service from "../services/config.js";
import CardProject from "./CardProject"
import CardEvent from "./CardEvent"

//images
import tech from "../assets/icons/tech.svg"
import sustainability from "../assets/icons/sustainability.svg"
import art from "../assets/icons/art.svg"
import community from "../assets/icons/community.svg"
import education from "../assets/icons/education.svg"
import health from "../assets/icons/health.svg"

import techHeader from "../assets/images/headers/techHeader.svg"
import artHeader from "../assets/images/headers/artHeader.svg"
import communityHeader from "../assets/images/headers/communityHeader.svg"
import educationHeader from "../assets/images/headers/educationHeader.svg"
import sustainabilityHeader from "../assets/images/headers/sustainabilityHeader.svg"
import healthHeader from "../assets/images/headers/healthHeader.svg"

function CardCategory() {

  const params = useParams()
  const navigate = useNavigate()

  const [categoryProjects, setCategoryProjects] = useState([])
  const [categoryEvents, setCategoryEvents] = useState([])

  useEffect(()=>{
    getData()
  },[params.category])

  const getData = async () =>{
    try {
      const responseProjects = await service.get(`/project/category/${params.category}`)
      setCategoryProjects(responseProjects.data)

      const responseEvents = await service.get(`/event/category/${params.category}`)
      setCategoryEvents(responseEvents.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleOnClick = (category) =>{
    navigate (`/category/${category}`)
  }

  //mapeo de la imagenes header
  const headerImages = {
    "Technology & Innovation": techHeader,
    "Sustainability & Environment": sustainabilityHeader,
    "Art & Creativity": artHeader,
    "Health & Wellness": healthHeader,
    "Education & Training": educationHeader,
    "Community & Social Impact": communityHeader,
  }

  const headerImage = headerImages[params.category] || null

  return (
    <div>
      <section>
        {headerImage && (
          <div>
            <img src={headerImage} alt={params.category}/>
            <h2>{params.category}</h2>
          </div>
        )}
      </section>

      <section className="index-categories">
          {/* Aquí puedes añadir las categorías, filtros, etc */}
        <button onClick={() => handleOnClick("Technology & Innovation")}>Technology & Innovation <img src={tech}/></button>
        <button onClick={() => handleOnClick("Sustainability & Environment")}>Sustainability & Environment <img src={sustainability}/></button>
        <button onClick={() => handleOnClick("Art & Creativity")}>Art & Creativity <img src={art}/></button>
        <button onClick={() => handleOnClick("Health & Wellness")}>Health & Wellness <img src={health}/></button>
        <button onClick={() => handleOnClick("Education & Training")}>Education & Training <img src={education}/></button>
        <button onClick={() => handleOnClick("Community & Social Impact")}>Community & Social Impact <img src={community}/></button>
      </section>

      <section>
        <h3>Projects</h3>
        {categoryProjects.map((eachProject)=>{
          return(
            <CardProject key={eachProject._id} {...eachProject}/>
          )
        })}
      </section>

      <section>
        <h3>Events</h3>
      {categoryEvents.map((eachEvent)=>{
          return(
            <CardEvent key={eachEvent._id} {...eachEvent}/>
          )
        })}
      </section>

    </div>
  )
}

export default CardCategory