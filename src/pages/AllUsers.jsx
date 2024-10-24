import { useState, useContext } from "react";
import ListUser from "../components/ListUser.jsx"
import SearchBar from "../components/SearchBar.jsx"
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context.jsx";
import addImg from "../assets/icons/add.svg";
import usersImg from "../assets/icons/talent.svg"

function AllUsers() {
  
  const [searchValue, setSearchValue] = useState("")
  const { isLoggedIn, loggedUserId } = useContext(AuthContext);

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
    {isLoggedIn && (
  <div className="buttons-fixed" style={{position:"fixed", bottom:"64px", right:"32px"}}>
    {/* Botón "Add Project" */}
    <Link to="/newproject">
      <div className="add-project-container">
        <button className="button-large-blue" style={{width:"130px", marginBottom:"-16px", boxShadow:"0px 4px 10px rgba(200, 200, 200, 0.2)"}}>
          <div className="icon-text-element">
            <img src={addImg} alt="" />
            <p>Add Project</p>
          </div>
        </button>
      </div>
    </Link>

    {/* Botón "Add Event" */}
    <Link to="/newevent">
      <div className="add-event-container">
        <button className="button-large-blue" style={{width:"130px", boxShadow:"0px 4px 10px rgba(200, 200, 200, 0.2)"}} >
          <div className="icon-text-element" style={{display:"flex", alignItems:"center"}}>
            <img src={addImg} alt="" />
            <p>Add Event</p>
          </div>
        </button>
      </div>
    </Link>
  </div>
)}
     </div>
  )
}

export default AllUsers