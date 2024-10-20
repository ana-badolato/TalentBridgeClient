import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context.jsx";
import service from "../services/config.js"; // Importar el servicio para hacer la llamada API

function CardEvent({ eventId, posterImage, name, owner, mainObjective, date, address, isOwnProfile, isJoinDisabled }) {
  const { isLoggedIn, loggedUserId } = useContext(AuthContext);
  const [eventData, setEventData] = useState({ posterImage, name, owner, mainObjective, date, address });
  const [loading, setLoading] = useState(!name); // Si no se pasa el nombre, es que no tenemos datos y los cargamos

  useEffect(() => {
    if (!name && eventId) {
      // Si no hay datos y se pasa el eventId, hacemos la solicitud
      const fetchEventData = async () => {
        try {
          const response = await service.get(`/event/${eventId}`);
          setEventData(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching event data:", error);
          setLoading(false);
        }
      };
      fetchEventData();
    }
  }, [name, eventId]);

  if (loading) return <p>Loading event...</p>;

  const { posterImage: eventImage, name: eventName, owner: eventOwner, mainObjective: eventObjective, date: eventDate, address: eventAddress } = eventData;

  // Verificar si el usuario logueado es el propietario del evento
  const isOwner = isLoggedIn && String(loggedUserId) === String(eventOwner._id);

  return (
    <div>
      <h3>EVENT</h3>
      <Link to={`/event/${eventId}`}>
        {/* Imagen y botones de editar/eliminar */}
        <img src={eventImage} alt={eventName} style={{ width: "200px" }} />
        {isOwnProfile && isOwner && (
          <div>
            <button>
              <p>Edit</p>
            </button>
            <button>
              <p>Delete</p>
            </button>
          </div>
        )}
        
        <p>{eventName}</p>
        <p>{eventObjective}</p>
        <p>{new Date(eventDate).toLocaleDateString()}</p>
        <p>{eventAddress}</p>
        <p>{eventOwner.username}</p>

        {/* Botón Join que se desactiva según la prop isJoinDisabled */}
        <button disabled={isJoinDisabled} className="button-small-blue">
          <p>Join</p>
        </button>
      </Link>
    </div>
  );
}

export default CardEvent;
