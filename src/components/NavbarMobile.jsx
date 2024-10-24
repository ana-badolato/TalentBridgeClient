import "../App.css";
import "../CSS/navBar.css";
import logout from "../assets/icons/logout.svg";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import service from "../services/config";
import logoImg from "../assets/images/logoImg.svg";
import menuIcon from "../assets/icons/menu.svg";

function NavbarMobile({ profilePicture, username, isLoggedIn }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { authenticateUser, loggedUserId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleLogOut = async () => {
    try {
      localStorage.removeItem("authToken");
      await authenticateUser();
      closeMenu();
      navigate("/");
    } catch (error) {
      console.log(error);
      navigate("/error");
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await service.get(`/notification/${loggedUserId}`);
        setNotifications(response.data);
        setUnreadNotificationCount(response.data.length);
      } catch (error) {
        console.error("Error fetching notifications", error);
        navigate("/error");
      }
    };

    if (isLoggedIn && loggedUserId) {
      fetchNotifications();
    }
  }, [loggedUserId, isLoggedIn]);

  const handleAcceptNotification = async (notificationId) => {
    try {
      await service.put(`/notification/${notificationId}/accept`);
      setNotifications(
        notifications.filter((notif) => notif._id !== notificationId)
      );
      setUnreadNotificationCount(unreadNotificationCount - 1);
    } catch (error) {
      console.error("Error accepting notification", error);
      navigate("/error");
    }
  };

  const handleRejectNotification = async (notificationId) => {
    try {
      await service.put(`/notification/${notificationId}/reject`);
      setNotifications(
        notifications.filter((notif) => notif._id !== notificationId)
      );
      setUnreadNotificationCount(unreadNotificationCount - 1);
    } catch (error) {
      console.error("Error rejecting notification", error);
      navigate("/error");
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await service.delete(`/notification/${notificationId}`);
      setNotifications(
        notifications.filter((notif) => notif._id !== notificationId)
      );
      setUnreadNotificationCount(unreadNotificationCount - 1);
    } catch (error) {
      console.error("Error deleting notification", error);
      navigate("/error");
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
            <Link to="/project" onClick={closeMenu}>
              <p>Projects</p>
            </Link>
            <hr style={{ borderColor: "#f3f3f3", margin: "8px 0" }} />
            <Link to="/event" onClick={closeMenu}>
              <p>Events</p>
            </Link>
            <hr style={{ borderColor: "#f3f3f3", margin: "8px 0" }} />
            <Link to="/user" onClick={closeMenu}>
              <p>Talent</p>
            </Link>

            {isLoggedIn && (
              <>
                <hr style={{ borderColor: "#f3f3f3", margin: "8px 0" }} />
                {/* Sección de Notificaciones */}
                <div
                  className="icon-text-element"
                  onClick={toggleNotifications}
                  style={{ cursor: "pointer" }}
                >
                  <p>
                    <span style={{ color: "#fa920a", fontWeight: "600" }}>
                      {unreadNotificationCount > 0
                        ? unreadNotificationCount
                        : ""}
                    </span>{" "}
                    Notifications
                  </p>
                </div>

                {isNotificationsOpen && (
                  <div className="notifications-dropdown">
                    {notifications.length === 0 ? (
                      <p>You have no new notifications</p>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className="notification-item"
                          style={{ position: "relative" }}
                        >
                          <button
                            onClick={() =>
                              handleDeleteNotification(notification._id)
                            }
                            style={{
                              position: "absolute",
                              top: "5px",
                              right: "5px",
                              background: "none",
                              border: "none",
                              fontSize: "16px",
                              cursor: "pointer",
                            }}
                          >
                            &times;
                          </button>
                          {notification.type === "action" ? (
                            <div className="notification-details">
                              <p>
                                <span>{notification.from.username}</span> wants
                                to join your project{" "}
                                <span>{notification.project?.title}</span>
                              </p>
                              <div className="buttons-notification">
                                <button
                                  className="button-notification-accept"
                                  onClick={() =>
                                    handleAcceptNotification(notification._id)
                                  }
                                >
                                  Accept
                                </button>
                                <button
                                  className="button-notification-decline"
                                  onClick={() =>
                                    handleRejectNotification(notification._id)
                                  }
                                >
                                  Decline
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="notification-details">
                              <p>
                                <span>{notification.from.username}</span> has
                                joined your event{" "}
                                <span>{notification.event?.name}</span>
                              </p>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                <hr style={{ borderColor: "#f3f3f3", margin: "8px 0" }} />

                <div
                  className="profile-menu"
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Link
                    to="/user/profile"
                    onClick={closeMenu}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src={profilePicture || "/default-profile.png"}
                      alt={username}
                      className="profile-image"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                      }}
                    />
                    <p style={{ fontWeight: "600" }}>{username}</p>
                  </Link>
                </div>
                <hr style={{ borderColor: "#f3f3f3", margin: "8px 0" }} />
                <div className="icon-text-element-nav">
                  <img src={logout} alt="" />
                  <p onClick={handleLogOut}>Log out</p>
                </div>
              </>
            )}

            {!isLoggedIn && (
              <>
                <hr
                  style={{
                    borderColor: "#f3f3f3",
                    borderWidth: "1px",
                    borderStyle: "solid",
                  }}
                />
                <Link to="/login" onClick={closeMenu}>
                  <p>Log in</p>
                </Link>
                <hr style={{ borderColor: "#f3f3f3", margin: "8px 0" }} />
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="button-large-yellow"
                >
                  <p>Get Started</p>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavbarMobile;
