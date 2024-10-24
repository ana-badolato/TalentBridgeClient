import { createContext, useState, useEffect } from "react"
import service from "../services/config"
import { FadeLoader } from "react-spinners";

const AuthContext = createContext()

function AuthWrapper(props) {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loggedUserId, setLoggedUserId] = useState(null)
  const [isValidatingToken, setIsValidatingToken] = useState(true)
  const [username, setUsername] = useState(""); // Nuevo estado para almacenar el nombre de usuario
  const [profilePicture, setProfilePicture] = useState(""); // Nuevo estado para almacenar la imagen de perfil
  const [contactEmail, setContactEmail] = useState("")

  useEffect(()=>{
    authenticateUser()
  }, [])
  
  const authenticateUser = async () =>{
    try {
      const response = await service.get("/auth/verify")
      console.log(response)
      setIsLoggedIn(true)
      setLoggedUserId(response.data._id)
      setUsername(response.data.username); // Guardamos el username del usuario
      setProfilePicture(response.data.profilePicture); // 
      setIsValidatingToken(false)
      setContactEmail(response.data.contactEmail)

    } catch (error) {
      console.log(error)
      setIsLoggedIn(false)
      setLoggedUserId(null)
      setIsValidatingToken(false)
      setUsername(""); // Limpiamos el username si no hay sesión
      setProfilePicture(""); // Limpiamos la imagen si no hay sesión
    }
  }
  
  const passedContext = {
    isLoggedIn,
    loggedUserId,
    username,
    profilePicture,
    contactEmail,
    authenticateUser
  }

  if (isValidatingToken) {
    return(
      <>
        <h4>...validating token</h4>
        <FadeLoader color="#FFBE1A" />
      </>
    )
  }
  
  return (
    <AuthContext.Provider value={passedContext}>
      {props.children}
    </AuthContext.Provider>
  )
}

export{
  AuthContext,
  AuthWrapper
}
  