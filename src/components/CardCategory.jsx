import "../App.css";
import "../CSS/home.css";
import "../CSS/category.css";

import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import service from "../services/config.js";
import CardProject from "./CardProject";
import CallToAction from "./CallToAction.jsx";
import CardEvent from "./CardEvent";
import NoContentBox from "./NoContentBox";  // Importamos el componente NoContentBox
import Pagination from "./Pagination";  // Importamos el componente de paginación
import { AuthContext } from "../context/auth.context.jsx";

// images
import tech from "../assets/icons/tech.svg";
import sustainability from "../assets/icons/sustainability.svg";
import art from "../assets/icons/art.svg";
import community from "../assets/icons/community.svg";
import education from "../assets/icons/education.svg";
import health from "../assets/icons/health.svg";

import techHeader from "../assets/images/headers/techHeader.svg";
import artHeader from "../assets/images/headers/artHeader.svg";
import communityHeader from "../assets/images/headers/communityHeader.svg";
import educationHeader from "../assets/images/headers/educationHeader.svg";
import sustainabilityHeader from "../assets/images/headers/sustainabilityHeader.svg";
import healthHeader from "../assets/images/headers/healthHeader.svg";
import SearchBar from "./SearchBar.jsx";
import addImg from "../assets/icons/add.svg";

function CardCategory() {
  const params = useParams();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [categoryProjects, setCategoryProjects] = useState([]);
  const [categoryEvents, setCategoryEvents] = useState([]);

  // Paginación para proyectos y eventos
  const [currentProjectPage, setCurrentProjectPage] = useState(1);
  const projectsPerPage = 6;  // Mostramos 6 proyectos por página

  const [currentEventPage, setCurrentEventPage] = useState(1);
  const eventsPerPage = 8;  // Mostramos 8 eventos por página

  useEffect(() => {
    getData();
  }, [params.category]);

  const getData = async () => {
    try {
      const responseProjects = await service.get(`/project/category/${params.category}`);
      setCategoryProjects(responseProjects.data);

      const responseEvents = await service.get(`/event/category/${params.category}`);
      setCategoryEvents(responseEvents.data);
    } catch (error) {
      console.log(error);
      navigate("/error");
    }
  };

  const handleOnClick = (category) => {
    navigate(`/category/${category}`);
  };

  // Mapeo de imágenes de cabecera
  const headerImages = {
    "Technology & Innovation": techHeader,
    "Sustainability & Environment": sustainabilityHeader,
    "Art & Creativity": artHeader,
    "Health & Wellness": healthHeader,
    "Education & Training": educationHeader,
    "Community & Social Impact": communityHeader,
  };

  const headerImage = headerImages[params.category] || null;
  const { isLoggedIn } = useContext(AuthContext);

  // Lógica de paginación para proyectos
  const totalProjectPages = Math.ceil(categoryProjects.length / projectsPerPage);
  const indexOfLastProject = currentProjectPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = categoryProjects.slice(indexOfFirstProject, indexOfLastProject);

  // Lógica de paginación para eventos
  const totalEventPages = Math.ceil(categoryEvents.length / eventsPerPage);
  const indexOfLastEvent = currentEventPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = categoryEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  return (
    <div className="container-page">
      <div className="container-main-content">
        <div className="filters"></div>
        <section>
          {headerImage && (
            <div className="header-category">
              <img
                src={headerImage}
                alt={params.category}
                className="header-img-category"
              />
              <h2 className="title-category">{params.category}</h2>
            </div>
          )}
        </section>

        <div className="index-categories">
          {/* Botones de categorías */}
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
              Sustainability &<span style={{ display: "block" }}>Environment</span>
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

        <hr className="hr-thin-light" style={{ marginBottom: "24px", marginTop: "48px" }} />
        <div className="filter-group half-width-search">
          <SearchBar
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </div>

        {/* Sección de proyectos */}
        <h2 className="index-title">Projects</h2>
        {currentProjects.length === 0 ? (
          <NoContentBox />  // Mostramos NoContentBox si no hay proyectos
        ) : (
          <div className="main-section-index">
            <section style={{ marginTop: "32px" }} className="project-list">
              {currentProjects.map((eachProject) => {
                return <CardProject key={eachProject._id} {...eachProject} />;
              })}
            </section>
            <Pagination
              currentPage={currentProjectPage}
              totalPages={totalProjectPages}
              onPageChange={setCurrentProjectPage}
              nextLabel=">"
              prevLabel="<"
              className="custom-pagination"
            />
          </div>
        )}

        {/* Sección de eventos */}
        <h2 className="index-title">Events</h2>
        {currentEvents.length === 0 ? (
          <NoContentBox />  // Mostramos NoContentBox si no hay eventos
        ) : (
          <div className="main-section-index">
            <section style={{ marginTop: "32px" }} className="event-list">
              {currentEvents.map((eachEvent) => {
                return <CardEvent key={eachEvent._id} {...eachEvent} />;
              })}
            </section>
            <Pagination
              currentPage={currentEventPage}
              totalPages={totalEventPages}
              onPageChange={setCurrentEventPage}
              nextLabel=">"
              prevLabel="<"
              className="custom-pagination"
            />
          </div>
        )}

        <CallToAction />
      </div>
      {isLoggedIn && (
        <div
          className="buttons-fixed"
          style={{ position: "fixed", bottom: "64px", right: "32px" }}
        >
          <Link to="/newproject">
            <div className="add-project-container">
              <button
                className="button-large-blue"
                style={{
                  width: "130px",
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

export default CardCategory;
