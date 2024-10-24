import { useState } from "react";
import ListUser from "../components/ListUser.jsx"
import SearchBar from "../components/SearchBar.jsx"

import usersImg from "../assets/icons/talent.svg"

function AllUsers() {
  
  const [searchValue, setSearchValue] = useState("")


  return (
    <div className="container-page">
      <div className="container-main-content">
      <section>
        
        <div className="header-category">
          <img src={usersImg} alt="projects" className="header-img-category"/>
          <h2 className="title-category">All Talents</h2>
        </div>
      
    </section>
      <SearchBar searchValue={searchValue} setSearchValue={setSearchValue}/>
      <ListUser searchValue={searchValue}/> {/*Solo pasamos el valor de la búsqueda */}
    </div>
     </div>
  )
}

export default AllUsers