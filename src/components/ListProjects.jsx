import { useState, useEffect } from "react";
import service from "../services/config.js";
import CardProject from "./CardProject.jsx";
import { useNavigate } from "react-router-dom";

function ListProjects(props) {
  const navigate = useNavigate()
  const [allProjects, setAllProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);  // Página actual
  const projectsPerPage = 9;  // Número de proyectos por página

  const { searchValue, categoryFilter } = props;

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await service.get(`/project/`);
      setAllProjects(response.data);
    } catch (error) {
      console.log(error);
      navigate("/error")
    }
  };

  // Filtrar los proyectos según búsqueda y categoría
  const filteredProjects = allProjects.filter((eachProject) => {
    const matchesSearch = eachProject.title.toLowerCase().includes(searchValue.toLowerCase());
    const matchesCategory = categoryFilter === "All" || eachProject.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calcular el número total de páginas
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  // Obtener los proyectos que se mostrarán en la página actual
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  // Funciones para cambiar de página
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div>

      <div className="project-list">
        {currentProjects.map((eachProject) => {
          return (
            <CardProject key={eachProject._id} allProjects={allProjects} {...eachProject} />
          );
        })}
      </div>

      {/* Controles de paginación */}
      <div className="pagination-controls">
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
          Previous
        </button>

        <span>Page {currentPage} of {totalPages}</span>

        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>

  );
}

export default ListProjects;
