import { useState, useEffect } from "react";
import service from "../services/config.js";
import CardEvent from "./CardEvent.jsx";

function ListEvents(props) {
  const [allEvents, setAllEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);  // Página actual
  const eventsPerPage = 12;  // Número de eventos por página

  const { searchValue } = props;

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await service.get("/event/");
      console.log("Eventos obtenidos:", response.data);
      setAllEvents(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Filtrar eventos por el valor de búsqueda (searchValue)
  const filteredEvents = allEvents.filter((eachEvent) => {
    return eachEvent.name.toLowerCase().includes(searchValue.toLowerCase());
  });

  // Calcular el número total de páginas
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Obtener los eventos que se mostrarán en la página actual
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  // Funciones para cambiar de página
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div>

      <div className="event-list">
        {currentEvents.map((eachEvent) => {
          return (
            <CardEvent key={eachEvent._id} allEvents={allEvents} {...eachEvent} />
          );
        })}
      </div>

      {/* Controles de paginación */}
      <div className="pagination-controls">
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
          Previous
        </button>

        <span>Page {currentPage} of {totalPages}</span>

        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>

  );
}

export default ListEvents;
