import { useState } from "react";
import SearchBar from "../components/SearchBar";
import ListProjects from "../components/ListProjects";
import Filter from "../components/Filter";

import projectsImg from "../assets/icons/projects.svg"

function AllProjects() {

  const [searchValue, setSearchValue] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")

  return (
    <div className="container-page">
      <div className="container-main-content">
      <section>
        
          <div className="header-category">
            <img src={projectsImg} alt="projects" className="header-img-category"/>
            <h2 className="title-category">All Projects</h2>
          </div>
        
      </section>


      
      <SearchBar searchValue={searchValue} setSearchValue={setSearchValue}/>
      <Filter categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}/>
      <ListProjects searchValue={searchValue} categoryFilter={categoryFilter} />
    </div>
    </div>
  )
}

export default AllProjects