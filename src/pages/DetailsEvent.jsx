import "../CSS/detailsEvent.css";
import "../CSS/cardUser.css";
import { useState, useEffect } from "react";
import service from "../services/config.js";
import { useParams, Link, useNavigate } from "react-router-dom";
import CardProject from "../components/CardProject.jsx";
import CardUserSmall from "../components/CardUserSmall.jsx";
import { FadeLoader } from "react-spinners";
import applyImg from "../assets/icons/apply.svg";

import evDateImg from "../assets/icons/evDate.svg";
import locationImg from "../assets/icons/location.svg";

function DetailsEvent() {
  const navigate = useNavigate()
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
      navigate("/error")
    }
  };

  // Si los datos aún están cargando, mostramos un mensaje de carga
  if (loading) {
    return (
      <>
      <h4>...loading</h4>
      <FadeLoader color="#FFBE1A" />
      </>
    )
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
        <img src={eventData.posterImage} alt="" className="project-img" />

        <div className="details-project-main">
          
          <section className="pr-details-left" >
        
        <p className="details-section">{eventData.name}</p>
        <p className="main-objective" style={{marginTop:"-16px"}}>{eventData.mainObjective}</p>
        


        <div className="card-ev-properties" style={{marginTop:"8px"}}>
                <div className="icon-text-element" >
                  <img src={evDateImg} alt="" />
                  <p>{new Date(eventData.date).toLocaleDateString()} <span> | </span>{eventData.time}</p>
                </div>
                <p>|</p>
                <div className="icon-text-element">
                  <img src={locationImg} alt="" />
                  <p className="card-ev-address-overlay">{eventData.address}</p>
                </div>
                <p>|</p>
                <p style={{fontWeight:"600"}}>Capacity <span style={{marginLeft:"8px", fontWeight:"400"}}> {eventData.capacityCounter} / {eventData.capacity}
                  </span></p>  
                  <p>|</p> 
                <p>{eventData.price === 0 ? "Free" : `$${eventData.price}`}</p>   
              </div>

        <p className="tag-xl" style={{marginBottom:"8px"}}>{eventData.category}</p>
        <p style={{marginBottom:"8px", fontSize:"18px"}}>{eventData.description}</p>
       
        <button className="apply-button">
        <img src={applyImg} alt="" />
        <p>Join</p>
      </button>
        </section>

    <section className="pr-details-right" style={{marginTop:"32px"}}>
        {/* Verificamos que relatedProjects exista antes de renderizar */}
        {eventData.relatedProjects && (
          <CardProject {...eventData.relatedProjects} />
        )}
    </section>
          </div>

          <div>
          <h3 className="details-section">Meet our Team</h3>
        </div>
    <div className="project-people">
        {/* Renderizamos el Owner primero */}
        {eventData.owner && (
          <div className="owner-container" style={{border:"2px solid #ffbe1a", borderRadius:"10px"}}>
             {console.log("ID del Owner:", eventData.owner.username)} {/* Imprimir el ID del owner */}
            <CardUserSmall 
              profilePicture={eventData.owner.profilePicture} 
              username={eventData.owner.username} 
              bio={eventData.owner.bio}
              className="owner-card"
            />
          </div>
        )}
  </div>

        
      </div>
    </div>
  );
}

export default DetailsEvent;
