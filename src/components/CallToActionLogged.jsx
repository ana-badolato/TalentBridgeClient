import { Link } from "react-router-dom";
import "../App.css";
import "../CSS/callToAction.css";


function CallToAction() {
  return (
    <div className="call-container">
      <div className="call-text">
    <h2>The future is full of talent - come and see for yourself!</h2>
    <p className="call-subtitle">Find creators, dreamers, and innovators shaping the world</p>
      </div>
      <Link to="/user" className="button-large-blue" style={{width:"178px"}}>
        <p style={{paddingLeft:"8px"}}>Discover Talents</p>
      </Link>
    </div>
  )
}

export default CallToAction