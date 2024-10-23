import "../CSS/detailsEvent.css";
import "../CSS/cardUser.css";
import { useState, useEffect } from "react";
import service from "../services/config.js";
import { useParams, Link } from "react-router-dom";
import CardProject from "../components/CardProject.jsx";
import CardUserSmall from "../components/CardUserSmall.jsx";


function DetailsEvent() {
  const [eventData, setEventData] = useState(null); // Inicializamos con null
  const [loading, setLoading] = useState(true); // Estado para mostrar loading mientras se cargan los datos
  const { eventid } = useParams(); 

  useEffect(() => {
    getData();
  }, [eventid]); // El hook depende de eventid

  const getData = async () => {
    try {
      const response = await service.get(`/event/${eventid}`);
      console.log("Datos del evento recibidos:", response.data); 
      setEventData(response.data); // Guardamos los datos del evento
      setLoading(false); // Detenemos la carga
    } catch (error) {
      console.log("Error fetching event data:", error);
      setLoading(false); // Detenemos la carga en caso de error
    }
  };

  // Si los datos aún están cargando, mostramos un mensaje de carga
  if (loading) {
    return <p>Loading event data...</p>;
  }

  // Si no hay datos de eventData, mostramos un mensaje de error o fallback
  if (!eventData) {
    return <p>Error: No event data found</p>;
  }

  // Si los datos están disponibles, renderizamos el contenido
  return (
    <div className="container-page">
      <div className="container-main-content">
        {/* Detalles del evento */}
        <img src={eventData.posterImage} alt="" className="details-img" />
        <h1>{eventData.name}</h1>
        <h2>{eventData.mainObjective}</h2>
        <p>{eventData.description}</p>
        <p>{eventData.date}</p>
        <p>{eventData.time}</p>
        <p>{eventData.address}</p>
        <p>{eventData.category}</p>
        <p>Capacity: {eventData.capacityCounter} / {eventData.capacity}</p>   
        <p>{eventData.price === 0 ? "Free" : `$${eventData.price}`}</p>   

        {/* Verificamos que relatedProjects exista antes de renderizar */}
        {eventData.relatedProjects && (
          <CardProject {...eventData.relatedProjects} />
        )}

        {/* Renderizamos el Owner primero */}
        {eventData.owner && (
          <div className="owner-container">
             {console.log("ID del Owner:", eventData.owner.username)} {/* Imprimir el ID del owner */}
            <CardUserSmall 
              profilePicture={eventData.owner.profilePicture} 
              username={eventData.owner.username} 
              bio={eventData.owner.bio}

              className="owner-card"

            />
      
          </div>

        )}

{eventData.lecturer && eventData.lecturer.length > 0 && (
  <div className="lecturer-container">
    {eventData.lecturer.map((lecturer, index) => (
      <CardUserSmall 
        key={index} 
        profilePicture={lecturer.profilePicture} 
        username={lecturer.username} 
        bio={lecturer.bio}
        className="lecturer-card"
      />
    ))}
  </div>
)}
        
      </div>
    </div>
  );
}

export default DetailsEvent;
