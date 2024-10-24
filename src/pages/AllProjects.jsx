import { useState, useContext } from "react";
import SearchBar from "../components/SearchBar";
import ListProjects from "../components/ListProjects";
import Filter from "../components/Filter";
import addImg from "../assets/icons/add.svg";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context.jsx";
import projectsImg from "../assets/icons/projects.svg";
import CallToAction from "../components/CallToAction.jsx";
import CallToActionLogged from "../components/CallToActionLogged.jsx";

function AllProjects() {
  const [searchValue, setSearchValue] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const { isLoggedIn, loggedUserId } = useContext(AuthContext);
  return (
    <div className="container-page">
      <div className="container-main-content">
        <section>
          <div className="header-category">
            <img
              src={projectsImg}
              alt="projects"
              className="header-img-category"
            />
            <h2 className="title-category">All Projects</h2>
          </div>
        </section>
        <hr className="hr-thin-light" style={{ marginBottom: "24px" }} />

        <div className="filter-group">
          <SearchBar
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
          <Filter
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />
        </div>

        <ListProjects
          searchValue={searchValue}
          categoryFilter={categoryFilter}
        />
        {isLoggedIn ? <CallToActionLogged /> : <CallToAction />}
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

export default AllProjects;
