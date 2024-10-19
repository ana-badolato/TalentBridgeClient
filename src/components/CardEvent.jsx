import { Link } from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from "../context/auth.context.jsx"; // Importar el contexto de autenticación

function CardEvent(props) {

  // Acceder al contexto de autenticación
  const { isLoggedIn, loggedUserId } = useContext(AuthContext);

  // Verificar si el usuario logueado es el propietario del evento
  const isOwner = isLoggedIn && String(loggedUserId) === String(props.owner._id);

  return (
    <div>
      <h3>EVENT</h3>
    <Link to={`/event/${props._id}`}>
      <img src={props.posterImage} alt=""  style={{width: "200px"}}/>
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
      <p>{props.name}</p>
      <p>{props.mainObjective}</p>
      <p>{props.date}</p>
      <p>{props.address}</p>
      <p>{props.owner.username}</p>
      {/* Botón Join deshabilitado según la prop isJoinDisabled */}
      <button disabled={props.isJoinDisabled} className="button-small-blue">
      <p>Join</p>
      </button>
    </Link>
    </div>
  )
}

export default CardEvent