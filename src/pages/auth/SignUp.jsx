import service from "../../services/config";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {

  const navigate = useNavigate()

  const [accountEmail, setAccountEmail] = useState("")
  const [username, setUsername] = useState ("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleAccountEmail = (e) =>{
    setAccountEmail(e.target.value)
  }

  const handleUsername = (e) =>{
    setUsername(e.target.value)
  }

  const handlePassword = (e) =>{
    setPassword (e.target.value)
  }

  const handleSignUp = async (e) =>{
    e.preventDefault()

    try {
      
      const newUser= {
        accountEmail,
        password,
        username
      }
      console.log("New user data:", newUser);
      await service.post("/auth/signup", newUser)

      navigate("/login")

    } catch (error) {
      console.log(error)
      if (error.response.status === 400){
        setErrorMessage(error.response.data.message)
      }else {
        navigate("/error")
      }
    }
  }

  return (
    <div> 
      <h3>Join our talents!</h3>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="accountEmail"
            value={accountEmail}
            onChange={handleAccountEmail}
          />
        </div>

      <form onSubmit={handleSignUp}>
        <div>
          <label htmlFor="">Username</label>
          <input
            type="username"
            name="username"
            value={username}
            onChange={handleUsername}
          />
        </div>

        <div>
          <label htmlFor="">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePassword}
          />
        </div>

        <button type="submit">Sign Up</button>
        {errorMessage && <p>{errorMessage}</p>}
      </form>

    <p>Already have an account?</p>
      <p>Go to <Link to="/login" style={{color: "#FFBE1A"}}> Log In</Link></p>

    </div>
  )
}

export default SignUp