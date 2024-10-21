import { useState } from "react"
import SearchBar from "../components/SearchBar"
import ListEvents from "../components/ListEvents.jsx"

function AllEvents() {

  const [searchValue, setSearchValue]=useState("")

  return (
    <div className="container-page">
      <div className="container-main-content">
      <h3>ALL EVENTS</h3>
      <SearchBar searchValue={searchValue} setSearchValue={setSearchValue}/>
      <ListEvents searchValue={searchValue}/>
    </div>
    </div>
  )
}

export default AllEvents