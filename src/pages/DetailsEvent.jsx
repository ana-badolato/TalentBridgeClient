import { useState, useEffect } from "react";
import service from "../services/config.js";
import { useParams } from "react-router-dom";

function DetailsEvent() {
  const [eventData, setEventData] = useState({});
  const { eventid } = useParams(); 

  useEffect(() => {
    getData();
  }, [eventid]); // El hook depende de eventid

  const getData = async () => {
    try {
      const response = await service.get(`/event/${eventid}`); // Aquí usamos eventid en la URL
      setEventData(response.data);
    } catch (error) {
      console.log("Error fetching event data:", error);
    }
  };

  return <div>{eventData.name}</div>;
}

export default DetailsEvent;
