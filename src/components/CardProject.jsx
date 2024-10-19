import { Link } from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from "../context/auth.context.jsx"; // Importar el contexto de autenticación

function CardProject(props) {

  const { isLoggedIn, loggedUserId } = useContext(AuthContext);
  const isOwner = isLoggedIn && String(loggedUserId) === String(props.owner._id);

  return (
    <div>
      <h3>PROJECT</h3>
      <Link to={`/project/${props._id}`}>
      <img src={props.image} alt="" style={{width: "200px"}}/>
       {isOwner && props.isOwnProfile && (
      <div>
      <button>
        <img src="" alt="" />
        <p>Edit</p>
      </button>

      <button>
        <img src="" alt="" />
        <p>Delete</p>
      </button>
      </div>
      )}
      <p>{props.title}</p>
      <p>{props.category}</p>
      <p>{props.description}</p>
      <img src={props.owner.profilePicture} alt=""  style={{width:"64px"}}/>
      <p>Owner name: {props.owner.username}</p>
      </Link>
      <button>
        <img src="" alt="" />
        <p>Apply</p>
      </button>
    </div>
  )
}

export default CardProject