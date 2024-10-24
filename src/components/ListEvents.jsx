import { useState, useEffect } from "react";
import service from "../services/config.js";
import CardEvent from "./CardEvent.jsx";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination.jsx";
import NoContentBox from "./NoContentBox"; // Importamos NoContentBox

function ListEvents(props) {
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);  // Página actual
  const eventsPerPage = props.eventsPerPage || 12;

  const { searchValue, categoryFilter } = props;

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await service.get("/event/");
      setAllEvents(response.data);
    } catch (error) {
      console.log(error);
      navigate("/error");
    }
  };

  // Filtrar eventos por el valor de búsqueda (searchValue) y categoría (categoryFilter)
  const filteredEvents = allEvents.filter((eachEvent) => {
    const matchesSearch = eachEvent.name.toLowerCase().includes(searchValue.toLowerCase());
    const matchesCategory = categoryFilter === "All" || eachEvent.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calcular el número total de páginas
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Obtener los eventos que se mostrarán en la página actual
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  // Función para cambiar de página
  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      {/* Si no hay eventos después de filtrar, mostrar NoContentBox */}
      {filteredEvents.length === 0 ? (
        <NoContentBox />
      ) : (
        <>
          <div className="event-list">
            {currentEvents.map((eachEvent) => {
              return (
                <CardEvent key={eachEvent._id} allEvents={allEvents} {...eachEvent} />
              );
            })}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            nextLabel=">"         // Usa directamente el símbolo de mayor que
            prevLabel="<"         // Usa directamente el símbolo de menor que
            className="custom-pagination"  // Clase CSS personalizada para la paginación
          />
        </>
      )}
    </div>
  );
}

export default ListEvents;
