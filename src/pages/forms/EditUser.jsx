import "../../App.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import { AuthContext } from "../../context/auth.context";
import service from "../../services/config"; 
import axios from "axios";

function EditUser() {
  // Usamos el contexto para obtener el ID del usuario que está logueado
  const { loggedUserId } = useContext(AuthContext);

  // Creamos un estado para almacenar los datos del usuario
  const [userData, setUserData] = useState({
    username: "",
    profilePicture: "", 
    contactEmail: "",
    location: "",
    bio: "",
    skills: [],
  });

  // Estado para manejar la carga de datos inicial (muestra un loader)
  const [isLoading, setIsLoading] = useState(true);

  // Estado para las nuevas skills que añadimos manualmente
  const [newSkill, setNewSkill] = useState("");

  // Estado para mostrar si la imagen está en proceso de subida
  const [uploadingImage, setUploadingImage] = useState(false);

  // Estado para mostrar un mensaje de confirmación cuando guardamos cambios
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Hook para redirigir a otra página
  const navigate = useNavigate();

  // Hook de efecto que se ejecuta cuando se monta el componente, busca los datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Llama a la API para obtener los datos del usuario logueado
        const response = await service.get(`/user/${loggedUserId}`);
        // Establecemos los datos del usuario en el estado userData
        setUserData({
          username: response.data.username || "",
          profilePicture: response.data.profilePicture || "",
          contactEmail: response.data.contactEmail || "",
          location: response.data.location || "",
          bio: response.data.bio || "",
          skills: response.data.skills || [],
        });
        setIsLoading(false); // Cambiamos el estado de carga cuando los datos se han cargado
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    // Solo hacemos la petición si hay un usuario logueado
    if (loggedUserId) {
      fetchUserData();
    }
  }, [loggedUserId]); // El efecto se ejecuta cuando loggedUserId cambia

  // Manejamos los cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Actualizamos el estado de userData con los nuevos valores
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejamos la subida de imágenes a Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; // Obtenemos el archivo seleccionado
    if (!file) return;

    const formData = new FormData(); // Creamos un objeto FormData para enviar el archivo
    formData.append("file", file);
    formData.append("upload_preset", "s3e3p4eg"); // El "preset" de Cloudinary para la subida

    setUploadingImage(true); // Cambiamos el estado para mostrar que está subiendo la imagen

    try {
      // Hacemos la petición POST a Cloudinary
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/drqiultmd/image/upload", // URL de Cloudinary con el nombre del "cloud"
        formData
      );
      const imageUrl = response.data.secure_url; // Guardamos la URL de la imagen subida
      setUserData((prevData) => ({
        ...prevData,
        profilePicture: imageUrl, // Actualizamos el campo de imagen de perfil
      }));
      setUploadingImage(false); // Indicamos que la subida ha terminado
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadingImage(false);
    }
  };

  // Función que se llama cuando enviamos el formulario para guardar los cambios
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Hacemos la petición PUT para actualizar los datos del usuario en el backend
      await service.put(`/user/${loggedUserId}`, userData);
      setShowConfirmation(true); // Mostramos el mensaje de confirmación
      setTimeout(() => {
        setShowConfirmation(false); // Ocultamos el mensaje después de 3 segundos
      }, 3000);
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  };

  // Añadir una nueva skill al array de skills
  const handleAddSkill = () => {
    if (newSkill.trim() && !userData.skills.includes(newSkill.trim())) {
      // Actualizamos el array de skills con la nueva skill
      setUserData((prevData) => ({
        ...prevData,
        skills: [...prevData.skills, newSkill.trim()],
      }));
      setNewSkill(""); // Limpiamos el input de nueva skill
    }
  };

  // Eliminar una skill del array de skills
  const handleDeleteSkill = (skillToRemove) => {
    setUserData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((skill) => skill !== skillToRemove), // Filtramos las skills para eliminar la que queremos
    }));
  };

  // Añadir una skill al presionar Enter en el input de skills
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Evitamos que el formulario se envíe
      handleAddSkill(); // Llamamos a la función para añadir la skill
    }
  };

  // Función para volver al perfil del usuario
  const handleGoToProfile = () => {
    navigate(`/user/${loggedUserId}`);
  };

  // Si está cargando, mostramos un mensaje de carga
  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  return (
    <div className="container-page">
      <div className="container-main-content">
        <h2>Edit Profile</h2>

        <form onSubmit={handleSubmit}>
          <div>
            {/* Mostrar la imagen de perfil actual */}
            <img src={userData.profilePicture || ""} alt="Profile" width="150" />
            {/* Input para subir una nueva imagen */}
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
              {/* Mostramos todas las skills que tiene el usuario y añadimos un botón para eliminar cada una */}
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
            {/* Botón para guardar los cambios */}
            <button type="submit" className="button-large-blue">
              Save Changes
            </button>
            {/* Botón para volver al perfil sin guardar */}
            <button
              type="button"
              className="button-large-grey"
              onClick={handleGoToProfile}
            >
              Back to Profile
            </button>
          </div>

          {/* Mensaje de confirmación al guardar los cambios */}
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
