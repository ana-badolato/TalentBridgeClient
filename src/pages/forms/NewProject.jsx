import { useContext, useState } from "react";
import Autocomplete from "../../components/Autocomplete";
import { AuthContext } from "../../context/auth.context";
import service from "../../services/config";
import axios from "axios";
import "../../CSS/formGeneric.css";
import { useNavigate } from "react-router-dom";

function NewProject() {
  const { loggedUserId } = useContext(AuthContext);
  // const [uploadingImage, setUploadingImage] = useState(false);
  const [projectData, setProjectData] = useState({
    title: "",
    mainObjective: "",
    description: "",
    location: "",
    image: "",
    category: "",
    owner: loggedUserId,
    teamMembers: [],
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();
  //! aquí empieza código cloudinary
  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  // below function should be the only function invoked when the file type input changes => onChange={handleFileUpload}
  const handleGoToProfile = () => {
    navigate(`/user/profile`);
  };
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
  //   formData.append("upload_preset", "s9t7p5jy");

  //   // setUploadingImage(true);

  //   try {
  //     const response = await axios.post(
  //       "https://api.cloudinary.com/v1_1/dvfrtqmex/image/upload",
  //       formData
  //     );
  //     const imageUrl = response.data.secure_url;
  //     setProjectData((prevData) => ({
  //       ...prevData,
  //       image: imageUrl,
  //     }));
  //     // setUploadingImage(false);
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //     // setUploadingImage(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      title,
      mainObjective,
      description,
      location,
      image,
      category,
      owner,
      teamMembers,
    } = projectData;

    const newProject = {
      title,
      mainObjective,
      description,
      location,
      image,
      category,
      owner,
      teamMembers,
    };

    try {
      await service.post("/project/", newProject);
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const updateTeamMembers = (selectedUsers) => {
    setProjectData((prevData) => ({
      ...prevData,
      teamMembers: selectedUsers,
    }));
  };

  return (
    <div className="new-project-container">
      <form onSubmit={handleSubmit} className="project-form">
        <h3>New Project</h3>
        <div className="image-upload">
          <label htmlFor="">Image</label>
          {/* 
          {uploadingImage && <p>Uploading...</p>} */}
          {projectData.image && ( // Mostrar la imagen si existe
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
        <div className="form-group">
          <label htmlFor="">
            Title <span>*</span>
          </label>
          <input
            name="title"
            type="text"
            placeholder="Development of a Mobile App"
            value={projectData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="">
            Main Objective <span>*</span>
          </label>
          <textarea
            name="mainObjective"
            maxLength={250}
            placeholder="Create an easy-to-use solution for financial management."
            value={projectData.mainObjective}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="">Description</label>
          <textarea
            name="description"
            maxLength={2000}
            placeholder="A mobile application that helps users manage their personal finances, allowing them to track their income and expenses."
            value={projectData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="">Location</label>
          <input
            name="location"
            type="text"
            placeholder="Barcelona, Spain"
            value={projectData.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="">
            Category <span>*</span>
          </label>
          <select
            name="category"
            value={projectData.category}
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

        <div className="form-group">
          <Autocomplete updateTeamMembers={updateTeamMembers} />
        </div>

        <p className="required-fields">
          (<span>*</span>) Required Fields
        </p>
        <button type="submit" className="submit-button">
          New project
        </button>

        <button
          type="button"
          className="button-large-grey"
          onClick={handleGoToProfile}
        >
          Back to Profile
        </button>

        {showConfirmation && (
          <div className="confirmation-message">
            Project created successfully!
          </div>
        )}
      </form>
    </div>
  );
}

export default NewProject;
