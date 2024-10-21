import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import service from "../../services/config";


function NewEvent() {

  const { loggedUserId } = useContext(AuthContext);

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

   
    //estado donde almacenar los proyectos del usuario
    const [loggedUserProjects, setLoggedUserProjects] = useState([])

    useEffect(() =>{
      const fetchUserProjects = async () =>{
        try {
          const response = await service.get(`/project/user/${loggedUserId}`)
          setLoggedUserProjects(response.data)
        } catch (error) {
          console.log(error)
        }
      }
      fetchUserProjects()
    }, [loggedUserId])


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
        relatedProjects
      }

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
          <input name="address" type="text" value={eventData.address} onChange={handleChange}/>
          <button type="submit">Obtein coordinates</button>
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
          <label htmlFor="">Poster image</label>
          <input name="posterImage" type="text" value={eventData.posterImage} onChange={handleChange}/>
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

      <button>Create event</button>
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
