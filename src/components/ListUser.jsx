import { useState, useEffect } from "react";
import service from "../services/config.js";
import CardUser from "./CardUser.jsx"

function ListUser(props) {
  const [allUsers, setAllUsers] = useState([])
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
    }
  }

  // filtrar los usuarios segun el valor de la búsqueda
  const searchedUsers = allUsers.filter((eachUser) =>{
    return eachUser.username.toLowerCase().includes(searchValue.toLowerCase())
  })

  return (
    <div className="user-list">
        {searchedUsers.map((eachUser)=>{
          return (
            <CardUser key={eachUser._id} {...eachUser}/>
          )
        })}
    </div>
  )
}

export default ListUser