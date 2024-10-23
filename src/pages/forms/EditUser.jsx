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
  // const [uploadingImage, setUploadingImage] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);


//! aquí empieza código cloudinary
const [imageUrl, setImageUrl] = useState(null); 
const [isUploading, setIsUploading] = useState(false);
// below function should be the only function invoked when the file type input changes => onChange={handleFileUpload}
const handleFileUpload = async (event) => {
  if (!event.target.files[0]) {
    return;
  }

  setIsUploading(true); // Iniciar la animación de carga

  const uploadData = new FormData();
  uploadData.append("image", event.target.files[0]);

  try {
    const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/upload`, uploadData);

    const uploadedImageUrl = response.data.imageUrl; // La URL de la imagen subida
    setImageUrl(uploadedImageUrl); // Esto actualiza la vista previa

    // Aquí es donde actualizas el estado de userData con la URL de la imagen
    setUserData((prevData) => ({
      ...prevData,
      profilePicture: uploadedImageUrl,  // Actualiza el campo de la imagen de perfil
    }));

    setIsUploading(false); // Detener la animación de carga
  } catch (error) {
    console.error("Error subiendo la imagen:", error);
    navigate("/error");
  }
};
//! aquí termina código cloudinary

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

  // const handleImageUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("upload_preset", "s3e3p4eg");

  //   setUploadingImage(true);
  //   try {
  //     const response = await axios.post(
  //       "https://api.cloudinary.com/v1_1/drqiultmd/image/upload",
  //       formData
  //     );
  //     const imageUrl = response.data.secure_url;
  //     setUserData((prevData) => ({
  //       ...prevData,
  //       profilePicture: imageUrl,
  //     }));
  //     setUploadingImage(false);
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //     setUploadingImage(false);
  //   }
  // };

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
  {/* Mostrar la imagen nueva si existe, de lo contrario mostrar la imagen de perfil actual */}
  <img 
    src={imageUrl || userData.profilePicture || ""} 
    alt="Profile" 
    width="150"
    height="150"
    style={{objectFit:"cover", borderRadius:"50%"}}
  />
  <input 
    type="file"  
    name="image" 
    onChange={handleFileUpload} 
    disabled={isUploading} 
  />
</div>

          {/* to render a loading message or spinner while uploading the picture */}
          {isUploading ? <h3>... uploading image</h3> : null}

          {/* below line will render a preview of the image from cloudinary */}
          {/* {imageUrl ? (<div><img src={imageUrl} alt="img" width={200} /></div>) : null} */}

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
