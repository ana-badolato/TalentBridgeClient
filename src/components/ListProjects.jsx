import { useState, useEffect } from "react";
import service from "../services/config.js";
import CardProject from "./CardProject.jsx";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination.jsx";

function ListProjects(props) {
  const navigate = useNavigate()
  const [allProjects, setAllProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const projectsPerPage = props.projectsPerPage || 9;  // Número de proyectos por página (por defecto 9)

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

  // Función para cambiar de página
  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      {/* Renderizando los proyectos */}
      <div className="project-list">
        {currentProjects.map((eachProject) => (
          <CardProject key={eachProject._id} allProjects={allProjects} {...eachProject} />
        ))}
      </div>

      {/* Asegurándome de llamar al componente de Paginación */}
      <Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={onPageChange}
  nextLabel=">"         // Usa directamente el símbolo de mayor que
  prevLabel="<"     // Usa directamente el símbolo de menor que
  className="custom-pagination"  // Clase CSS personalizada para la paginación
/>
    </div>
  );
}

export default ListProjects;
