import { useEffect, useState } from "react";
import service from "../services/config.js";
import addImg from "../assets/icons/add.svg"; // Icono para añadir usuarios

function AutocompleteEvent({ updateLecturers, initialSelectedLecturers = [] }) {
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
    if (JSON.stringify(initialSelectedLecturers) !== JSON.stringify(selectedLecturers)) {
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
      const newSelectedLecturers = [...selectedLecturers, user];
      setSelectedLecturers(newSelectedLecturers);
      setFilteredUsers((prevFiltered) =>
        prevFiltered.filter((filteredUser) => filteredUser._id !== user._id)
      );
      updateLecturers(newSelectedLecturers); // Actualizamos el estado en el componente padre
      console.log("User added, selectedLecturers:", newSelectedLecturers); // Log para mostrar los usuarios seleccionados
    }
  };

  // Función para remover el usuario de la lista de seleccionados y devolverlo a los disponibles
  const removeLecturer = (user) => {
    const newSelectedLecturers = selectedLecturers.filter(
      (lecturer) => lecturer._id !== user._id
    );
    setSelectedLecturers(newSelectedLecturers);
    setFilteredUsers((prevFiltered) => [...prevFiltered, user]);
    updateLecturers(newSelectedLecturers); // Actualizamos el estado en el componente padre
    console.log("User removed, selectedLecturers:", newSelectedLecturers); // Log para mostrar los usuarios seleccionados
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
                src={addImg}
                alt="Remove"
                onClick={() => removeLecturer(eachUser)} // Remueve el usuario de la lista de seleccionados
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
