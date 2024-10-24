import "../../App.css";
import "../../CSS/formGeneric.css";

import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/auth.context";
import { useNavigate, useParams } from "react-router-dom";
import service from "../../services/config";
import Autocomplete from "../../components/Autocomplete";
import axios from "axios";
import { FadeLoader } from "react-spinners";

function EditProject() {
  const params = useParams();
  const navigate = useNavigate();

  const { loggedUserId } = useContext(AuthContext);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [projectData, setProjectData] = useState({
    title: "",
    mainObjective: "",
    description: "",
    location: "",
    image: "",
    category: "",
    teamMembers: [],
  });

  const [isLoading, setIsLoading] = useState(true);
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
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/upload`,
        uploadData
      );

      const uploadedImageUrl = response.data.imageUrl; // La URL de la imagen subida
      setImageUrl(uploadedImageUrl); // Esto actualiza la vista previa

      // Aquí es donde actualizas el estado de userData con la URL de la imagen
      setProjectData((prevData) => ({
        ...prevData,
        image: uploadedImageUrl, // Actualiza el campo de la imagen en el proyecto
      }));

      setIsUploading(false); // Detener la animación de carga
    } catch (error) {
      console.error("Error subiendo la imagen:", error);
      navigate("/error");
    }
  };
  //! aquí termina código cloudinary

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        //console.log("Fetched project data:", params._id);
        const response = await service.get(`/project/${params.projectid}`);
        setProjectData({
          title: response.data.title || "",
          mainObjective: response.data.mainObjective || "",
          description: response.data.description || "",
          location: response.data.location || "",
          image: response.data.image || "",
          category: response.data.category || "",
          teamMembers: response.data.teamMembers || [],
        });

        // Pasar los miembros del equipo existentes a Autocomplete
        updateTeamMembers(response.data.teamMembers || []);
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching project data:", error);
        navigate("/error")
      }
    };

    if (loggedUserId) {
      fetchProjectData();
    }
  }, [loggedUserId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
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
  //     setProjectData((prevData) => ({
  //       ...prevData,
  //       image: imageUrl,
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
      await service.put(`/project/${params.projectid}`, projectData);
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        navigate(`/user/profile`);
      }, 1500);
    } catch (error) {
      console.log("Error updating project:", error);
      navigate("/error")
    }
  };

  const handleGoToProfile = () => {
    navigate(`/user/profile`);
  };

  //! añadir funciones teamMembers
  const updateTeamMembers = (selectedUsers) => {
    setProjectData((prevData) => ({
      ...prevData,
      teamMembers: selectedUsers, // Actualiza el array de miembros del equipo en el estado del proyecto
    }));
  };

  if (isLoading) {
    return (
      <>
      <h4>...loading</h4>
      <FadeLoader color="#FFBE1A" />
      </>
    )
  }

  return (
    <div className="form-page">
      <form onSubmit={handleSubmit} className="project-form">
        <h3>Edit Project</h3>
        <div>
          {projectData.image && (
            <img
              src={imageUrl || projectData.image || ""}
              alt="Project"
              style={{ maxHeight: "200px", width: "100%", objectFit: "cover" }}
            />
          )}
          <input
            name="image"
            type="file"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </div>
        {isUploading ? <h3>... uploading image</h3> : null}
        <div>
          <label htmlFor="title">
            Title <span>*</span>
          </label>
          <input
            name="title"
            type="text"
            placeholder="Development of a Mobile App"
            value={projectData.title || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="mainObjective">
            Main Objective <span>*</span>
          </label>
          <textarea
            name="mainObjective"
            type="text"
            maxLength={250}
            placeholder="Create an easy-to-use solution for financial management."
            value={projectData.mainObjective}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            maxLength={2000}
            placeholder="A mobile application that helps users manage their personal finances, allowing them to track their income and expenses."
            value={projectData.description || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="location">Location</label>
          <input
            name="location"
            type="text"
            placeholder="Barcelona, Spain"
            value={projectData.location || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="category">
            Category <span>*</span>
          </label>
          <select
            name="category"
            value={projectData.category || ""}
            onChange={handleChange}
            required
          >
            <option value="">Select a Category</option>
            <option value="Technology & Innovation">
              Technology & Innovation
            </option>
            <option value="Sustainability & Environment">
              Sustainability & Environment
            </option>
            <option value="Art & Creativity">Art & Creativity</option>
            <option value="Health & Wellness">Health & Wellness</option>
            <option value="Education & Training">Education & Training</option>
            <option value="Community & Social Impact">
              Community & Social Impact
            </option>
          </select>
        </div>

        <div>
          {
            <Autocomplete
              updateTeamMembers={updateTeamMembers}
              initialSelectedUsers={projectData.teamMembers}
            />
          }
          <p className="required-fields">
            (<span>*</span>) Required Fields
          </p>
        </div>

        <div className="button-container">
          {/* Botón para guardar los cambios */}
          

          <button type="submit" className="submit-button">
          Save changes
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

        {/* Mensaje de confirmación al guardar los cambios */}
        {showConfirmation && (
          <div className="confirmation-message">
            Project updated successfully!
          </div>
        )}
      </form>
    </div>
  );
}

export default EditProject;
