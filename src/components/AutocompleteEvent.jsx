import { useEffect, useState } from "react";
import service from "../services/config.js";
import addImg from "../assets/icons/add.svg"; // Icono para añadir usuarios
import { useNavigate } from "react-router-dom";

function AutocompleteEvent({ updateLecturers, initialSelectedLecturers = [] }) {
  
  const navigate = useNavigate()
  const [allUsers, setAllUsers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedLecturers, setSelectedLecturers] = useState([]); // Lista de usuarios seleccionados

  // Cargar todos los usuarios una sola vez cuando el componente se monta
  useEffect(() => {
    getData();
  }, []);

  // Solo actualizamos los `selectedLecturers` si `initialSelectedLecturers` cambia
  useEffect(() => {
    // Solo actualizamos selectedLecturers si los valores son diferentes
    if (initialSelectedLecturers.length !== selectedLecturers.length) {
      setSelectedLecturers(initialSelectedLecturers);
    }
  }, [initialSelectedLecturers]);
  

  const getData = async () => {
    try {
      const response = await service.get("/user/");
      setAllUsers(response.data);
      setFilteredUsers([]); // Aseguramos que no haya usuarios filtrados al inicio
      console.log("All users fetched:", response.data); // Agregamos log para mostrar todos los usuarios obtenidos
    } catch (error) {
      console.log(error);
      navigate("/error")
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    if (event.target.value.trim() === "") {
      setFilteredUsers([]);
    } else {
      const usersFiltered = allUsers.filter((eachUser) =>
        eachUser.username.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setFilteredUsers(usersFiltered);
      console.log("Filtered users:", usersFiltered); // Log para mostrar los usuarios filtrados
    }
  };

  // Función para mover el usuario a la lista de seleccionados
  const addLecturer = (user) => {
    if (!selectedLecturers.find((lecturer) => lecturer._id === user._id)) {
      const newSelectedLecturers = [...selectedLecturers, user]; // Añadimos el usuario
      setSelectedLecturers(newSelectedLecturers); // Actualizamos el estado de seleccionados
  
      // Removemos el usuario de los filtrados para que no aparezca en la búsqueda
      setFilteredUsers((prevFiltered) =>
        prevFiltered.filter((filteredUser) => filteredUser._id !== user._id)
      );
  
      // Actualizamos el estado en el componente padre
      updateLecturers(newSelectedLecturers);
  
      console.log("User added, selectedLecturers:", newSelectedLecturers); // Verificamos la lista
    }
  };
  

  // Función para remover el usuario de la lista de seleccionados y devolverlo a los disponibles
  const removeLecturer = (user) => {
    const newSelectedLecturers = selectedLecturers.filter(
      (lecturer) => lecturer._id !== user._id
    );
    setSelectedLecturers(newSelectedLecturers); // Actualizamos la lista de seleccionados
  
    // Añadimos el usuario removido a los filtrados para que reaparezca en la búsqueda
    setFilteredUsers((prevFiltered) => [...prevFiltered, user]);
  
    // Actualizamos el estado en el componente padre
    updateLecturers(newSelectedLecturers);
  
    console.log("User removed, selectedLecturers:", newSelectedLecturers);
  };
  

  return (
    <div>
      <label htmlFor="lecturer">Add a new lecturer:</label>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Write their name"
      />

      {/* Lista de usuarios disponibles */}
      {filteredUsers.length > 0 && (
        <div className="vertical-scroll-container" style={{ border: '1px solid red', margin: '10px 0' }}>
          <h3>Available Users</h3>
          {filteredUsers.map((eachUser, i) => (
            <div key={i} className="user-item">
              <img src={eachUser.profilePicture} alt="" className="profilePictureImg" />
              <p>{eachUser.username}</p>
              <img
                src={addImg}
                alt="Add"
                onClick={() => addLecturer(eachUser)} // Mueve el usuario a la lista de seleccionados
              />
            </div>
          ))}
        </div>
      )}

      {/* Lista de usuarios seleccionados */}
      {selectedLecturers.length > 0 ? (
  <div className="vertical-scroll-container" style={{ border: '2px solid green', margin: '20px 0', padding: '10px' }}>
    <h3>Selected Lecturers</h3>
    {selectedLecturers.map((eachUser, i) => (
      <div key={i} className="user-item" style={{ borderBottom: '1px solid #ccc', padding: '5px 0' }}>
        <img src={eachUser.profilePicture} alt="" className="profilePictureImg" />
        <p>{eachUser.username}</p>
        <img
          src={addImg}  // Aquí asegúrate de usar un icono de "remover" si es necesario
          alt="Remove"
          onClick={() => removeLecturer(eachUser)} // Función para remover
        />
      </div>
    ))}
  </div>
) : (
  <p>No lecturers selected</p>
)}

    </div>
  );
}

export default AutocompleteEvent;
