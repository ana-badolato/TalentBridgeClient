import "../../App.css";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import service from "../../services/config";
import axios from "axios";
import "../../CSS/formGeneric.css";
import { FadeLoader } from "react-spinners";

function EditEvent() {
  const params = useParams();
  const navigate = useNavigate();

  const { loggedUserId } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loggedUserProjects, setLoggedUserProjects] = useState([]);
  const [eventData, setEventData] = useState({
    name: "",
    mainObjective: "",
    description: "",
    date: "",
    time: "",
    address: "",
    location: { lat: null, lng: null },
    category: "",
    capacity: 20,
    price: 0,
    posterImage: "",
    owner: loggedUserId,
    lecturer: [],
    attendees: [],
    relatedProjects: "",
  });

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

      setEventData((prevData) => ({
        ...prevData,
        posterImage: uploadedImageUrl,
      }));

      setIsUploading(false);
    } catch (error) {
      console.error("Error subiendo la imagen:", error);
      navigate("/error");
    }
  };

  const handleGoToProfile = () => {
    navigate(`/user/profile`);
  };

  useEffect(() => {
    if (loggedUserId) {
      fetchUserProjects();
      fetchEventData();
    }
  }, [params.eventid]);

  const fetchUserProjects = async () => {
    if (!loggedUserId) {
      console.log("No valid loggedUserId found");
      return;
    }
    try {
      const response = await service.get(`project/user/projectsuser`);
      setLoggedUserProjects(response.data);
    } catch (error) {
      console.log("Error fetching user projects:", error);
      navigate("/error");
    }
  };

  const fetchEventData = async () => {
    try {
      const response = await service.get(`/event/${params.eventid}`);
      setEventData({
        name: response.data.name || "",
        mainObjective: response.data.mainObjective || "",
        description: response.data.description || "",
        date: response.data.date || "",
        time: response.data.time || "",
        address: response.data.address || "",
        location: response.data.location || { lat: null, lng: null },
        category: response.data.category || "",
        capacity: response.data.capacity || 20,
        price: response.data.price || 0,
        posterImage: response.data.posterImage || "",
        lecturer: response.data.lecturer || [],
        attendees: response.data.attendees || [],
        relatedProjects: response.data.relatedProjects,
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      navigate("/error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { lat: parseFloat(lat), lng: parseFloat(lon) };
      } else {
        console.log("No coordinates found for the address.");
        return { lat: null, lng: null };
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return { lat: null, lng: null };
      navigate("/error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting eventData: ", eventData);

    const coordinates = await getCoordinates(eventData.address);

    const updatedEventData = {
      ...eventData,
      location: coordinates,
    };

    try {
      await service.put(`/event/${params.eventid}`, updatedEventData);

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

  if (isLoading) {
    return (
      <>
        <h4>...loading</h4>
        <FadeLoader color="#FFBE1A" />
      </>
    );
  }

  return (
    <div className="new-event-container">
      <form onSubmit={handleSubmit} className="project-form">
        <h3>Edit Event</h3>
        <div className="form-group">
          <label htmlFor="">Poster Image</label>
          {eventData.posterImage && (
            <img
              src={imageUrl || eventData.posterImage || ""}
              alt="posterImage"
              className="uploaded-image"
              style={{ maxHeight: "200px", width: "100%", objectFit: "cover" }}
            />
          )}
          <input name="posterImage" type="file" onChange={handleFileUpload} />
        </div>

        <div className="form-group">
          <label htmlFor="">
            Title <span>*</span>
          </label>
          <input
            name="name"
            type="text"
            value={eventData.name}
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
            value={eventData.mainObjective}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="">Description</label>
          <textarea
            name="description"
            maxLength={2000}
            value={eventData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="">
            Date <span>*</span>
          </label>
          <input
            name="date"
            type="date"
            value={eventData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="">
            Time <span>*</span>
          </label>
          <input
            name="time"
            type="time"
            value={eventData.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="">
            Address <span>*</span>
          </label>
          <input
            name="address"
            type="text"
            value={eventData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="">
            Category <span>*</span>
          </label>
          <select
            name="category"
            value={eventData.category}
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
          <label htmlFor="">Capacity</label>
          <input
            name="capacity"
            type="number"
            value={eventData.capacity}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="">Price</label>
          <input
            name="price"
            type="number"
            value={eventData.price}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="">Related project:</label>
          <select
            name="relatedProjects"
            value={eventData.relatedProjects}
            onChange={handleChange}
          >
            <option value="">Select a project</option>
            {loggedUserProjects.map((eachProject) => (
              <option key={eachProject._id} value={eachProject._id}>
                {eachProject.title}
              </option>
            ))}
          </select>
          <p style={{ marginTop: "8px" }} className="required-fields">
            (<span>*</span>) Required Fields
          </p>
        </div>

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
        {showConfirmation && (
          <div className="confirmation-message">Event edited successfully!</div>
        )}
      </form>
    </div>
  );
}

export default EditEvent;
