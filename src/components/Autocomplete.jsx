import "../App.css";
import "../CSS/autocomplete.css";
import { useEffect, useState } from "react";
import service from "../services/config.js";
import addImg from "../assets/icons/add.svg"; // Icono para añadir usuarios
import { useNavigate } from "react-router-dom";

function Autocomplete({updateTeamMembers, initialSelectedUsers = [] }) {

  const navigate = useNavigate()
  const [allUsers, setAllUsers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(initialSelectedUsers); // Lista de usuarios seleccionados

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setSelectedUsers(initialSelectedUsers);
  }, []);

  const getData = async () => {
    try {
      const response = await service.get("/user/");
      setAllUsers(response.data);
    } catch (error) {
      console.log(error);
      navigate("/error")
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    const usersFiltered = allUsers.filter((eachUser) => {
      return eachUser.username.toLowerCase().includes(event.target.value.toLowerCase());
    });
    setFilteredUsers(usersFiltered);
  };

  // Función para mover el usuario a la lista de seleccionados
  const addUser = (user) => {
    const newSelectedUsers = [...selectedUsers, user]
    setSelectedUsers(newSelectedUsers);
    setFilteredUsers((prevFiltered) =>
      prevFiltered.filter((filteredUser) => filteredUser.username !== user.username)
    );
    updateTeamMembers(newSelectedUsers)
  };

  // Función para remover el usuario de la lista de seleccionados y devolverlo a los disponibles
  const removeUser = (user) => {
    const newSelectedUsers = selectedUsers.filter((selectedUsers)=> selectedUsers.username !==user.username)
    setSelectedUsers(newSelectedUsers)
    setFilteredUsers((prevFiltered) => [...prevFiltered, user]);
    updateTeamMembers(newSelectedUsers)
  };

  return (
    <div>
      <label htmlFor="teamMember"> Add a new team member:</label>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Write their name"
      />

      {/* Lista de usuarios disponibles */}
      {filteredUsers.length > 0 && (
        <div className="vertical-scroll-container">
          {filteredUsers.map((eachUser, i) => (
            <div key={i} className="user-item">
              <img src={eachUser.profilePicture} alt="" className="profilePictureImg" />
              <p>{eachUser.username}</p>
              <img
                src={addImg}
                alt="Add"
                onClick={() => addUser(eachUser)} // Mueve el usuario a la lista de seleccionados
              />
            </div>
          ))}
        </div>
      )}

      {/* Lista de usuarios seleccionados */}
      {selectedUsers.length > 0 && (
        <div>
          <h3>Selected Team Members:</h3>
          <div className="vertical-scroll-container">
            {selectedUsers.map((eachUser, i) => (
              <div key={i} className="user-item">
                <img src={eachUser.profilePicture} alt="" className="profilePictureImg" />
                <p>{eachUser.username}</p>
                <img
                  src={addImg}
                  alt="Remove"
                  onClick={() => removeUser(eachUser)} // Remueve el usuario de la lista de seleccionados
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Autocomplete;
