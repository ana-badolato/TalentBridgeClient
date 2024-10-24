import { useState, useEffect } from "react";
import service from "../services/config.js";
import CardEvent from "./CardEvent.jsx";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination.jsx";
import NoContentBox from "./NoContentBox";

function ListEvents(props) {
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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

  const filteredEvents = allEvents.filter((eachEvent) => {
    const matchesSearch = eachEvent.name
      .toLowerCase()
      .includes(searchValue.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || eachEvent.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      {filteredEvents.length === 0 ? (
        <NoContentBox />
      ) : (
        <>
          <div className="event-list">
            {currentEvents.map((eachEvent) => {
              return (
                <CardEvent
                  key={eachEvent._id}
                  allEvents={allEvents}
                  {...eachEvent}
                />
              );
            })}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            nextLabel=">"
            prevLabel="<"
            className="custom-pagination"
          />
        </>
      )}
    </div>
  );
}

export default ListEvents;
