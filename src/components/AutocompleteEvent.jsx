import { useEffect, useState } from "react";
import service from "../services/config.js";
import addImg from "../assets/icons/add.svg";
import { useNavigate } from "react-router-dom";

function AutocompleteEvent({ updateLecturers, initialSelectedLecturers = [] }) {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedLecturers, setSelectedLecturers] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (initialSelectedLecturers.length !== selectedLecturers.length) {
      setSelectedLecturers(initialSelectedLecturers);
    }
  }, [initialSelectedLecturers]);

  const getData = async () => {
    try {
      const response = await service.get("/user/");
      setAllUsers(response.data);
      setFilteredUsers([]);
      console.log("All users fetched:", response.data);
    } catch (error) {
      console.log(error);
      navigate("/error");
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    if (event.target.value.trim() === "") {
      setFilteredUsers([]);
    } else {
      const usersFiltered = allUsers.filter((eachUser) =>
        eachUser.username
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      );
      setFilteredUsers(usersFiltered);
      console.log("Filtered users:", usersFiltered);
    }
  };

  const addLecturer = (user) => {
    if (!selectedLecturers.find((lecturer) => lecturer._id === user._id)) {
      const newSelectedLecturers = [...selectedLecturers, user];
      setSelectedLecturers(newSelectedLecturers);

      setFilteredUsers((prevFiltered) =>
        prevFiltered.filter((filteredUser) => filteredUser._id !== user._id)
      );

      updateLecturers(newSelectedLecturers);

      console.log("User added, selectedLecturers:", newSelectedLecturers);
    }
  };

  const removeLecturer = (user) => {
    const newSelectedLecturers = selectedLecturers.filter(
      (lecturer) => lecturer._id !== user._id
    );
    setSelectedLecturers(newSelectedLecturers);
    setFilteredUsers((prevFiltered) => [...prevFiltered, user]);
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

      {filteredUsers.length > 0 && (
        <div
          className="vertical-scroll-container"
          style={{ border: "1px solid red", margin: "10px 0" }}
        >
          <h3>Available Users</h3>
          {filteredUsers.map((eachUser, i) => (
            <div key={i} className="user-item">
              <img
                src={eachUser.profilePicture}
                alt=""
                className="profilePictureImg"
              />
              <p>{eachUser.username}</p>
              <img
                src={addImg}
                alt="Add"
                onClick={() => addLecturer(eachUser)}
              />
            </div>
          ))}
        </div>
      )}

      {selectedLecturers.length > 0 ? (
        <div
          className="vertical-scroll-container"
          style={{
            border: "2px solid green",
            margin: "20px 0",
            padding: "10px",
          }}
        >
          <h3>Selected Lecturers</h3>
          {selectedLecturers.map((eachUser, i) => (
            <div
              key={i}
              className="user-item"
              style={{ borderBottom: "1px solid #ccc", padding: "5px 0" }}
            >
              <img
                src={eachUser.profilePicture}
                alt=""
                className="profilePictureImg"
              />
              <p>{eachUser.username}</p>
              <img
                src={addImg}
                alt="Remove"
                onClick={() => removeLecturer(eachUser)}
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
