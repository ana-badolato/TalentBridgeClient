import "../../App.css"; // Asegúrate de que la ruta sea correcta
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import { AuthContext } from "../../context/auth.context";
import service from "../../services/config"; 
import axios from "axios";
import { FadeLoader } from "react-spinners";

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
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  //! Cloudinary image upload
  const [imageUrl, setImageUrl] = useState(null); 
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event) => {
    if (!event.target.files[0]) {
      return;
    }

    setIsUploading(true);

    const uploadData = new FormData();
    uploadData.append("image", event.target.files[0]);

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/upload`, uploadData);

      const uploadedImageUrl = response.data.imageUrl;
      setImageUrl(uploadedImageUrl);

      setUserData((prevData) => ({
        ...prevData,
        profilePicture: uploadedImageUrl,
      }));

      setIsUploading(false);
    } catch (error) {
      console.error("Error subiendo la imagen:", error);
      navigate("/error");
    }
  };

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
        navigate("/error");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await service.put(`/user/${loggedUserId}`, userData);
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        navigate("/user/profile"); // Navegar a la página del perfil
        window.location.reload();  // Refrescar la página
      }, 1500);
    } catch (error) {
      console.log("Error updating profile:", error);
      navigate("/error");
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
    window.location.reload();
  };

  if (isLoading) {
    return (
      <>
        <h4>...loading</h4>
        <FadeLoader color="#FFBE1A" />
      </>
    );
  }

  return (
    <div className="form-page">
      <div className="container-main-content">
        <h2 style={{ marginBottom: "16px" }}>Edit Profile</h2>

        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-group">
            <img
              src={imageUrl || userData.profilePicture || ""}
              alt="Profile"
              width="150"
              height="150"
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
            <input type="file" name="image" onChange={handleFileUpload} disabled={isUploading} />
          </div>

          {isUploading ? <h3>... uploading image</h3> : null}

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
              <button
                type="button"
                onClick={handleAddSkill}
                style={{
                  border: "none",
                  padding: "8px 16px",
                  backgroundColor: "rgb(198, 223, 165)",
                  borderRadius: "3px",
                  margin: "16px 0",
                }}
              >
                Add
              </button>
            </div>
            <ul>
              {userData.skills.map((skill, index) => (
                <li key={index}>
                  {skill}{" "}
                  <button
                    type="button"
                    onClick={() => handleDeleteSkill(skill)}
                    style={{
                      border: "none",
                      padding: "2px 4px",
                      backgroundColor: "#bdbdbd",
                      borderRadius: "3px",
                      margin: "4px 0",
                    }}
                  >
                    x
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="button-container">
            <button
              type="submit"
              style={{
                backgroundColor: "#3478f6", // Primary-mid color
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Save Changes
            </button>
            <button
  type="button"
  className="button-large-grey"
  onClick={handleGoToProfile}
  style={{
    width: "100%", // El botón ocupará todo el ancho
    backgroundColor: "#bdbdbd", // Gris claro
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "16px",
    color: "#fff", // Texto blanco
    textAlign: "center", // Centrar el texto horizontalmente
    display: "flex", // Usamos flexbox para centrar
    justifyContent: "center", // Centramos horizontalmente
    alignItems: "center", // Centramos verticalmente
  }}
>
  Back to Profile
</button>
          </div>

          {showConfirmation && (
            <div className="confirmation-message">Profile updated successfully!</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default EditUser;
