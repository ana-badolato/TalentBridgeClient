import "../App.css";
import "../CSS/navBar.css";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function NavBar() {
  const navigate = useNavigate();
  const { isLoggedIn, authenticateUser } = useContext(AuthContext);

  const handleLogOut = async () => {
    try {
      localStorage.removeItem("authToken");
      await authenticateUser();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-logo">
          <p>Home</p>
        </Link>

        <p>Projects</p>

        <Link to="/talent">
          <p>Talent</p>
        </Link>

        <p>Events</p>

        {!isLoggedIn && (
          <Link to="/login">
            <p>Log in</p>
          </Link>
        )}

        {!isLoggedIn && (
          <Link to="/signup" className="button-large-yellow">
            <p>Get Started</p>
          </Link>
        )}
        <div className="navbar-private">
          {isLoggedIn && (
            <Link to="/profile" className="icon-text-element">
              <img src="" alt="" />
              <p>Profile</p>
            </Link>
          )}

          {isLoggedIn && (
            //!cambiar div por Link cuando tengamos las páginas
            <div className="icon-text-element">
              <img src="" alt="" />
              <p>
                <span>0</span>Notifications
              </p>
            </div>
          )}

          {isLoggedIn && (
            //!cambiar div por Link cuando tengamos las páginas
            <div className="icon-text-element">
              <img src="" alt="" />
              <p>
                <span>0</span>Messages
              </p>
            </div>
          )}

          {isLoggedIn && (
            <Link onClick={handleLogOut} to="/" className="icon-text-element">
              <img src="" alt="" />
              <p>Log out</p>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
