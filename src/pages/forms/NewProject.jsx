import { useContext, useState } from "react";
import Autocomplete from "../../components/Autocomplete";
import { AuthContext } from "../../context/auth.context";
import { useNavigate } from "react-router-dom";
import service from "../../services/config";

function NewProject() {

  // Usamos el contexto para obtener el ID del usuario que está logueado
  const { loggedUserId } = useContext(AuthContext);

  const [projectData, setProjectData] = useState({
    title: "",
    mainObjective:"",
    description: "",
    location: "",
    image:"",
    category:"",
    owner: loggedUserId,
    teamMembers: []
  })

  // Estado para mostrar un mensaje de confirmación cuando guardamos cambios
  const [showConfirmation, setShowConfirmation] = useState(false);

  // manejo de los cambios en el formulario
  const handleChange = (e) =>{
    const {name, value} = e.target
    //actualizar las propiedades del nuevo proyecto con los valores escritos por el usuario
    setProjectData((prevData) =>({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const {title, mainObjective, description, location, image, category, owner, teamMembers} = projectData
    //recopilar la data del nuevo proyecto
    const newProject ={
      title,
      mainObjective,
      description,
      location,
      image,
      category,
      owner,
      teamMembers
    }

    try {
      //llamar al servidor para crearlo
      await service.post("/project/", newProject)
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
        <h3>New Project</h3>
        <div>
          <label htmlFor="">Title: </label>
          <input name="title" type="text" placeholder="Development of a Mobile App" value={projectData.title} onChange={handleChange}/>
        </div>

        <div>
          <label htmlFor="">Main Objective</label>
          <textarea name="mainObjective" type="text" maxLength={250} placeholder="Create an easy-to-use solution for financial management." value={projectData.mainObjective} onChange={handleChange}/>
        </div>

        <div>
          <label htmlFor="">Description</label>
          <textarea name="description" maxLength={2000} placeholder="A mobile application that helps users manage their personal finances, allowing them to track their income and expenses." value={projectData.description} onChange={handleChange}/>
        </div>

        <div>
          <label htmlFor="">Location</label>
          <input name="location" type="text" placeholder="Barcelona, Spain" value={projectData.location} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="">Image</label>
          <input name="image" type="text" placeholder="Place here your URL" value={projectData.image} onChange={handleChange}/>
        </div>

        <div>
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

        <div>
          {<Autocomplete/>} 
        </div>

      <button type="submit">New project</button>

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
