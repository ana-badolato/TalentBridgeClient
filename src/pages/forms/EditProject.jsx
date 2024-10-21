import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from "../../context/auth.context";
import { useNavigate, useParams } from "react-router-dom"; 
import service from '../../services/config';
import Autocomplete from "../../components/Autocomplete"

function EditProject() {

  const params = useParams()
  const navigate = useNavigate();

  const { loggedUserId } = useContext(AuthContext);

  const [projectData, setProjectData] = useState({
    title: "",
    mainObjective:"",
    description: "",
    location: "",
    image:"",
    category:"",
    teamMembers: []
  })

  const [isLoading, setIsLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        console.log("hola")
        console.log("Fetched project data:", params._id);
        const response = await service.get(`/project/${params.projectid}`);
        setProjectData({
          title: response.data.title || "",
          mainObjective:response.data.mainObjective || "",
          description: response.data.description || "", 
          location: response.data.location || "",
          image: response.data.image || "",
          category: response.data.category || "",
          teamMembers:response.data.teamMembers || []
        });


        // Pasar los miembros del equipo existentes a Autocomplete
      updateTeamMembers(response.data.teamMembers || []);
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching project data:", error);
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

    try {
      await service.put(`/project/${params.projectid}`, projectData);
      setShowConfirmation(true); 
      setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);
    } catch (error) {
      console.log("Error updating project:", error);
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
    return <h3>Loading...</h3>;
  }
  return (
    <div><form onSubmit={handleSubmit}>
    <h3>New Project</h3>
    <div>
      <label htmlFor="">Title: </label>
      <input name="title" type="text" placeholder="Development of a Mobile App" value={projectData.title || ""} onChange={handleChange}/>
    </div>

    <div>
      <label htmlFor="">Main Objective</label>
      <textarea name="mainObjective" type="text" maxLength={250} placeholder="Create an easy-to-use solution for financial management." value={projectData.mainObjective} onChange={handleChange}/>
    </div>

    <div>
      <label htmlFor="">Description</label>
      <textarea name="description" maxLength={2000} placeholder="A mobile application that helps users manage their personal finances, allowing them to track their income and expenses." value={projectData.description || ""} onChange={handleChange}/>
    </div>

    <div>
      <label htmlFor="">Location</label>
      <input name="location" type="text" placeholder="Barcelona, Spain" value={projectData.location || ""} onChange={handleChange} />
    </div>

    <div>
      {projectData.image && <img src={projectData.image} alt="Project" style={{ width: "200px" }} />}
      <input name="image" type="file" onChange={handleImageUpload} />
    </div>


    <div>
      <label htmlFor="">Category</label>
      <select name="category" value={projectData.category || ""} onChange={handleChange}>
        <option value="">Select a Category</option>
        <option value="Technology & Innovation">Technology & Innovation</option>
        <option value="Sustainability & Environment">Sustainability & Environment</option>
        <option value="Art & Creativity">Art & Creativity</option>
        <option value="Health & Wellness">Health & Wellness</option>
        <option value="Education & Training">Education & Training</option>
        <option value="Community & Social Impact">Community & Social Impact</option>
      </select>
    </div>

     <div>
      {<Autocomplete updateTeamMembers={updateTeamMembers} initialSelectedUsers={projectData.teamMembers}/>} 
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
              Project updated successfully!
            </div>
          )}
  </form></div>
  )
}

export default EditProject