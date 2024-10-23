import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div>
      <div>
        <h3>Ooops, looks like you took a wrong turn!</h3>
      </div>

      <div>
        <p>Even the brightest talents get los sometimes.</p>
        <p>Let's get you back to where opportunities await</p>
      </div>

      <Link to="/">
        <button>Back to home</button>
      </Link>
      
    </div>
  )
}

export default NotFound