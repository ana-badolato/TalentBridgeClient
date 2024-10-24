import "../../App.css";
import "../../CSS/formGeneric.css";
import "../../CSS/formProject.css";

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

  const [showConfirmation, setShowConfirmation] = useState(false);

  //! aquí empieza código cloudinary
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
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/upload`,
        uploadData
      );

      const uploadedImageUrl = response.data.imageUrl;
      setImageUrl(uploadedImageUrl);

      setProjectData((prevData) => ({
        ...prevData,
        image: uploadedImageUrl,
      }));

      setIsUploading(false);
    } catch (error) {
      console.error("Error subiendo la imagen:", error);
      navigate("/error");
    }
  };
  //! aquí termina código cloudinary

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
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

        updateTeamMembers(response.data.teamMembers || []);
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching project data:", error);
        navigate("/error");
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
      navigate("/error");
    }
  };

  const handleGoToProfile = () => {
    navigate(`/user/profile`);
  };

  //! añadir funciones teamMembers
  const updateTeamMembers = (selectedUsers) => {
    setProjectData((prevData) => ({
      ...prevData,
      teamMembers: selectedUsers,
    }));
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
          <button type="submit" className="submit-button">
            Save changes
          </button>

          <button
            type="button"
            className="button-large-grey"
            onClick={handleGoToProfile}
            style={{
              width: "100%",
              backgroundColor: "#bdbdbd",
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "16px",
              color: "#fff",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Back to Profile
          </button>
        </div>

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
