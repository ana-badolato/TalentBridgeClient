import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

function Map({setLocation}) {

  //estado para las coordenadas
  const [position, setPosition] = useState([41.3851, 2.1734]) //Barcelona

  //COnfiguración del icono marcador: para evitar que el icono del marcador no aparezca (cosas de leaflet)
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });

  //gestores de click en el mapa: cuando se clique en el mapa, actualiza la posición con las coordenadas del click y llama a setLocation para enviar las nuevas coordenadas al componente padre.
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  };

  return (
    <div>
    <MapContainer center={position} zoom={13} style={{ height: '200px', width: '50%' }}>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
    <Marker position={position} />
    <MapClickHandler />
  </MapContainer>
    </div>
  )
}

export default Map