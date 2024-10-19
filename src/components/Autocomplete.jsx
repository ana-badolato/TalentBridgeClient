import { useEffect, useState } from "react"
import service from "../services/config.js";

function Autocomplete() {
  
  const [allUsers, setAllUsers] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [filteredUsers, setFilteredUsers] = useState([])
  
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

  const handleInputChange = (event) =>{
    setInputValue(event.target.value)
    const usersFiltered = allUsers.filter((eachUser) =>{
      return eachUser.username.toLowerCase().includes(event.target.value.toLowerCase())
    })
    setFilteredUsers(usersFiltered)
  }
  
  return (
    <div>
      <label htmlFor="teamMember"> Add a new team member:</label>
      <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Write their name" />
      {filteredUsers.length > 0 && (
        <select>
          {filteredUsers.map((eachUser, i)=>(
            <option key={i} value={eachUser.username}>
              {eachUser.username}
            </option>
          ))}
        </select>
      )}

    </div>
  )
}

export default Autocomplete