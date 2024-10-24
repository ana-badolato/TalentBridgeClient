import { Link } from "react-router-dom"
import errorImg from "../assets/images/error.svg"

function Error() {
  return (
    <div className="not-found-main" style={{backgroundImage: `url(${errorImg})`}}>
      <div className="not-found-container">
        <div>
        <h3 className="details-section" style={{  color: "#F8F9FC", fontSize: "40px"}}>Oops, something went wrong!</h3>
        </div>

        <div className="lower-content">
          <div className="not-found-text">
        <p>Even the best projects face a few bumps.</p>
        <p>Let's get you back to discovering new talent and opportunities</p>
        </div>

        <Link to="/">
          <button className="button-large-yellow">Back to home</button>
        </Link>
        </div>
        
      </div>
    </div>
  )
}

export default Error