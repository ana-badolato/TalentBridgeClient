import { useState, useEffect } from "react";
import service from "../services/config.js";

function Profile() {


  const [dataLoggedUser, setDataLoggedUser] = useState(null)

  useEffect(()=>{
    getData()
  }, [])

  const getData = async () =>{
    try {
      const response = await service.get("/auth/user/profile")
      console.log(response)
      setDataLoggedUser(response.data.message)
    } catch (error) {
      console.log(error)
    }
  }



//! Animación de carga aquí?
/*   if(!dataLoggedUser) {
    return <h3>Access Denied</h3>
  }
   */
  return (
    <div>
      <h1>
      ☣️ SUPER PRIVATE INFO!!!
      </h1>
      <p>{dataLoggedUser}</p>
    </div>
  )
}

export default Profile