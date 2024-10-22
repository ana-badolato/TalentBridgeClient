import "../../App.css"; // Asegúrate de que la ruta sea correcta
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import { AuthContext } from "../../context/auth.context";
import service from "../../services/config"; 
import axios from "axios";

function EditUser() {
  const { loggedUserId } = useContext(AuthContext);
  console.log("Logged User ID:", loggedUserId);

  const [userData, setUserData] = useState({
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await service.get(`/user/profile`);
        setUserData({
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "s3e3p4eg");

    setUploadingImage(true);
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/drqiultmd/image/upload",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await service.put(`/user/${loggedUserId}`, userData);
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !userData.skills.includes(newSkill.trim())) {
      setUserData((prevData) => ({
        ...prevData,
        skills: [...prevData.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

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
    navigate(`/user/profile`);
  };

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  return (
    <div className="form-page">
      <div className="container-main-content">
        <h2>Edit Profile</h2>

        <form onSubmit={handleSubmit} className="project-form"> {/* Usar la clase para el formulario */}
          <div className="form-group">
            <img src={userData.profilePicture || ""} alt="Profile" width="150" />
            <input type="file" onChange={handleImageUpload} />
            {uploadingImage && <p>Uploading...</p>}
          </div>

          <div className="form-group">
            <label htmlFor="contactEmail">Contact Email</label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={userData.contactEmail || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={userData.location || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={userData.bio || ""}
              onChange={handleChange}
              maxLength="250"
            />
          </div>

          <div className="form-group">
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
            <button type="submit" className="submit-button"> {/* Usar la clase del botón */}
              Save Changes
            </button>
            <button
              type="button"
              className="button-large-grey" // Clase para el botón de retroceso
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
