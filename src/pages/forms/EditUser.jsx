import "../../App.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import { AuthContext } from "../../context/auth.context"
import service from "../../services/config"; 
import axios from "axios";

function EditUser() {
  const { loggedUserId } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    username: "",
    profilePicture: "",
    contactEmail: "",
    location: "",
    bio: "",
    skills: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [newSkill, setNewSkill] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  // Cargar los datos del usuario logueado al montar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await service.get(`/user/${loggedUserId}`);
        setUserData({
          username: response.data.username || "",
          profilePicture: response.data.profilePicture || "",
          contactEmail: response.data.contactEmail || "",
          location: response.data.location || "",
          bio: response.data.bio || "",
          skills: response.data.skills || [],
        });
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    if (loggedUserId) {
      fetchUserData();
    }
  }, [loggedUserId]);

  // Definir la función handleChange para actualizar los campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Subir la imagen a Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "YOUR_UPLOAD_PRESET");

    setUploadingImage(true);

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
        formData
      );
      const imageUrl = response.data.secure_url;
      setUserData((prevData) => ({
        ...prevData,
        profilePicture: imageUrl,
      }));
      setUploadingImage(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadingImage(false);
    }
  };

  // Manejar la acción de enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = { ...userData };

    try {
      await service.put(`/user/${loggedUserId}`, updatedData);
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  };

  // Manejar el añadido de skills
  const handleAddSkill = () => {
    if (newSkill.trim() && !userData.skills.includes(newSkill.trim())) {
      setUserData((prevData) => ({
        ...prevData,
        skills: [...prevData.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  // Manejar la eliminación de una skill
  const handleDeleteSkill = (skillToRemove) => {
    setUserData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleGoToProfile = () => {
    navigate(`/user/${loggedUserId}`);
  };

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  return (
    <div className="container-page">
      <div className="container-main-content">
        <h2>Edit Profile</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <img src={userData.profilePicture || ""} alt="Profile" width="150" />
            {/* Input para subir archivo */}
            <input type="file" onChange={handleImageUpload} />
            {uploadingImage && <p>Uploading...</p>}
          </div>

          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={userData.username || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="contactEmail">Contact Email</label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={userData.contactEmail || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={userData.location || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={userData.bio || ""}
              onChange={handleChange}
              maxLength="250"
            />
          </div>

          <div>
            <label htmlFor="skills">Skills</label>
            <div>
              <input
                type="text"
                id="skills"
                name="skills"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a skill and press Enter"
              />
              <button type="button" onClick={handleAddSkill}>
                Add
              </button>
            </div>

            <ul>
              {userData.skills.map((skill, index) => (
                <li key={index}>
                  {skill}{" "}
                  <button type="button" onClick={() => handleDeleteSkill(skill)}>
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="button-container">
            <button type="submit" className="button-large-blue">
              Save Changes
            </button>
            <button
              type="button"
              className="button-large-grey"
              onClick={handleGoToProfile}
            >
              Back to Profile
            </button>
          </div>

          {showConfirmation && (
            <div className="confirmation-message">
              Profile updated successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default EditUser;
