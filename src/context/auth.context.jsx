import { createContext, useState, useEffect } from "react";
import service from "../services/config";
import { FadeLoader } from "react-spinners";

const AuthContext = createContext();

function AuthWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUserId, setLoggedUserId] = useState(null);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  useEffect(() => {
    authenticateUser();
  }, []);

  const authenticateUser = async () => {
    try {
      const response = await service.get("/auth/verify");
      console.log(response);
      setIsLoggedIn(true);
      setLoggedUserId(response.data._id);
      setUsername(response.data.username);
      setProfilePicture(response.data.profilePicture);
      setIsValidatingToken(false);
      setContactEmail(response.data.contactEmail);
    } catch (error) {
      console.log(error);
      setIsLoggedIn(false);
      setLoggedUserId(null);
      setIsValidatingToken(false);
      setUsername("");
      setProfilePicture("");
    }
  };

  const passedContext = {
    isLoggedIn,
    loggedUserId,
    username,
    profilePicture,
    contactEmail,
    authenticateUser,
  };

  if (isValidatingToken) {
    return (
      <>
        <h4>...validating token</h4>
        <FadeLoader color="#FFBE1A" />
      </>
    );
  }

  return (
    <AuthContext.Provider value={passedContext}>
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthWrapper };
