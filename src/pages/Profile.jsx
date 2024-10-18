/* import { useState, useEffect } from "react";
import service from "../services/config.js";

function Profile() {

  const [dataLoggedUser, setDataLoggedUser] = useState(null)

  useEffect(()=>{
    getData()
  }, [])

  const getData = async () =>{
    try {
      const response = await service.get("/user/:userid")
      console.log("response", response)
      setDataLoggedUser(response.data.message)
    } catch (error) {
      console.log(error)
    }
  }

  //! Gestor de Loading

  return (
    <div>
      <h1>
      ☣️ SUPER PRIVATE INFO!!!
      </h1>
      <p>{dataLoggedUser}</p>
    </div>
  )
}

export default Profile */