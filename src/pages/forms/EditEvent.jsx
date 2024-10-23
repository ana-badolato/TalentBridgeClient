import "../../App.css"; // Asegúrate de que la ruta sea correcta
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import { AuthContext } from "../../context/auth.context";
import service from "../../services/config"; 
import axios from "axios";
import "../../CSS/formGeneric.css"; // Asegúrate de importar tu CSS

function EditEvent() {
  
  const params = useParams()

  //auth context
  const { loggedUserId } = useContext(AuthContext);

  //estados
  const [isLoading, setIsLoading] = useState(true);
  // const [uploadingImage, setUploadingImage] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loggedUserProjects, setLoggedUserProjects] = useState([]);
  const [eventData, setEventData] = useState ({
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
    relatedProjects: ""
  })

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
    setEventData((prevData) => ({
      ...prevData,
      posterImage: uploadedImageUrl,  // Actualiza el campo de la imagen en el proyecto
    }));

    setIsUploading(false); // Detener la animación de carga
  } catch (error) {
    console.error("Error subiendo la imagen:", error);
    navigate("/error");
  }
};
//! aquí termina código cloudinary



  useEffect(()=>{
    if (loggedUserId){
      fetchUserProjects()
      fetchEventData()
    }
  }, [params.eventid])


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
    }
  };

  const fetchEventData = async () =>{
    try {
      const response = await service.get(`/event/${params.eventid}`)
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
        relatedProjects: response.data.relatedProjects || ""
      })
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

 //!añadir aqui nueva función para editar la imagen del evento

 const handleSubmit = async (e) =>{
  e.preventDefault()
  console.log("Submitting eventData: ", eventData)

  try {
    await service.put(`/event/${params.eventid}`, eventData)
 
    setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);
  } catch (error) {
    console.log(error)
  }
 }

 if (isLoading) {
  return <h3>Loading...</h3>;
}

  return (
    <div className="new-event-container">
      <form onSubmit={handleSubmit} className="project-form">
        <h3>Edit Event</h3>
        <div className="form-group">
          <label htmlFor="">Poster Image</label>
 
          {/* {uploadingImage && <p>Uploading...</p>} */}
          {eventData.posterImage && ( // Mostrar la imagen actual si existe
            <img src={imageUrl || eventData.posterImage || ""} alt="posterImage" className="uploaded-image" style={{ maxHeight:"200px", width:"100%", objectFit:"cover" }}/>
          )}
        <input name="posterImage" type="file" onChange={handleFileUpload} />
        </div>

        <div className="form-group">
          <label htmlFor="">Title</label>
          <input name="name" type="text" value={eventData.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="">Main Objective</label>
          <textarea name="mainObjective" maxLength={250} value={eventData.mainObjective} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="">Description</label>
          <textarea name="description" maxLength={2000} value={eventData.description} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="">Date</label>
          <input name="date" type="date" value={eventData.date} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="">Time</label>
          <input name="time" type="time" value={eventData.time} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="">Address</label>
          <input name="address" type="text" value={eventData.address} onChange={handleChange} />
          <button type="button" onClick={() => getCoordinates(eventData.address)}>Obtain coordinates</button>
        </div>

        <div className="form-group">
          <label htmlFor="">Category</label>
          <select name="category" value={eventData.category} onChange={handleChange}>
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
          <label htmlFor="">Capacity</label>
          <input name="capacity" type="number" value={eventData.capacity} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="">Price</label>
          <input name="price" type="number" value={eventData.price} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="">Add a lecturer</label>
          <input type="text" />
        </div>

        <div className="form-group">
          <label htmlFor="">Related project:</label>
          <select name="relatedProjects" value={eventData.relatedProjects} onChange={handleChange}>
            <option value="">Select a project</option>
            {loggedUserProjects.map((eachProject) => (
              <option key={eachProject._id} value={eachProject._id}>
                {eachProject.title}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-button">Save changes</button>
        
        {showConfirmation && (
          <div className="confirmation-message">
            Event edited successfully!
          </div>
        )}
      </form>
    </div>
  );
}

export default EditEvent;
