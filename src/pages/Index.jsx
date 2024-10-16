import { useState, useEffect } from "react";
import service from "../services/config.js";
import CardUser from "../components/CardUser.jsx";

function Index() {

  const [allUsers, setAllUsers] = useState([])

  useEffect(()=>{
    getData()
  }, [])
  
  const getData = async () => {
    try {
      const response = await service.get("/user/")
      // console.log("response", response)
      setAllUsers(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
        {allUsers.map((eachUser)=>{
          return (
            //! modificar este componente por el de sectionTalent
            <CardUser key={eachUser._id} allUsers={allUsers} {...eachUser}/>
          )
        })}
    </div>
  )
}

export default Index