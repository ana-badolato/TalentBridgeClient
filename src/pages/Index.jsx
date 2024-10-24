import "../App.css";
import "../CSS/home.css";

//images
import tech from "../assets/icons/tech.svg";
import sustainability from "../assets/icons/sustainability.svg";
import art from "../assets/icons/art.svg";
import community from "../assets/icons/community.svg";
import education from "../assets/icons/education.svg";
import health from "../assets/icons/health.svg";
import CallToAction from "../components/CallToAction.jsx";
import CallToActionLogged from "../components/CallToActionLogged.jsx";
import { useState, useEffect, useContext } from "react";
import service from "../services/config.js";
import CardProject from "../components/CardProject.jsx";
import CardEvent from "../components/CardEvent.jsx";
import { AuthContext } from "../context/auth.context.jsx";
import { Link, useNavigate } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader"; // Asegúrate de que tienes instalado 'react-spinners'
import SectionTalent from "../components/SectionTalent.jsx";

import addImg from "../assets/icons/add.svg";

function Index() {
  const navigate = useNavigate();
  const [allProjects, setAllProjects] = useState([]);
  const [randomProjects, setRandomProjects] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true); // Para manejar la carga de proyectos
  const [loadingEvents, setLoadingEvents] = useState(true); // Para manejar la carga de eventos
  const { isLoggedIn, loggedUserId } = useContext(AuthContext);
  useEffect(() => {
    getData();
    getEvents();
  }, []);

  const getData = async () => {
    try {
      const response = await service.get("/project/");
      setAllProjects(response.data);
      selectRandomProjects(response.data);
    } catch (error) {
      console.log(error);
      navigate("/error");
    }
    setLoadingProjects(false);
  };

  const selectRandomProjects = (projects) => {
    let shuffled = projects.sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, 6);
    setRandomProjects(selected);
  };

  const getEvents = async () => {
    try {
      const response = await service.get("/event/");
      filterAndSortEvents(response.data);
    } catch (error) {
      console.log("Error al obtener eventos:", error);
      navigate("/error");
    }
    setLoadingEvents(false);
  };

  const filterAndSortEvents = (events) => {
    const currentDate = new Date();
    const upcoming = events
      .filter((eachEvent) => new Date(eachEvent.date) > currentDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 6);

    setUpcomingEvents(upcoming);
  };

  const handleOnClick = (category) => {
    navigate(`/category/${category}`);
  };

  return (
    <div className="container-page">
      <div className="container-main-content">
        <header className="index-header">
          <h1>
            Building a future through{" "}
            <Link to="/user" className="aurora">
              talent
            </Link>
            ,{" "}
            <span className="break-line">
              one{" "}
              <Link to="/project" className="aurora">
                project
              </Link>{" "}
              and{" "}
              <Link to="/event" className="aurora">
                event
              </Link>{" "}
              at a time
            </span>
          </h1>
        </header>

        <div className="index-categories">
          <button
            onClick={() => handleOnClick("Technology & Innovation")}
            className="category-tag"
          >
            <p className="category-tag-content">
              Technology &<span style={{ display: "block" }}>Innovation</span>
            </p>
            <img src={tech} />
          </button>

          <button
            onClick={() => handleOnClick("Sustainability & Environment")}
            className="category-tag"
          >
            <p className="category-tag-content">
              Sustainability &
              <span style={{ display: "block" }}>Environment</span>
            </p>
            <img src={sustainability} />
          </button>

          <button
            onClick={() => handleOnClick("Art & Creativity")}
            className="category-tag"
          >
            <p className="category-tag-content">
              Art &<span style={{ display: "block" }}>Creativity</span>
            </p>
            <img src={art} />
          </button>

          <button
            onClick={() => handleOnClick("Health & Wellness")}
            className="category-tag"
          >
            <p className="category-tag-content">
              Health &<span style={{ display: "block" }}>Wellness</span>
            </p>
            <img src={health} />
          </button>

          <button
            onClick={() => handleOnClick("Education & Training")}
            className="category-tag"
          >
            <p className="category-tag-content">
              Education &<span style={{ display: "block" }}>Training</span>
            </p>
            <img src={education} />
          </button>

          <button
            onClick={() => handleOnClick("Community & Social Impact")}
            className="category-tag"
          >
            <p className="category-tag-content">
              Community &<span style={{ display: "block" }}>Social Impact</span>
            </p>
            <img src={community} />
          </button>
        </div>

        <h2 className="index-title">Projects</h2>
        <div className="main-section-index">
          <section className="project-list">
            {loadingProjects ? (
              <>
                <h4>...loading projects</h4>
                <FadeLoader color="#FFBE1A" />
              </>
            ) : (
              randomProjects.map((eachProject) => (
                <CardProject key={eachProject._id} {...eachProject} />
              ))
            )}
          </section>
          <Link to="/project">
            <p
              style={{
                fontWeight: "600",
                textDecoration: "underline",
                textAlign: "right",
              }}
            >
              See all &gt;
            </p>
          </Link>
        </div>

        <SectionTalent />

        <h2 className="index-title">Upcoming Events</h2>
        <div className="main-section-index"></div>
        <section className="event-list">
          {loadingEvents ? (
            <>
              <h4>...loading events</h4>
              <FadeLoader color="#FFBE1A" />
            </>
          ) : upcomingEvents.length > 0 ? (
            upcomingEvents.map((eachEvent) => (
              <CardEvent key={eachEvent._id} {...eachEvent} />
            ))
          ) : (
            <p>No upcoming events available</p>
          )}
        </section>
        <Link to="/event">
          <p
            style={{
              fontWeight: "600",
              textDecoration: "underline",
              textAlign: "right",
            }}
          >
            See all &gt;
          </p>
        </Link>
        {isLoggedIn ? <CallToActionLogged /> : <CallToAction />}
      </div>
      {isLoggedIn && (
        <div
          className="buttons-fixed"
          style={{ position: "fixed", bottom: "64px", right: "32px" }}
        >
          {/* Botón "Add Project" */}
          <Link to="/newproject">
            <div className="add-project-container">
              <button
                className="button-large-blue"
                style={{
                  width: "130px",
                  zIndex: "10",
                  marginBottom: "-16px",
                  boxShadow: "0px 4px 10px rgba(200, 200, 200, 0.2)",
                }}
              >
                <div className="icon-text-element">
                  <img src={addImg} alt="" />
                  <p>Add Project</p>
                </div>
              </button>
            </div>
          </Link>

          {/* Botón "Add Event" */}
          <Link to="/newevent">
            <div className="add-event-container">
              <button
                className="button-large-blue"
                style={{
                  width: "130px",
                  boxShadow: "0px 4px 10px rgba(200, 200, 200, 0.2)",
                }}
              >
                <div
                  className="icon-text-element"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <img src={addImg} alt="" />
                  <p>Add Event</p>
                </div>
              </button>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Index;
