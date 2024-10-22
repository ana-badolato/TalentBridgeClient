import "../App.css";
import "../CSS/navBar.css";
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import logoImg from "../assets/images/logoImg.svg";
import menuIcon from "../assets/icons/menu.svg"; 

function NavbarDesktop({ profilePicture, username, isLoggedIn }) {
  const navigate = useNavigate();
  const { authenticateUser } = useContext(AuthContext);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogOut = async () => {
    try {
      localStorage.removeItem("authToken");
      await authenticateUser();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  const handleOutsideClick = (event) => {
    if (menuVisible && !event.target.closest('.profile-menu') && !event.target.closest('.menu-icon')) {
      setMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [menuVisible]);

  const isMobile = window.innerWidth <= 768;

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="nav-left">
          <Link to="/" className="navbar-logo">
            <img src={logoImg} alt="Logo" />
          </Link>

          {!isMobile && (
            <>
              <Link to="/project"><p>Projects</p></Link>
              <Link to="/event"><p>Events</p></Link>
              <Link to="/user"><p>Talent</p></Link>
            </>
          )}
        </div>

        {isMobile && (
          <img 
            src={menuIcon} 
            alt="Menu" 
            className="menu-icon" 
            onClick={toggleMenu} 
          />
        )}

        {!isMobile && isLoggedIn && (
          <div className="navbar-private">
            <div className="icon-text-element"><p><span>0</span> Notifications</p></div>
            <div className="icon-text-element"><p><span>0</span> Messages</p></div>

            <div className="profile-menu" style={{ position: 'relative' }}>
              <div style={{display:"flex", gap:"8px", alignItems:"center", marginRight:"8px"}}>

              <img 
                src={profilePicture || "/default-profile.png"} // Mostrar la imagen de perfil
                alt={username} 
                className="profile-image"
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                onClick={toggleMenu}
              />
              <p>{username}</p>
              </div>
              <span className="dropdown-icon" onClick={toggleMenu}>&#9660;</span>

              {menuVisible && (
                <div className="dropdown-menu">
                  <Link to="/user/profile" onClick={() => setMenuVisible(false)}>
                    <p>Profile</p>
                  </Link>
                  <Link to="/" onClick={handleLogOut}>
                    <p>Log out</p>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {!isLoggedIn && (
          <div className="navbar-auth">
            <Link to="/login"><p>Log in</p></Link>
            <Link to="/signup" className="button-large-yellow"><p>Get Started</p></Link>
          </div>
        )}
      </div>

      {isMobile && menuVisible && (
        <div className="dropdown-menu">
          <Link to="/project"><p>Projects</p></Link>
          <Link to="/event"><p>Events</p></Link>
          <Link to="/user"><p>Talent</p></Link>

          {isLoggedIn && (
            <div className="profile-menu">
              <Link to="/user/profile"><p>Profile</p></Link>
              <Link to="/" onClick={handleLogOut}><p>Log out</p></Link>
            </div>
          )}

          {!isLoggedIn && (
           <div>
              <Link to="/login"><p>Log in</p></Link>
              <Link to="/signup" className="button-large-yellow"><p>Get Started</p></Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default NavbarDesktop;
