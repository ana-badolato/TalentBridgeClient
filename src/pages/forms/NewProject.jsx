import { useContext, useState } from "react";
import Autocomplete from "../../components/Autocomplete";
import { AuthContext } from "../../context/auth.context";
import service from "../../services/config";
import axios from "axios";
import "../../CSS/formGeneric.css";
import { useNavigate } from "react-router-dom";

function NewProject() {
  const { loggedUserId } = useContext(AuthContext);

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

  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const handleGoToProfile = () => {
    navigate(`/user/profile`);
  };
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
        navigate(`/user/profile`);
      }, 1500);
    } catch (error) {
      console.log(error);
      navigate("/error");
    }
  };

  const updateTeamMembers = (selectedUsers) => {
    setProjectData((prevData) => ({
      ...prevData,
      teamMembers: selectedUsers,
    }));
  };

  return (
    <div className="new-project-container" style={{ height: "80vh" }}>
      <form onSubmit={handleSubmit} className="project-form">
        <h3>New Project</h3>
        <div className="image-upload">
          <label htmlFor="">Image</label>

          {projectData.image && (
            <img
              src={
                imageUrl ||
                projectData.image ||
                "https://res.cloudinary.com/drqiultmd/image/upload/v1729707730/vzupen0uk9ctuhtatn2q.png"
              }
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

        <p className="required-fields" style={{ marginBottom: "8px" }}>
          (<span>*</span>) Required Fields
        </p>
        <button type="submit" className="submit-button">
          New project
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
