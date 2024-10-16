import "../CSS/navBar.css"
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function NavBar() {

  const navigate = useNavigate()
  const {isLoggedIn, authenticateUser} = useContext(AuthContext)

  const handleLogOut = async () => {
    try {
      localStorage.removeItem("authToken")
      await authenticateUser()
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <nav className="navbar">

    <Link to="/">
    <p>Home</p>
    </Link>

    {!isLoggedIn  && <Link to="/signup">
    <p>Sign up</p>
    </Link>}

    {!isLoggedIn && <Link to="/login">
    <p>Log in</p>
    </Link>}

    {isLoggedIn  && <Link to="/profile">
    <p>Profile</p>
    </Link>}

    {isLoggedIn && <Link onClick={handleLogOut} to="/">
    <p>Log out</p>
    </Link>}

    </nav>
    
  )
}

export default NavBar