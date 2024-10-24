import "../App.css";
import "../CSS/home.css";
import "../CSS/category.css";

import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import service from "../services/config.js";
import CardProject from "./CardProject";
import CallToAction from "./CallToAction.jsx";
import CardEvent from "./CardEvent"
import { AuthContext } from "../context/auth.context.jsx";
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
<<<<<<< HEAD
import SearchBar from "./SearchBar.jsx";
import Filter from "./Filter.jsx";
=======
import addImg from "../assets/icons/add.svg";
>>>>>>> 58e6bdd5eac0e00eb7f327e176ad7d694858e98f

function CardCategory() {

  const params = useParams()
  const navigate = useNavigate()

  const [searchValue, setSearchValue] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All")
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
      navigate("/error")
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
  const { isLoggedIn, loggedUserId } = useContext(AuthContext);
  return (
    <div className="container-page">
      <div className="container-main-content">
      <div className="filters">
<<<<<<< HEAD

=======
        
>>>>>>> 58e6bdd5eac0e00eb7f327e176ad7d694858e98f
      </div>
      <section>
        {headerImage && (
          <div className="header-category">
            <img src={headerImage} alt={params.category} className="header-img-category"/>
            <h2 className="title-category">{params.category}</h2>
          </div>
        )}
      </section>

      <div className="index-categories">
          <button
            onClick={() => handleOnClick("Technology & Innovation")}
            className="category-tag"
          >
            <p className="category-tag-content">
              Technology &<span style={{ display: "block" }}>Innovation</span>
            </p>
            <img src={tech} />
          </button>

          <button
            onClick={() => handleOnClick("Sustainability & Environment")}
            className="category-tag"
          >
            <p className="category-tag-content">
              Sustainability &
              <span style={{ display: "block" }}>Environment</span>
            </p>
            <img src={sustainability} />
          </button>

          <button
            onClick={() => handleOnClick("Art & Creativity")}
            className="category-tag"
          >
            <p className="category-tag-content">
              Art &<span style={{ display: "block" }}>Creativity</span>
            </p>
            <img src={art} />
          </button>

          <button
            onClick={() => handleOnClick("Health & Wellness")}
            className="category-tag"
          >
            <p className="category-tag-content">
              Health &<span style={{ display: "block" }}>Wellness</span>
            </p>
            <img src={health} />
          </button>

          <button
            onClick={() => handleOnClick("Education & Training")}
            className="category-tag"
          >
            <p className="category-tag-content">
              Education &<span style={{ display: "block" }}>Training</span>
            </p>
            <img src={education} />
          </button>

          <button
            onClick={() => handleOnClick("Community & Social Impact")}
            className="category-tag"
          >
            <p className="category-tag-content">
              Community &<span style={{ display: "block" }}>Social Impact</span>
            </p>
            <img src={community} />
          </button>
        </div>

      <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />

      <Filter categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}/> 

      <h2 className="index-title">Projects</h2>
      <div className="main-section-index">
      <section style={{marginTop:"32px"}} className="project-list">
        {categoryProjects.map((eachProject)=>{
          return(
            <CardProject key={eachProject._id} {...eachProject}/>
          )
        })}
      </section>
        </div>

      <h2 className="index-title">Upcoming Events</h2>
      <div className="main-section-index">
      <section style={{marginTop:"32px"}} className="event-list">
      {categoryEvents.map((eachEvent)=>{
          return(
            <CardEvent key={eachEvent._id} {...eachEvent}/>
          )
        })}
      </section>
      </div>
      <CallToAction />
      </div>
      {isLoggedIn && (
  <div className="buttons-fixed" style={{position:"fixed", bottom:"64px", right:"32px"}}>
    {/* Botón "Add Project" */}
    <Link to="/newproject">
      <div className="add-project-container">
        <button className="button-large-blue" style={{width:"130px", marginBottom:"-16px", boxShadow:"0px 4px 10px rgba(200, 200, 200, 0.2)"}}>
          <div className="icon-text-element">
            <img src={addImg} alt="" />
            <p>Add Project</p>
          </div>
        </button>
      </div>
    </Link>

    {/* Botón "Add Event" */}
    <Link to="/newevent">
      <div className="add-event-container">
        <button className="button-large-blue" style={{width:"130px", boxShadow:"0px 4px 10px rgba(200, 200, 200, 0.2)"}} >
          <div className="icon-text-element" style={{display:"flex", alignItems:"center"}}>
            <img src={addImg} alt="" />
            <p>Add Event</p>
          </div>
        </button>
      </div>
    </Link>
  </div>
)}
    </div>
  )
}

export default CardCategory