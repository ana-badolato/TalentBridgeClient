// src/components/EventMap.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from '../assets/icons/location.svg'; // Cambia la ruta según tu estructura de carpetas

const EventMap = ({ events }) => {
  // Configuración del icono del marcador
  const icon = new L.Icon({
    iconUrl: markerIcon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // Filtrar eventos que tienen ubicaciones válidas
  const validEvents = events.filter(event => 
    event.location && event.location.lat !== null && event.location.lng !== null
  );

  return (
    <MapContainer center={[37.9799827, -0.6664249]} zoom={6} style={{ height: "500px", width: "100%", marginBottom:"46px" , borderRadius:"15px", overflow:"hidden"}}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {validEvents.map(event => {
        const { lat, lng } = event.location; // Asumimos que aquí location siempre es válido
        return (
          <Marker 
            key={event._id} 
            position={[lat, lng]} 
            icon={icon}
          >
            <Popup>
              <h4>{event.name}</h4>
              <p>{event.mainObjective}</p>
              <p>{event.address}</p>
              <p>{new Date(event.date).toLocaleDateString()} at {event.time}</p>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default EventMap;
