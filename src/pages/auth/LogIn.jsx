import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context.jsx";
import service from "../../services/config.js";

function LogIn() {
  const navigate = useNavigate();
  const { authenticateUser } = useContext(AuthContext);

  const [accountEmail, setAccountEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAccountEmail = (e) => {
    setAccountEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogIn = async (e) => {
    e.preventDefault();

    try {
      const userCredentials = {
        accountEmail,
        password,
      };

      const response = await service.post("/auth/login", userCredentials);

      console.log(response);
      localStorage.setItem("authToken", response.data.authToken);

      await authenticateUser();
      navigate("/");
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      } else {
        navigate("/error");
      }
    }
  };

  return (
    <div className="new-project-container" style={{ height: "80vh" }}>
      <h3 className="details-section">Log In</h3>

      <form onSubmit={handleLogIn} className="project-form">
        <div>
          <label> Email</label>
          <input
            type="email"
            name="accountEmail"
            value={accountEmail}
            onChange={handleAccountEmail}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePassword}
          />
        </div>

        <button
          type="submit"
          className="submit-button"
          style={{ marginTop: "10px" }}
        >
          Log in
        </button>
        {errorMessage && <p>{errorMessage}</p>}
      </form>

      <p style={{ textAlign: "center" }}>Wanna join our grup of talents?</p>
      <p style={{ textAlign: "center" }}>
        Go to{" "}
        <Link to="/signup" style={{ color: "#FFBE1A", textAlign: "center" }}>
          {" "}
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default LogIn;
