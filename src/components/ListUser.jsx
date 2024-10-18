import { useState, useEffect } from "react";
import service from "../services/config.js";
import CardUser from "./CardUser.jsx"

function ListUser() {
  const [allUsers, setAllUsers] = useState([])

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

  return (
    <div>
      <p>Talent page</p>
        {allUsers.map((eachUser)=>{
          return (
            <CardUser key={eachUser._id} allUsers={allUsers} {...eachUser}/>
          )
        })}
    </div>
  )
}

export default ListUser
