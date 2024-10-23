import { useContext, useState } from "react";
import Autocomplete from "../../components/Autocomplete";
import { AuthContext } from "../../context/auth.context";
import service from "../../services/config";
import axios from "axios";
import "../../CSS/formGeneric.css"; 

function NewProject() {
  
  const { loggedUserId } = useContext(AuthContext);
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [projectData, setProjectData] = useState({
    title: "",
    mainObjective: "",
    description: "",
    location: "",
    image: "",
    category: "",
    owner: loggedUserId,
    teamMembers: []
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "s9t7p5jy");

    setUploadingImage(true);

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dvfrtqmex/image/upload",
        formData
      );
      const imageUrl = response.data.secure_url;
      setProjectData((prevData) => ({
        ...prevData,
        image: imageUrl,
      }));
      setUploadingImage(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, mainObjective, description, location, image, category, owner, teamMembers } = projectData;

    const newProject = {
      title,
      mainObjective,
      description,
      location,
      image,
      category,
      owner,
      teamMembers
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
  }

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
          <input name="image" type="file" onChange={handleImageUpload} />
          {uploadingImage && <p>Uploading...</p>}
          {projectData.image && ( // Mostrar la imagen si existe
            <img src={projectData.image} alt="Uploaded" className="uploaded-image" />
          )}
        </div>

        <div className="form-group">
          <label htmlFor="">Title: </label>
          <input name="title" type="text" placeholder="Development of a Mobile App" value={projectData.title} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="">Main Objective</label>
          <textarea name="mainObjective" maxLength={250} placeholder="Create an easy-to-use solution for financial management." value={projectData.mainObjective} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="">Description</label>
          <textarea name="description" maxLength={2000} placeholder="A mobile application that helps users manage their personal finances, allowing them to track their income and expenses." value={projectData.description} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="">Location</label>
          <input name="location" type="text" placeholder="Barcelona, Spain" value={projectData.location} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="">Category</label>
          <select name="category" value={projectData.category} onChange={handleChange}>
            <option value="">Select a Category</option>
            <option value="Technology & Innovation">Technology & Innovation</option>
            <option value="Sustainability & Environment">Sustainability & Environment</option>
            <option value="Art & Creativity">Art & Creativity</option>
            <option value="Health & Wellness">Health & Wellness</option>
            <option value="Education & Training">Education & Training</option>
            <option value="Community & Social Impact">Community & Social Impact</option>
          </select>
        </div>

        <div className="form-group">
          <Autocomplete updateTeamMembers={updateTeamMembers} />
        </div>

        <button type="submit" className="submit-button">New project</button>

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
