import { Link } from "react-router-dom";
import "../CSS/notFound.css"

function NotFound() {
  return (
    <div className="not-found-main">
      <div className="not-found-container">
        <div>
          <h3 className="details-section" style={{  color: "#F8F9FC", fontSize: "40px"}}>Ooops, looks like you took a wrong turn!</h3>
        </div>

        <div className="lower-content">
          <div className="not-found-text">
            <p>Even the brightest talents get lost sometimes.</p>
            <p>Let's get you back to where opportunities await</p>
          </div>

          <Link to="/">
            <button className="button-large-yellow">Back to home</button>
          </Link>
        </div>
        
      </div>
    </div>
  )
}

export default NotFound