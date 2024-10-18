import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/auth.context.jsx"
import service from "../../services/config.js";


function LogIn() {

  const navigate = useNavigate();
  const { authenticateUser } = useContext(AuthContext)

  const [accountEmail, setAccountEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  
  const handleAccountEmail = (e) => {
    setAccountEmail(e.target.value)
  }

  const handlePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleLogIn = async (e) => {
    e.preventDefault()

    try {
      const userCredentials = {
        accountEmail,
        password
      }

      const response = await service.post("/auth/login", userCredentials)

      console.log(response)
      localStorage.setItem("authToken", response.data.authToken)

      await authenticateUser()
      navigate("/")

    } catch (error) {
      console.log(error)
      if (error.response.status === 400){
        setErrorMessage(error.response.data.message)
      }else{
        navigate("/error")
      }
    }
  }
  
  return (
    <div>LogIn

    <form onSubmit={handleLogIn}>
      <div>
        <label> Email</label>
        <input
          type="email"
          name="accountEmail"
          value={accountEmail}
          onChange={handleAccountEmail}
        />
      </div>

      <div>
        <label>password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
          />
      </div>

    <button type="submit">Log in</button>
    {errorMessage && <p>{errorMessage}</p>}
    </form>


    </div>
  )
}

export default LogIn