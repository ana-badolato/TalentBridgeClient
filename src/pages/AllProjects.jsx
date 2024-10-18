import { useState } from "react";
import SearchBar from "../components/SearchBar";
import ListProjects from "../components/ListProjects";

function AllProjects() {

  const [searchValue, setSearchValue] = useState("")

  return (
    <div>
      <h3>ALL PROJECTS</h3>
      <SearchBar searchValue={searchValue} setSearchValue={setSearchValue}/>
      <ListProjects searchValue={searchValue}/>
    </div>
  )
}

export default AllProjects