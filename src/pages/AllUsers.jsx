import { useState } from "react";
import ListUser from "../components/ListUser.jsx"
import SearchBar from "../components/SearchBar.jsx"

function AllUsers() {
  
  const [searchValue, setSearchValue] = useState("")


  return (
    <div className="container-page">
      <div className="container-main-content">
      <SearchBar searchValue={searchValue} setSearchValue={setSearchValue}/>
      <ListUser searchValue={searchValue}/> {/*Solo pasamos el valor de la búsqueda */}
    </div>
     </div>
  )
}

export default AllUsers