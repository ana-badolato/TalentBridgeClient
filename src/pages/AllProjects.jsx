import { useState } from "react";
import SearchBar from "../components/SearchBar";
import ListProjects from "../components/ListProjects";
import Filter from "../components/Filter";

function AllProjects() {

  const [searchValue, setSearchValue] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")

  return (
    <div className="container-page">
      <div className="container-main-content">
      <h3>ALL PROJECTS</h3>
      <SearchBar searchValue={searchValue} setSearchValue={setSearchValue}/>
      <Filter categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}/>
      <ListProjects searchValue={searchValue} categoryFilter={categoryFilter} />
    </div>
    </div>
  )
}

export default AllProjects