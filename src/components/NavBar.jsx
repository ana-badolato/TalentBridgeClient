import "../App.css";
import "../CSS/navBar.css";
import { useState, useEffect, useContext } from "react";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";
import { AuthContext } from "../context/auth.context";

function NavBar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { isLoggedIn, username, profilePicture } = useContext(AuthContext);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isMobile ? (
        <NavbarMobile
          isLoggedIn={isLoggedIn}
          profilePicture={profilePicture}
          username={username}
        />
      ) : (
        <NavbarDesktop
          isLoggedIn={isLoggedIn}
          profilePicture={profilePicture}
          username={username}
        />
      )}
    </>
  );
}

export default NavBar;
