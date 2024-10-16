import service from "../../services/config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  
  const [accountEmail, setAccountEmail] = useState("")
  const [username, setUsername] = useState ("")
  const [password, setPassword] = useState("")

  const handleAccountEmailChange = (e) =>{
    setAccountEmail(e.target.value)
  }

  const handleUsernameChange = (e) =>{
    setUsername(e.target.value)
  }

  const handlePasswordChange = (e) =>{
    setPassword (e.target.value)
  }
  
  return (
    <div>

      <form>
        <div>
          <label htmlFor="">Username</label>
          <input type="text" />
        </div>

        <div>
          <label>Email</label>
          <input type="text" name="" id="" />
        </div>

        <div>
          <label htmlFor="">Password</label>
          <input type="password" />
        </div>

        <button>Sign Up</button>

      </form>

    </div>
  )
}

export default SignUp