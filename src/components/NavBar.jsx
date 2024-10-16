import "../CSS/navBar.css"
import { Link } from 'react-router-dom'

function NavBar() {
  return (
    <div className="navbar">

    <Link to="/">
    <p>Home</p>
    </Link>

    <Link to="/signup">
    <p>Sign up</p>
    </Link>

    <Link to="/login">
    <p>Log in</p>
    </Link>

    <Link to="/profile">
    <p>Profile</p>
    </Link>

    <Link to="/">
    <p>Log out</p>
    </Link>

    </div>
    
  )
}

export default NavBar