import { useState, useEffect } from "react";
import service from "../services/config.js";
import CardUser from "./CardUser.jsx"
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination.jsx";
function ListUser(props) {
  const navigate = useNavigate()
  const [allUsers, setAllUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = props.usersPerPage || 12;  // Número de proyectos por página (por defecto 9)

  const {searchValue} = props

  useEffect(()=>{
    getData()
  }, [])
  
  const getData = async () => {
    try {
      const response = await service.get("/user/")
      //console.log("response", response)
      setAllUsers(response.data)
    } catch (error) {
      console.log(error)
      navigate("/error")
    }
  }

  // filtrar los usuarios segun el valor de la búsqueda
  const searchedUsers = allUsers.filter((eachUser) =>{
    return eachUser.username.toLowerCase().includes(searchValue.toLowerCase())
  })

  // Calcular el número total de páginas
  const totalPages = Math.ceil(searchedUsers.length / usersPerPage);

  // Obtener los proyectos que se mostrarán en la página actual
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = searchedUsers.slice(indexOfFirstUser, indexOfLastUser);



  // Función para cambiar de página
  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
    <div className="user-list">
        {currentUsers.map((eachUser)=>{
          return (
            <CardUser key={eachUser._id} {...eachUser}/>
          )
        })}
    </div>

<Pagination
currentPage={currentPage}
totalPages={totalPages}
onPageChange={onPageChange}
nextLabel=">"         // Usa directamente el símbolo de mayor que
prevLabel="<"     // Usa directamente el símbolo de menor que
className="custom-pagination"  // Clase CSS personalizada para la paginación
/>
    </div>
  )
}

export default ListUser