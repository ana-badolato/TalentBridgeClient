import "../App.css"
// src/pages/AllEvents.jsx
import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import ListEvents from "../components/ListEvents";
import EventMap from "../components/EventMap.jsx"; // Importa el componente del mapa
import service from "../services/config.js"; // Importa el servicio para obtener eventos

function AllEvents() {
  const [searchValue, setSearchValue] = useState("");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await service.get('/event'); // Cambia la URL según tu API
        setEvents(response.data);
      } catch (error) {
        console.log("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="container-page">
      <div className="container-main-content">
        <h3>ALL EVENTS</h3>
        <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />

        {/* Renderiza el mapa de eventos */}
        <EventMap events={events} />
        
        {/* Renderiza la lista de eventos */}
        <ListEvents searchValue={searchValue} />
      </div>
    </div>
  );
}

export default AllEvents;
