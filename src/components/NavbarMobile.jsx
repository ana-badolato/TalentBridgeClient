import "../App.css";
import "../CSS/navBar.css";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { AuthContext } from "../context/auth.context"; 
import logoImg from "../assets/images/logoImg.svg";
import menuIcon from "../assets/icons/menu.svg"; 

function NavbarMobile({ profilePicture, username, isLoggedIn }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { authenticateUser } = useContext(AuthContext);
  const navigate = useNavigate(); 

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const handleLogOut = async () => {
    try {
      localStorage.removeItem("authToken");
      await authenticateUser(); 
      closeMenu(); 
      navigate("/"); 
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="navbar-mobile">
      <div className="navbar-content">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src={logoImg} alt="Logo" />
        </Link>

        <img
          src={menuIcon}
          alt="Menu"
          className="menu-icon"
          onClick={toggleMenu}
        />

        {menuVisible && (
          <div className="dropdown-menu-mobile">
            <Link to="/project" onClick={closeMenu}><p>Projects</p></Link>
            <Link to="/event" onClick={closeMenu}><p>Events</p></Link>
            <Link to="/user" onClick={closeMenu}><p>Talent</p></Link>

            {isLoggedIn && (
              <>
                <div className="icon-text-element">
                  <p><span>0</span> Notifications</p>
                </div>
                <div className="icon-text-element">
                  <p><span>0</span> Messages</p>
                </div>

                {/* Mostrar la imagen de perfil y el nombre */}
                <div className="profile-menu">
                  <Link to="/user/profile" onClick={closeMenu} style={{display:"flex"}}>
                  <img
                    src={profilePicture || "/default-profile.png"}
                    alt={username}
                    className="profile-image"
                    style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                  />
                  <p>{username}</p>
                  </Link>
                </div>
                  <p onClick={handleLogOut}>Log out</p>
              </>
            )}

            {!isLoggedIn && (
              <>
                <Link to="/login" onClick={closeMenu}><p>Log in</p></Link>
                <Link to="/signup" onClick={closeMenu} className="button-large-yellow"><p>Get Started</p></Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavbarMobile;
