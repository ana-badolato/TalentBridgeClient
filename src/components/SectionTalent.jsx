import { useEffect, useState } from "react";
import "../App.css";
import "../CSS/sectionTalent.css"; // Asegúrate de tener aquí los estilos del carrusel
import CardUserSlider from "../components/CardUserSlider.jsx"; // Importa la tarjeta individual
import service from "../services/config.js"; // Servicio para hacer las llamadas a la API

function SectionTalent() {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  // Función para obtener la lista de usuarios desde el backend
  const getData = async () => {
    try {
      const response = await service.get("/user/");
      setAllUsers(response.data); // Guardar los usuarios en el estado
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="section-talent-container">
      <p className="title-talents">Our Talents</p>
      {allUsers.length > 0 ? (
        <div className="slider">
          <div className="slider-track">
            {allUsers.map((user) => (
              <CardUserSlider key={user._id} {...user} />
            ))}
            {/* Duplicamos el contenido para crear el efecto continuo */}
            {allUsers.map((user) => (
              <CardUserSlider key={`${user._id}-duplicate`} {...user} />
            ))}
          </div>
        </div>
      ) : (
        <p>Cargando usuarios...</p> // Mensaje mientras se cargan los usuarios
      )}
    </div>
  );
}

export default SectionTalent;
