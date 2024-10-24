import { useState, useEffect } from "react";
import service from "../services/config.js";
import CardProject from "./CardProject.jsx";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination.jsx";
import NoContentBox from "./NoContentBox";

function ListProjects(props) {
  const navigate = useNavigate();
  const [allProjects, setAllProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = props.projectsPerPage || 9;

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
      navigate("/error");
    }
  };

  const filteredProjects = allProjects.filter((eachProject) => {
    const matchesSearch = eachProject.title
      .toLowerCase()
      .includes(searchValue.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || eachProject.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      {filteredProjects.length === 0 ? (
        <NoContentBox />
      ) : (
        <>
          <div className="project-list">
            {currentProjects.map((eachProject) => (
              <CardProject
                key={eachProject._id}
                allProjects={allProjects}
                {...eachProject}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            nextLabel=">"
            prevLabel="<"
            className="custom-pagination"
          />
        </>
      )}
    </div>
  );
}

export default ListProjects;
