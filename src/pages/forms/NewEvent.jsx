import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import service from "../../services/config";
import axios from "axios";

function NewEvent() {

  const { loggedUserId } = useContext(AuthContext);
console.log("Logged User ID:", loggedUserId);
const [uploadingImage, setUploadingImage] = useState(false);
  const [eventData, setEventData] =useState({
    name: "",
    mainObjective: "",
    description: "",
    date:"",
    time:"",
    address:"",
    location: {lat: null, lng: null},
    category: "",
    capacity: 20,
    price: 0,
    posterImage: "",
    owner: loggedUserId,
    lecturer: [],
    atendees: [],
    relatedProjects: ""
  })

    // Estado para mostrar un mensaje de confirmación cuando guardamos cambios
    const [showConfirmation, setShowConfirmation] = useState(false);

    // manejo de los cambios en el formulario
    const handleChange = async (e) =>{
      const {name, value} = e.target

      //actualizar las propiedades del nuevo proyecto con los valores escritos por el usuario
      setEventData((prevData) =>({
        ...prevData,
        [name]: value,
      }))
    }

    // Función para obtener las coordenadas de una dirección
  const getCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0]; // Tomar la primera coincidencia
        setEventData((prevData) => ({
          ...prevData,
          location: { lat: parseFloat(lat), lng: parseFloat(lon) } // Actualiza las coordenadas
        }));
      } else {
        console.log("No coordinates found for the address.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

   
    // //estado donde almacenar los proyectos del usuario
    const [loggedUserProjects, setLoggedUserProjects] = useState([])
    useEffect(() => {
      const fetchUserProjects = async () => {
        if (!loggedUserId) {
          console.log("No valid loggedUserId found");
          return; // No hacer nada si no hay un ID de usuario válido
        }
    
        try {
          console.log("Logged User ID:", loggedUserId);
          const response = await service.get(`project/user/projectsuser`);
          setLoggedUserProjects(response.data);
        } catch (error) {
          console.log("Error fetching user projects:", error);
        }
      };
    
      fetchUserProjects();
    }, [loggedUserId]);
    
    const handleImageUpload = async (e) => {
      const file = e.target.files[0]; // Obtiene el archivo seleccionado
      if (!file) return;
  
      const formData = new FormData(); // Crea un objeto FormData
      formData.append("file", file);
      formData.append("upload_preset", "s9t7p5jy"); // El "preset" de Cloudinary
  
      setUploadingImage(true); // Indica que la carga está en proceso
  
      try {
          const response = await axios.post(
              "https://api.cloudinary.com/v1_1/dvfrtqmex/image/upload", // URL de Cloudinary
              formData
          );
          const imageUrl = response.data.secure_url; // URL de la imagen subida
          setEventData((prevData) => ({
              ...prevData,
              posterImage: imageUrl, // Actualiza el estado con la URL de la imagen
          }));
          setUploadingImage(false); // Indica que la carga ha terminado
      } catch (error) {
          console.error("Error uploading image:", error);
          setUploadingImage(false);
      }
  };

    const handleSubmit = async (e) =>{
      e.preventDefault()

      const {name, mainObjective, description, date, time, address, location, category, capacity, price, posterImage, owner, lecturer, atendees, relatedProjects} = eventData

      const newEvent = {
        name,
        mainObjective,
        description,
        date,
        time,
        address,
        location,
        category,
        capacity,
        price,
        posterImage,
        owner,
        lecturer,
        atendees,
        relatedProjects: relatedProjects || null
      }
      console.log("Event Data to be sent:", newEvent);

      try {
        //llamar al servidor para crearlo
        await service.post("/event/", newEvent)
        //una vez entregado el nuevo proyecto, mostrar el mensaje
        setShowConfirmation(true); // Mostramos el mensaje de confirmación
        setTimeout(() => {
          setShowConfirmation(false); // Ocultamos el mensaje después de 3 segundos
        }, 3000);
      } catch (error) {
        console.log(error)
      }
    }

  return (
    <div>
      <form onSubmit={handleSubmit}>
      <div>
          <label htmlFor="">Poster Image</label>
          <input name="posterImage" type="file" onChange={handleImageUpload} />
          {uploadingImage && <p>Uploading...</p>}
          {eventData.posterImage && ( // Mostrar la imagen actual si existe
            <img src={eventData.posterImage} alt="Uploaded" style={{ width: '200px', height: 'auto', marginTop: '10px' }} />
          )}
        </div>
        <div>
          <label htmlFor="">Title</label>
          <input name="name" type="text" value={eventData.name} onChange={handleChange}/>
        </div>

        <div>
          <label htmlFor="">Main Objective</label>
          <textarea name="mainObjective" type="text" maxLength={250} value={eventData.mainObjective} onChange={handleChange}/>
        </div>

        <div>
          <label htmlFor="">Description</label>
          <textarea name="description" maxLength={2000} value={eventData.description} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="">Date</label>
          <input name="date" type="date" value={eventData.date} onChange={handleChange}/>
        </div>

        <div>
          <label htmlFor="">Time</label>
          <input name="time" type="time" value={eventData.time} onChange={handleChange}/>
        </div>

          <div>
          <label htmlFor="">Address</label>
          <input name="address" type="text" value={eventData.address} onChange={handleChange} />
          <button type="button" onClick={() => getCoordinates(eventData.address)}>Obtain coordinates</button>
        </div>

        <div>
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

        <div>
          <label htmlFor="">Capacity</label>
          <input name="capacity" type="number" value={eventData.capacity} onChange={handleChange}/>
        </div>

        <div>
          <label htmlFor="">Price</label>
          <input name="price" type="number" value={eventData.price} onChange={handleChange}/>
        </div>


        <div>
          <label htmlFor="">Add a lecturer</label>
          <input type="text" />
        </div>

        <div>
          <label htmlFor="">Related project:</label>
          <select name="relatedProjects" value={eventData.relatedProjects} onChange={handleChange}>
            <option value="">Select a project</option>
            {loggedUserProjects.map((eachProject) =>{
              return(
              <option key={eachProject._id} value={eachProject._id}>
                {eachProject.title}
              </option>)
            })}
          </select>
        </div>

      <button type="submit">Create event</button>
      {showConfirmation && (
            <div className="confirmation-message">
              Event created successfully!
            </div>
          )}
      </form>
    </div>
  );
}

export default NewEvent;
