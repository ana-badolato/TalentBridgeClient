import { useState } from "react";
import ListUser from "../components/ListUser.jsx"
import SearchBar from "../components/SearchBar.jsx"

function AllUsers() {
  
  const [searchValue, setSearchValue] = useState("")


  return (
    <div>
      <h3>ALL USERS</h3>
      <SearchBar searchValue={searchValue} setSearchValue={setSearchValue}/>
      <ListUser searchValue={searchValue}/> {/*Solo pasamos el valor de la búsqueda */}
    </div>
  )
}

export default AllUsers