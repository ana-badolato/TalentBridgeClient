import "../App.css";
import "../CSS/index.css";

//images
import tech from "../assets/icons/tech.svg";
import sustainability from "../assets/icons/sustainability.svg";
import art from "../assets/icons/art.svg";
import community from "../assets/icons/community.svg";
import education from "../assets/icons/education.svg";
import health from "../assets/icons/health.svg";

import { useState, useEffect } from "react";
import service from "../services/config.js";
import CardProject from "../components/CardProject.jsx";
import CardEvent from "../components/CardEvent.jsx"; // Asegúrate de que este componente esté en la ruta correcta
import { useNavigate } from "react-router-dom";

function Index() {
  const navigate = useNavigate();
  const [allProjects, setAllProjects] = useState([]);
  const [randomProjects, setRandomProjects] = useState([]); // Estado para los 6 proyectos aleatorios
  const [upcomingEvents, setUpcomingEvents] = useState([])

  useEffect(() => {
    getData();
    getEvents()
  }, []);

  const getData = async () => {
    try {
      const response = await service.get("/project/"); // Asegúrate de que esta ruta esté bien configurada
      setAllProjects(response.data);

      // Llamar a la función para seleccionar 6 proyectos aleatorios
      selectRandomProjects(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Función para seleccionar 6 proyectos aleatorios
  const selectRandomProjects = (projects) => {
    let shuffled = projects.sort(() => 0.5 - Math.random()); // Mezcla el array de proyectos
    let selected = shuffled.slice(0, 6); // Selecciona los primeros 6 proyectos mezclados
    console.log(selected);
    setRandomProjects(selected); // Actualiza el estado con los proyectos seleccionados
  };

  const getEvents = async () =>{
    try {
      const events = await service.get("/event/")
      filterAndSortEvents(events.data)
    } catch (error) {
      console.log(error)
    }
  }

  //filtrar y ordenar eventos
  const filterAndSortEvents = (events) =>{
    const currentDate = new Date ()//fecha actual
    const upcoming = events
      .filter(eachEvent => new Date (eachEvent.date)>currentDate) // filtra solo eventos futuros
      .sort((a,b)=> new Date(a.date) - new Date(b.date)) //ordena por data ascendente
      .slice(0,6) //solo los 6 primeros
    setUpcomingEvents(upcoming)
  }

  const handleOnClick = (category) => {
    navigate(`/category/${category}`);
  };

  return (
    <div className="container-page">
      <div className="container-main-content">
        <header className="index-header">
          <h1>
            Search for <span className="aurora">projects</span> that inspire
            <span className="break-line">talent and innovation</span>
          </h1>
        </header>

        <div className="index-categories">
          {/* Aquí puedes añadir las categorías, filtros, etc */}
          <section>
            <button onClick={() => handleOnClick("Technology & Innovation")}>
              Technology & Innovation <img src={tech} />
            </button>
            <button onClick={() => handleOnClick("Sustainability & Environment")}>
              Sustainability & Environment <img src={sustainability} />
            </button>
            <button onClick={() => handleOnClick("Art & Creativity")}>
              Art & Creativity <img src={art} />
            </button>
            <button onClick={() => handleOnClick("Health & Wellness")}>
              Health & Wellness <img src={health} />
            </button>
            <button onClick={() => handleOnClick("Education & Training")}>
              Education & Training <img src={education} />
            </button>
            <button onClick={() => handleOnClick("Community & Social Impact")}>
              Community & Social Impact <img src={community} />
            </button>
          </section>
        </div>
        <h2 className="index-title">Projects</h2>
        <section className="project-list">
          {randomProjects.map((eachProject) => (
            <CardProject key={eachProject._id} {...eachProject} />
          ))}
        </section>

        <section>
          <h2 className="index-title">Upcoming Events</h2>
          <div>
            {upcomingEvents.map((eachEvent) =>(
              <CardEvent key={eachEvent._id} {...eachEvent}/>
            ))}
          </div>
    

        </section>
      </div>
    </div>
  );
}

export default Index;
