import { Link } from "react-router-dom";
import "../App.css";
import "../CSS/callToAction.css";


function CallToAction() {
  return (
    <div className="call-container">
      <div className="call-text">
    <h2>Brigding ideas and investments</h2>
    <p className="call-subtitle">Don't just watch, join Talent Bridge today!</p>
      </div>
      <Link to="/signup" className="button-large-blue" style={{width:"178px"}}>
        <p>Join Talent Bridge</p>
      </Link>
    </div>
  )
}

export default CallToAction