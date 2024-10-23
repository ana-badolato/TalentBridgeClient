import "../App.css";
import "../CSS/navBar.css";
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import service from "../services/config"; // Importamos el servicio para llamadas API
import logoImg from "../assets/images/logoImg.svg";
import menuIcon from "../assets/icons/menu.svg"; 
import { FontWeight } from "@cloudinary/url-gen/qualifiers";

function NavbarDesktop({ profilePicture, username, isLoggedIn }) {
  const navigate = useNavigate();
  const { authenticateUser, loggedUserId } = useContext(AuthContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await service.get(`/notification/${loggedUserId}`);
        setNotifications(response.data);
        setUnreadNotificationCount(response.data.length);
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    if (isLoggedIn && loggedUserId) {
      fetchNotifications();
    }
  }, [loggedUserId, isLoggedIn]);

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

  const toggleNotificationsDropdown = () => {
    setIsDropdownOpen((prev) => !prev); 
  };

  const handleAcceptNotification = async (notificationId) => {
    try {
      await service.put(`/notification/${notificationId}/accept`);
      setNotifications(notifications.filter(notif => notif._id !== notificationId));
      setUnreadNotificationCount(unreadNotificationCount - 1); 
    } catch (error) {
      console.error("Error accepting notification", error);
    }
  };

  const handleRejectNotification = async (notificationId) => {
    try {
      await service.put(`/notification/${notificationId}/reject`);
      setNotifications(notifications.filter(notif => notif._id !== notificationId));
      setUnreadNotificationCount(unreadNotificationCount - 1); 
    } catch (error) {
      console.error("Error rejecting notification", error);
    }
  };
  const handleDeleteNotification = async (notificationId) => {
    try {
      await service.delete(`/notification/${notificationId}`);
      setNotifications(notifications.filter(notif => notif._id !== notificationId));
      setUnreadNotificationCount(unreadNotificationCount - 1); // Actualiza el contador
    } catch (error) {
      console.error("Error deleting notification", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="nav-left">
          <Link to="/" className="navbar-logo">
            <img src={logoImg} alt="Logo" />
          </Link>

          <Link to="/project"><p>Projects</p></Link>
          <Link to="/event"><p>Events</p></Link>
          <Link to="/user"><p>Talent</p></Link>
        </div>

        {isLoggedIn && (
          <div className="navbar-private">
            {/* Sección de Notificaciones */}
            <div className="notifications-menu" onClick={toggleNotificationsDropdown} style={{cursor: "pointer", position: "relative"}}>
              <p className="notifications-label">
                <span>{unreadNotificationCount > 0 ? unreadNotificationCount : ''}</span> 
                Notifications
              </p>
              <span className="dropdown-icon">&#9660;</span> {/* Icono de flecha hacia abajo */}

       {/* Dropdown de notificaciones */}
{isDropdownOpen && (
  <div className="dropdown-menu">
    {notifications.length === 0 ? (
      <p>No tienes nuevas notificaciones</p>
    ) : (
      notifications.map(notification => (
        <div key={notification._id} className="notification-item" style={{ position: 'relative' }}>
          
          {/* Botón de cierre (X) en la esquina superior derecha */}
          <button 
            onClick={() => handleDeleteNotification(notification._id)} 
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            &times; {/* Representación de "X" */}
          </button>

          {/* Notificación de Proyecto */}
          {notification.type === "action" ? (
            <div>
              <p>{notification.from.username} quiere unirse a tu proyecto {notification.project?.title}</p>
              <button onClick={() => handleAcceptNotification(notification._id)}>Aceptar</button>
              <button onClick={() => handleRejectNotification(notification._id)}>Rechazar</button>
            </div>
          ) : (
            // Notificación de Evento
            <div>
              <p>{notification.from.username} se ha unido a tu evento {notification.event?.name}</p>
            </div>
          )}
        </div>
      ))
    )}
  </div>
)}

            </div>

            {/* Perfil del usuario */}
            <div className="profile-menu" style={{ position: 'relative' }}>
              <div style={{display:"flex", gap:"8px", alignItems:"center", marginRight:"8px"}}>
                <img 
                  src={profilePicture || "/default-profile.png"} 
                  alt={username} 
                  className="profile-image"
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                  onClick={toggleMenu}
                />
                <p style={{fontWeight:"600"}}>{username}</p>
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
    </nav>
  );
}

export default NavbarDesktop;
