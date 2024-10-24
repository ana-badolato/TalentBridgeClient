import "../App.css";
import "../CSS/autocomplete.css";
import { useEffect, useState } from "react";
import service from "../services/config.js";
import addImg from "../assets/icons/add.svg";
import { useNavigate } from "react-router-dom";

function Autocomplete({updateTeamMembers, initialSelectedUsers = [] }) {

  const navigate = useNavigate()
  const [allUsers, setAllUsers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(initialSelectedUsers);

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

  const addUser = (user) => {
    const newSelectedUsers = [...selectedUsers, user]
    setSelectedUsers(newSelectedUsers);
    setFilteredUsers((prevFiltered) =>
      prevFiltered.filter((filteredUser) => filteredUser.username !== user.username)
    );
    updateTeamMembers(newSelectedUsers)
  };

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

      {filteredUsers.length > 0 && (
        <div className="vertical-scroll-container">
          {filteredUsers.map((eachUser, i) => (
            <div key={i} className="user-item">
              <img src={eachUser.profilePicture} alt="" className="profilePictureImg" />
              <p>{eachUser.username}</p>
              <img
                src={addImg}
                alt="Add"
                onClick={() => addUser(eachUser)}
              />
            </div>
          ))}
        </div>
      )}

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
                  onClick={() => removeUser(eachUser)}
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
