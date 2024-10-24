import "../App.css"
// src/pages/AllEvents.jsx
import { useState, useEffect, useContext } from "react";
import SearchBar from "../components/SearchBar";
import Filter from "../components/Filter";
import ListEvents from "../components/ListEvents";
import EventMap from "../components/EventMap.jsx"; // Importa el componente del mapa
import service from "../services/config.js"; // Importa el servicio para obtener eventos

import eventsImg from "../assets/icons/events.svg"
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/auth.context.jsx";
import addImg from "../assets/icons/add.svg";
import { Link } from "react-router-dom";


function AllEvents() {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [events, setEvents] = useState([]);
  const { isLoggedIn, loggedUserId } = useContext(AuthContext);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await service.get('/event'); // Cambia la URL según tu API
        setEvents(response.data);
      } catch (error) {
        console.log("Error fetching events:", error);
        navigate("/error")
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="container-page">
      <div className="container-main-content">
      <section>
        
        <div className="header-category">
          <img src={eventsImg} alt="projects" className="header-img-category"/>
          <h2 className="title-category">All Events</h2>
        </div>
      
    </section>

        <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />

        <Filter categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}/>

        {/* Renderiza el mapa de eventos */}
        <EventMap events={events} />
        
        {/* Renderiza la lista de eventos */}
        <ListEvents searchValue={searchValue} />
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
  );
}

export default AllEvents;
