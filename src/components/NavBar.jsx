import "../App.css";
import "../CSS/navBar.css";
import { useState, useEffect, useContext } from "react";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";
import { AuthContext } from "../context/auth.context"; // Importamos el contexto

function NavBar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { isLoggedIn, username, profilePicture } = useContext(AuthContext); // Obtenemos isLoggedIn, username y profilePicture del contexto

  // Detectar si es móvil
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
          profilePicture={profilePicture} // Pasamos la imagen de perfil desde el contexto
          username={username} // Pasamos el nombre de usuario desde el contexto
        />
      ) : (
        <NavbarDesktop
          isLoggedIn={isLoggedIn}
          profilePicture={profilePicture} // Pasamos la imagen de perfil desde el contexto
          username={username} // Pasamos el nombre de usuario desde el contexto
        />
      )}
    </>
  );
}

export default NavBar;
