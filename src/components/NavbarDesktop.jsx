import "../App.css";
import "../CSS/navBar.css";
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import service from "../services/config";
import logoImg from "../assets/images/logoImg.svg";
import user from "../assets/icons/user.svg";
import logout from "../assets/icons/logout.svg";

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
        navigate("/error");
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
      navigate("/error");
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
    <nav className="navbar">
      <div className="navbar-content">
        <div className="nav-left">
          <Link to="/" className="navbar-logo">
            <img src={logoImg} alt="Logo" />
          </Link>

          <Link to="/project">
            <p>Projects</p>
          </Link>
          <Link to="/event">
            <p>Events</p>
          </Link>
          <Link to="/user">
            <p>Talents</p>
          </Link>
        </div>

        {isLoggedIn && (
          <div className="navbar-private">
            <div
              className="notifications-menu"
              onClick={toggleNotificationsDropdown}
              style={{ cursor: "pointer", position: "relative" }}
            >
              <p className="notifications-label">
                <span>
                  {unreadNotificationCount > 0 ? unreadNotificationCount : ""}
                </span>
                Notifications
              </p>
              <span className="dropdown-icon">&#9660;</span>

              {isDropdownOpen && (
                <div className="dropdown-menu">
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
                              <span>{notification.from.username}</span> wants to
                              join your project{" "}
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
            </div>

            <div className="profile-menu" style={{ position: "relative" }}>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  marginRight: "8px",
                }}
              >
                <img
                  src={profilePicture || "/default-profile.png"}
                  alt={username}
                  className="profile-image"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  onClick={toggleMenu}
                />
                <p style={{ fontWeight: "600" }} onClick={toggleMenu}>
                  {username}
                </p>
              </div>
              <span className="dropdown-icon" onClick={toggleMenu}>
                &#9660;
              </span>

              {menuVisible && (
                <div className="dropdown-menu">
                  <Link
                    to="/user/profile"
                    onClick={() => setMenuVisible(false)}
                    className="icon-text-element-nav"
                  >
                    <img src={user} alt="" />
                    <p style={{ margin: "8px 0 16px 0" }}>Profile</p>
                  </Link>
                  <hr
                    style={{
                      borderColor: "#f3f3f3",
                      borderWidth: "1px",
                      borderStyle: "solid",
                    }}
                  />
                  <Link
                    to="/"
                    onClick={handleLogOut}
                    className="icon-text-element-nav"
                  >
                    <img src={logout} alt="" />
                    <p style={{ margin: "8px 0 16px 0" }}>Log out</p>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {!isLoggedIn && (
          <div className="navbar-auth">
            <Link to="/login">
              <p>Log in</p>
            </Link>
            <Link to="/signup" className="button-large-yellow">
              <p>Get Started</p>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavbarDesktop;
